import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";
import { FormError, FormFieldError } from "./errors";

export type ServerFunctionResult<Result> = {
  _form: SubmissionResult<string[]> | null | undefined;
  result?: Result;
};

export type Handler<Schema extends z.ZodTypeAny, Result> = (props: {
  prevState: unknown;
  value: z.infer<Schema>;
}) => Promise<Result> | Result;

export function createFormAction<Schema extends z.ZodTypeAny, Result>(
  schema: Schema,
  handler: Handler<Schema, Result>,
) {
  return async (prevState: unknown, formData: FormData) => {
    return await handleFormAction(schema, prevState, formData, handler);
  };
}

export async function handleFormAction<Schema extends z.ZodTypeAny, Result>(
  schema: Schema,
  prevState: unknown,
  formData: FormData,
  handler: Handler<Schema, Result>,
): Promise<ServerFunctionResult<Result>> {
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return {
      _form: submission.reply(),
    };
  }

  try {
    const result = await handler({
      prevState,
      value: submission.value,
    });

    return {
      _form: submission.reply({
        formErrors: ["An unexpected error occurred"],
      }),
      result,
    };
  } catch (err) {
    if (err instanceof FormFieldError) {
      return {
        _form: submission.reply({
          fieldErrors: {
            [err.field]: [err.message],
          },
        }),
      };
    }

    if (err instanceof FormError) {
      return {
        _form: submission.reply({
          formErrors: [err.message],
        }),
      };
    }

    console.error(err);
    return {
      _form: submission.reply({
        formErrors: ["An unexpected error occurred"],
      }),
    };
  }

  return {
    _form: null,
  };
}
