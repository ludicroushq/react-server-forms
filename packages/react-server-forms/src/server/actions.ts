import type { Submission, SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";
import type { FormError, FormFieldError } from "./errors";

export type ServerFunctionResult<Result> = {
  _form: SubmissionResult<string[]> | null | undefined;
} & (
  | {
      state: "error";
    }
  | {
      state: "success";
      result: Result;
    }
);

export type Handler<Schema extends z.ZodObject<any>, Result> = (props: {
  prevState: unknown;
  value: z.infer<Schema>;
  submission: Submission<z.input<Schema>, string[], z.output<Schema>>;
}) => Promise<Result> | Result;

export function createFormAction<Schema extends z.ZodObject<any>, Result>(
  schema: Schema,
  handler: Handler<Schema, Result>,
) {
  return async (prevState: unknown, formData: FormData) => {
    return await handleFormAction(schema, prevState, formData, handler);
  };
}

export async function handleFormAction<Schema extends z.ZodObject<any>, Result>(
  schema: Schema,
  prevState: unknown,
  formData: FormData,
  handler: Handler<Schema, Result>,
): Promise<ServerFunctionResult<Result>> {
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return {
      _form: submission.reply(),
      state: "error",
    };
  }

  try {
    const result = await handler({
      prevState,
      value: submission.value,
      submission,
    });

    return {
      _form: submission.reply({
        resetForm: true,
      }),
      state: "success",
      result,
    };
  } catch (err) {
    if (typeof err === "object" && err !== null && "name" in err) {
      if (err.name === "FormFieldError") {
        const fieldError = err as FormFieldError<Schema>;
        return {
          _form: submission.reply({
            fieldErrors: {
              [fieldError.field]: [fieldError.message],
            },
          }),
          state: "error",
        };
      }

      if (err.name === "FormError") {
        const formError = err as FormError;
        return {
          _form: submission.reply({
            formErrors: [formError.message],
          }),
          state: "error",
        };
      }

      if (err.name === "NEXT_REDIRECT") {
        throw err;
      }
    }
    console.error(err);
    return {
      _form: submission.reply({
        formErrors: ["An unexpected error occurred"],
      }),
      state: "error",
    };
  }
}
