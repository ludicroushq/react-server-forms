"use client";
import type { JSONSchema7 } from "json-schema";
import { match } from "ts-pattern";
import { submitConfigSchema } from "../schema/d";
import type { BaseRenderArgs } from "./form-renderer";
import { useReactServerForms } from "./provider";

// Base field type with common properties
export interface BaseField {
  name: string;
  label?: string;
  required?: boolean;
  hidden?: boolean;
}

// Specific field types that map to form renderer components
export interface TextField extends BaseField {
  type: "text" | "email" | "url";
}

export interface TextareaField extends BaseField {
  type: "textarea";
}

export interface NumberField extends BaseField {
  type: "number";
}

export interface DateField extends BaseField {
  type: "date";
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
}

export interface SelectField extends BaseField {
  type: "select";
  enumValues: string[];
  options?: Record<string, string>;
}

// Union type for all possible field types
export type FormField =
  | TextField
  | TextareaField
  | NumberField
  | DateField
  | CheckboxField
  | SelectField;
// | ObjectField
// | ArrayField;

export type FieldMetadata = {
  name: string;
  value?: string | number | boolean;
  id: string;
};

export type FormFieldProps = {
  field: FormField;
  defaultValue?: unknown;
  isPending: boolean;
  errors?: string[];
};

export function RenderSubmit({
  schema,
  isPending,
}: {
  schema: JSONSchema7;
  isPending: boolean;
}) {
  // Parse configuration from schema description if available
  const config = schema.description ? JSON.parse(schema.description) : {};
  const submitConfig = submitConfigSchema.parse(config);
  const { formRenderer } = useReactServerForms();

  return formRenderer.Submit({
    buttonProps: { type: "submit" },
    isPending,
    label: submitConfig.submit?.label ?? "Submit",
  });
}

export function RenderFormField({
  field,
  defaultValue,
  isPending,
  errors,
}: FormFieldProps) {
  const { formRenderer } = useReactServerForms();

  const baseProps: BaseRenderArgs = {
    label: field.label ?? field.name,
    isPending,
    required: field.required,
  };

  const input = match(field)
    .with({ hidden: true }, () => {
      return (
        <input
          type="hidden"
          name={field.name}
          defaultValue={defaultValue as string}
          id={field.name}
        />
      );
    })
    .with({ type: "text" }, { type: "email" }, { type: "url" }, (field) => {
      return (
        <formRenderer.Text
          {...baseProps}
          inputProps={{
            type: field.type,
            name: field.name,
            defaultValue: defaultValue as string,
            id: field.name,
            required: field.required,
          }}
        />
      );
    })
    .with({ type: "textarea" }, (field) => {
      return (
        <formRenderer.Textarea
          {...baseProps}
          textareaProps={{
            name: field.name,
            defaultValue: defaultValue as string,
            id: field.name,
            required: field.required,
          }}
        />
      );
    })
    .with({ type: "number" }, (field) => {
      return (
        <formRenderer.Number
          {...baseProps}
          inputProps={{
            type: field.type,
            name: field.name,
            defaultValue: defaultValue as string,
            id: field.name,
            required: field.required,
          }}
        />
      );
    })
    .with({ type: "date" }, (field) => {
      return (
        <formRenderer.Date
          {...baseProps}
          inputProps={{
            type: field.type,
            name: field.name,
            defaultValue: defaultValue
              ? new Date(defaultValue as string).toISOString().split("T")[0]
              : "",
            id: field.name,
            required: field.required,
          }}
        />
      );
    })
    .with({ type: "checkbox" }, (field) => {
      return (
        <formRenderer.Checkbox
          {...baseProps}
          inputProps={{
            name: field.name,
            type: "checkbox",
            defaultChecked: !!defaultValue,
          }}
        />
      );
    })
    .with({ type: "select" }, (field) => {
      const emptyOption = {
        label: "Select an option",
        optionProps: { value: "", disabled: field.required },
      };
      return (
        <formRenderer.Select
          {...baseProps}
          selectProps={{
            name: field.name,
            required: field.required,
            defaultValue: defaultValue ? (defaultValue as string) : undefined,
          }}
          options={[
            emptyOption,
            ...field.enumValues.map((value) => ({
              label: field.options?.[value] ?? value,
              optionProps: { value },
            })),
          ]}
        />
      );
    })
    .exhaustive();

  return <formRenderer.Fieldset errors={errors}>{input}</formRenderer.Fieldset>;
}
