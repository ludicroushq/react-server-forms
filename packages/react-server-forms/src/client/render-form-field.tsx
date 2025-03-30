"use client";
import { type JSX } from "react";
import { z } from "zod";
import { useReactServerForms } from "./provider";
import type { FormField } from "../schema/zod";

function safeCall<T extends (...args: any[]) => JSX.Element>(
  renderer: T | undefined,
  name: string,
): T {
  if (!renderer) {
    throw new Error(`No renderer provided for ${name}.`);
  }
  return renderer;
}

export const rootConfigSchema = z.object({
  label: z.string().optional(),
  hidden: z.boolean().optional(),
});

export const stringConfigSchema = z.object({
  type: z.enum(["text", "email", "url", "textarea"]).optional(),
});

export const enumConfigSchema = z.object({
  type: z.enum(["select"]).optional(),
});

export const selectEnumConfigSchema = z.object({
  options: z.record(z.string(), z.string()).optional(),
});

export const submitConfigSchema = z.object({
  submit: z
    .object({
      label: z.string().optional(),
    })
    .optional(),
});

export type FieldMetadata = {
  name: string;
  value?: string | number | boolean;
  id: string;
};

export type FormFieldProps = {
  field: FormField;
  defaultValue?: unknown;
  isPending: boolean;
};

export function RenderSubmit<TSchema extends z.ZodType>({
  schema,
  isPending,
}: {
  schema: TSchema;
  isPending: boolean;
}) {
  const config: unknown = JSON.parse(schema.description ?? "{}");
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
}: FormFieldProps) {
  const { formRenderer } = useReactServerForms();

  if (field.hidden) {
    return (
      <input
        type="hidden"
        name={field.name}
        defaultValue={defaultValue as string}
        id={field.name}
      />
    );
  }

  switch (field.type) {
    case "string": {
      const type = field.config?.type ?? "text";

      if (type === "textarea") {
        return safeCall(
          formRenderer.Textarea,
          "Textarea",
        )({
          label: field.label ?? field.name,
          textareaProps: {
            name: field.name,
            defaultValue: defaultValue as string,
            id: field.name,
          },
          isPending,
        });
      }

      return safeCall(
        formRenderer.Text,
        "Text",
      )({
        label: field.label ?? field.name,
        inputProps: {
          type,
          name: field.name,
          defaultValue: defaultValue as string,
          id: field.name,
        },
        isPending,
      });
    }

    case "number": {
      return safeCall(
        formRenderer.Number,
        "Number",
      )({
        label: field.label ?? field.name,
        inputProps: {
          type: "number",
          name: field.name,
          defaultValue: defaultValue as number,
          id: field.name,
        },
        isPending,
      });
    }

    case "boolean": {
      return safeCall(
        formRenderer.Checkbox,
        "Checkbox",
      )({
        label: field.label ?? field.name,
        inputProps: {
          type: "checkbox",
          name: field.name,
          defaultChecked: defaultValue as boolean,
          id: field.name,
        },
        isPending,
      });
    }

    case "date": {
      return safeCall(
        formRenderer.Date,
        "Date",
      )({
        label: field.label ?? field.name,
        inputProps: {
          type: "date",
          name: field.name,
          defaultValue: defaultValue as string,
          id: field.name,
        },
        isPending,
      });
    }

    case "enum": {
      if (!field.enumValues) {
        throw new Error(`Enum field "${field.name}" must have enumValues.`);
      }

      return safeCall(
        formRenderer.Select,
        "Select",
      )({
        label: field.label ?? field.name,
        selectProps: {
          name: field.name,
          defaultValue: defaultValue as string,
          id: field.name,
        },
        options: [
          {
            label: "Select an option",
            optionProps: { value: "", disabled: true },
          },
          ...field.enumValues.map((value) => ({
            label: field.config?.options?.[value] ?? value,
            optionProps: { value },
          })),
        ],
        isPending,
      });
    }

    case "object": {
      if (!field.fields) {
        throw new Error(`Object field "${field.name}" must have fields.`);
      }

      return (
        <div>
          {field.label && <label>{field.label}</label>}
          <div>
            {Object.entries(field.fields).map(([key, subField]) => (
              <RenderFormField
                key={key}
                field={subField}
                defaultValue={
                  defaultValue
                    ? (defaultValue as Record<string, unknown>)[key]
                    : undefined
                }
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      );
    }

    case "array": {
      if (!field.items) {
        throw new Error(`Array field "${field.name}" must have items.`);
      }

      const items = field.items;

      return (
        <div>
          {field.label && <label>{field.label}</label>}
          <div>
            {(Array.isArray(defaultValue) ? defaultValue : []).map(
              (value: unknown, index: number) => (
                <RenderFormField
                  key={index}
                  field={{
                    ...items,
                    name: `${field.name}[${index}]`,
                  }}
                  defaultValue={value}
                  isPending={isPending}
                />
              ),
            )}
          </div>
        </div>
      );
    }

    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }
}
