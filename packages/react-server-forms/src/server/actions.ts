import type { z } from "zod";
import type { FormError, FormFieldError } from "./errors";

export type ServerFunctionResponse<Schema extends z.ZodObject<any>, Result> =
  | {
      state: "error";
      formErrors: string[];
      fieldErrors: Partial<Record<keyof z.output<Schema>, string[]>>;
    }
  | {
      state: "success";
      result: Result;
    };

export type Handler<Schema extends z.ZodObject<any>, Result> = (props: {
  data: z.infer<Schema>;
  prevState: ServerFunctionResponse<Schema, Result> | null;
  formData: FormData;
}) => Promise<Result> | Result;

export type ServerFunction<Schema extends z.ZodObject<any>, Result> = (
  prevState: ServerFunctionResponse<Schema, Result> | null,
  formData: FormData,
) => Promise<ServerFunctionResponse<Schema, Result>>;

export function createFormAction<Schema extends z.ZodObject<any>, Result>(
  schema: Schema,
  handler: Handler<Schema, Result>,
) {
  return async (
    prevState: ServerFunctionResponse<Schema, Result> | null,
    formData: FormData,
  ) => {
    return await handleFormAction(schema, prevState, formData, handler);
  };
}

export async function handleFormAction<Schema extends z.ZodObject<any>, Result>(
  schema: Schema,
  prevState: ServerFunctionResponse<Schema, Result> | null,
  formData: FormData,
  handler: Handler<Schema, Result>,
): Promise<ServerFunctionResponse<Schema, Result>> {
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    return {
      state: "error",
      formErrors: errors.formErrors,
      fieldErrors: errors.fieldErrors as Record<
        keyof z.output<Schema>,
        string[]
      >,
    };
  }

  try {
    const result = await handler({
      prevState,
      data: parsed.data,
      formData,
    });

    return {
      state: "success",
      result,
    };
  } catch (err) {
    if (typeof err === "object" && err !== null) {
      if ("name" in err && err.name === "FormFieldError") {
        const fieldError = err as FormFieldError<Schema>;
        return {
          state: "error",
          formErrors: [],
          fieldErrors: {
            [fieldError.field]: [fieldError.message],
          } as Record<keyof z.output<Schema>, string[]>,
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
