"use client";
import { useActionState, useEffect } from "react";
import type { SchemaValidator, ServerFunction } from "../server/actions";
import { log } from "../utils/log";
import { useReactServerForms } from "./provider";
import { RenderFormField, RenderSubmit } from "./render-form-field";
import { jsonSchemaToFormFields } from "./json-schema";

export type DefaultValue<T> = {
  [K in keyof T]?: T[K];
};

export function RenderForm<Schema, Result = Schema>({
  action,
  schema,
  onSuccess,
  defaultValue,
}: {
  action: ServerFunction<Schema, Result>;
  schema: SchemaValidator<Schema>;
  onSuccess?: (result: Result) => void;
  defaultValue?: DefaultValue<Schema>;
}) {
  const { formRenderer } = useReactServerForms();
  const [prevState, dispatch, isPending] = useActionState(action, null);

  useEffect(() => {
    if (prevState?.state === "success" && onSuccess) {
      onSuccess(prevState.result as Result);
    }
  }, [onSuccess, prevState]);

  const jsonSchema = schema.getJsonSchema();
  log("jsonSchema", jsonSchema);

  const formFields = jsonSchemaToFormFields(jsonSchema);

  log("formFields", formFields);

  log("prevState", prevState);

  return (
    <formRenderer.Form
      formProps={{
        action: dispatch,
      }}
      errors={
        prevState?.state === "error" && prevState.formErrors.length > 0
          ? prevState.formErrors
          : undefined
      }
    >
      {formFields.map((field) => (
        <RenderFormField
          key={field.name}
          field={field}
          defaultValue={
            prevState?.state === "error"
              ? prevState.values[field.name as keyof Result]
              : defaultValue?.[field.name as keyof Schema]
          }
          isPending={isPending}
          errors={
            prevState?.state === "error" &&
            (prevState.fieldErrors[field.name as string]?.length || 0) > 0
              ? prevState.fieldErrors[field.name as string]
              : undefined
          }
        />
      ))}
      <RenderSubmit schema={jsonSchema} isPending={isPending} />
    </formRenderer.Form>
  );
}
