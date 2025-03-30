import type { JSONSchema7 } from "json-schema";
import type { FormError, FormFieldError } from "./errors";

export interface SchemaValidator<T> {
  validate: (data: unknown) => ValidationResult<T>;
  getJsonSchema: () => JSONSchema7;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  };
}

export type ServerFunctionResponse<Result> =
  | {
      state: "error";
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    }
  | {
      state: "success";
      result: Result;
    };

export type Handler<T, Result = T> = (props: {
  data: T;
  prevState: ServerFunctionResponse<Result> | null;
  formData: FormData;
}) => Promise<Result> | Result;

export type ServerFunction<T, Result = T> = (
  prevState: ServerFunctionResponse<Result> | null,
  formData: FormData,
) => Promise<ServerFunctionResponse<Result>>;

export function createFormAction<T, Result = T>(
  schema: SchemaValidator<T>,
  handler: Handler<T, Result>,
): ServerFunction<T, Result> {
  return async (
    prevState: ServerFunctionResponse<Result> | null,
    formData: FormData,
  ) => {
    return await handleFormAction(schema, prevState, formData, handler);
  };
}

export async function handleFormAction<T, Result = T>(
  schema: SchemaValidator<T>,
  prevState: ServerFunctionResponse<Result> | null,
  formData: FormData,
  handler: Handler<T, Result>,
): Promise<ServerFunctionResponse<Result>> {
  const validationResult = schema.validate(formData);

  if (!validationResult.success) {
    return {
      state: "error",
      formErrors: validationResult.errors?.formErrors || [],
      fieldErrors: validationResult.errors?.fieldErrors || {},
    };
  }

  try {
    const result = await handler({
      prevState,
      data: validationResult.data as T,
      formData,
    });

    return {
      state: "success",
      result,
    };
  } catch (err) {
    if (typeof err === "object" && err !== null) {
      if ("name" in err && err.name === "FormFieldError") {
        const fieldError = err as FormFieldError;
        return {
          state: "error",
          formErrors: [],
          fieldErrors: {
            [fieldError.field]: [fieldError.message],
          } as Record<string, string[]>,
        };
      }

      if ("name" in err && err.name === "FormError") {
        const formError = err as FormError;
        return {
          formErrors: [formError.message],
          fieldErrors: {},
          state: "error",
        };
      }

      if ("message" in err && err.message === "NEXT_REDIRECT") {
        throw err;
      }
    }
    console.error(err);
    return {
      formErrors: ["An unexpected error occurred"],
      fieldErrors: {},
      state: "error",
    };
  }
}
