"use client";
import {
  getFormProps,
  useForm,
  type FieldMetadata,
  type Submission,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { startTransition, useActionState, useEffect } from "react";
import type { z } from "zod";
import type { ServerFunctionResult } from "../server/actions";
import { useReactServerForms } from "./provider";
import { RenderFormField, RenderSubmit } from "./render-form-field";

export function RenderForm<Schema extends z.ZodObject<any>, Result>({
  action,
  schema,
  onSuccess,
}: {
  action: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<ServerFunctionResult<Result>>;
  schema: Schema;
  onSuccess?: (result: Result) => void;
}) {
  const [lastResult, execute, isPending] = useActionState(action, undefined);
  const [form, fields] = useForm<Schema>({
    lastResult: lastResult?._form,
    constraint: getZodConstraint(schema),
    // https://github.com/edmundhung/conform/discussions/606#discussioncomment-9680781
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(async () => {
        await execute(formData);
      });
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      }) as Submission<Schema, string[], Schema>;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const { formRenderer } = useReactServerForms();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!lastResult || lastResult.state === "error") {
      return;
    }

    onSuccess?.(lastResult.result);
  }, [isPending, lastResult, onSuccess]);

  return (
    <formRenderer.Form
      key={form.key}
      errors={form.errors}
      formProps={{
        action: execute,
        ...getFormProps(form),
      }}
    >
      {Object.keys(schema.shape).map((key) => (
        <RenderFormField
          key={key}
          fields={fields as Record<keyof Schema["shape"], FieldMetadata>}
          schema={schema}
          fieldKey={key as keyof typeof schema.shape}
          isPending={isPending}
        />
      ))}
      <RenderSubmit schema={schema} isPending={isPending} />
    </formRenderer.Form>
  );
}
