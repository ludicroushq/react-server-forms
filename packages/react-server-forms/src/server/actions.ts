import type { JSONSchema7 } from "json-schema";
import type { FormError, FormFieldError } from "./errors";
import { log } from "debug";
import { jsonSchemaToFormFields } from "../client/json-schema";

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
      values: Partial<Result>;
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
  const formDataObject: Record<
    string,
    string | number | File | boolean | Date | undefined
  > = Object.fromEntries(formData.entries());
  // properly cast formDataObject to T.
  const formFields = jsonSchemaToFormFields(schema.getJsonSchema());
  for (const field of formFields) {
    if (field.type === "number") {
      formDataObject[field.name] = Number(formDataObject[field.name]);
    }
    if (field.type === "checkbox") {
      formDataObject[field.name] = formDataObject[field.name] === "on";
    }

    if (field.type === "select" && formDataObject[field.name] === "") {
      formDataObject[field.name] = undefined;
    }

    if (field.type === "date") {
      formDataObject[field.name] = new Date(
        formDataObject[field.name] as string,
      );
    }
  }
  const validationResult = schema.validate(formDataObject);

  log("validationResult", validationResult);
  if (!validationResult.success) {
    const response = {
      state: "error",
      formErrors: validationResult.errors?.formErrors || [],
      fieldErrors: validationResult.errors?.fieldErrors || {},
      values: formDataObject as Partial<Result>,
    } as const;
    log("validation error, returning response", response);
    return response;
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
          values: formDataObject as Partial<Result>,
        };
      }

      if ("name" in err && err.name === "FormError") {
        const formError = err as FormError;
        return {
          formErrors: [formError.message],
          fieldErrors: {},
          state: "error",
          values: formDataObject as Partial<Result>,
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
      values: formDataObject as Partial<Result>,
    };
  }
}
