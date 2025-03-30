"use client";
import { useActionState, useTransition } from "react";
import type { z } from "zod";
import type { SchemaValidator, ServerFunction } from "../server/actions";
import { useReactServerForms } from "./provider";
import { RenderFormField, RenderSubmit } from "./render-form-field";

export type DefaultValue<T> = {
  [K in keyof T]?: T[K];
};

export function RenderForm<Schema>({
  action,
  schema,
  onSuccess,
  defaultValue,
}: {
  action: ServerFunction<Schema>;
  schema: SchemaValidator<Schema>;
  onSuccess?: (result: Schema) => void;
  defaultValue?: DefaultValue<Schema>;
}) {
  const { formRenderer } = useReactServerForms();
  const [prevState, dispatch, isPending] = useActionState(action, null);

  const jsonSchema = schema.getJsonSchema();

  return (
    <formRenderer.Form
      formProps={{
        action: dispatch,
      }}
    >
      {Object.entries(schema.fields).map(([key, field]) => (
        <RenderFormField
          key={key}
          field={field}
          defaultValue={defaultValue?.[key as keyof z.infer<Schema>]}
          isPending={isPending}
        />
      ))}
      <RenderSubmit schema={schema._schema} isPending={isPending} />
    </formRenderer.Form>
  );
}
