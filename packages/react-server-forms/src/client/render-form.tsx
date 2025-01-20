"use client";
import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import type { z } from "zod";
import type { ServerFunctionResult } from "../server/actions";
import { RenderFormField, RenderSubmit } from "./render-form-field";

export function RenderForm<Schema extends z.ZodObject<any>, Result>({
  action,
  schema,
}: {
  action: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<ServerFunctionResult<Result>>;
  schema: Schema;
}) {
  const [lastResult, execute, isPending] = useActionState(action, undefined);
  const [form, fields] = useForm({
    lastResult: lastResult?._form,
    constraint: getZodConstraint(schema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <form action={execute} {...getFormProps(form)}>
      {Object.keys(schema.shape).map((key) => (
        <RenderFormField
          key={key}
          fields={fields}
          schema={schema}
          fieldKey={key as keyof typeof schema.shape}
          isPending={isPending}
        />
      ))}
      <RenderSubmit schema={schema} isPending={isPending} />
    </form>
  );
}
