"use client";
import {
  getInputProps,
  getSelectProps,
  getTextareaProps,
  type FieldMetadata,
} from "@conform-to/react";
import _ from "lodash";
import { type JSX } from "react";
import { z } from "zod";
import type { FormRendererOptions } from "./form-renderer";

function safeCall<T extends (...args: any[]) => JSX.Element>(
  renderer: T | undefined,
  name: string,
): T {
  if (!renderer) {
    throw new Error(`No renderer provided for ${name}.`);
  }
  return renderer;
}

function getStringInputType(schema: z.ZodString) {
  const checks = schema._def.checks ?? [];
  for (const check of checks) {
    if (check.kind === "email") {
      return "email" as const;
    }
    if (check.kind === "url") {
      return "url" as const;
    }
  }
  return "text" as const;
}

export const rootConfigSchema = z.object({
  label: z.string().optional(),
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

export type FormFieldProps<
  TSchema extends z.ZodObject<any>,
  TKey extends keyof TSchema["shape"],
> = {
  fields: Record<keyof TSchema["shape"], FieldMetadata>;
  schema: TSchema;
  fieldKey: TKey;
  formRenderer: FormRendererOptions;
  isPending: boolean;
};

export function RenderSubmit<
  TSchema extends z.ZodObject<any>,
  TKey extends keyof TSchema["shape"],
>({
  schema,
  formRenderer,
  isPending,
}: Pick<
  FormFieldProps<TSchema, TKey>,
  "schema" | "formRenderer" | "isPending"
>) {
  const config: unknown = JSON.parse(schema.description ?? "{}");
  const submitConfig = submitConfigSchema.parse(config);

  return formRenderer.Submit({
    buttonProps: { type: "submit" },
    isPending,
    label: submitConfig.submit?.label ?? "Submit",
  });
}

export function RenderFormField<
  TSchema extends z.ZodObject<any>,
  TKey extends keyof TSchema["shape"],
>({
  fields,
  schema,
  fieldKey,
  formRenderer,
  isPending,
}: FormFieldProps<TSchema, TKey>) {
  const field = fields[fieldKey];
  const fieldSchema: z.ZodTypeAny = schema.shape[fieldKey];

  // If it's an object with nested fields, bail out for now
  if (fieldSchema._def.typeName === "ZodObject") {
    if (Object.keys((fieldSchema as z.ZodObject<any>).shape).length > 1) {
      throw new Error("Nested objects are not supported yet");
    }
  }

  const config: unknown = JSON.parse(fieldSchema.description ?? "{}");
  const rootConfig = rootConfigSchema.parse(config);

  const label = rootConfig.label ?? field.name;
  const error = field.errors?.[0];

  // Handle ZodString
  if (fieldSchema._def.typeName === "ZodString") {
    const stringSchema = fieldSchema as z.ZodString;
    const derivedType =
      stringConfigSchema.parse(config).type ?? getStringInputType(stringSchema);

    // If user specified "textarea"
    if (derivedType === "textarea") {
      return safeCall(
        formRenderer.Textarea,
        "Textarea",
      )({
        label,
        error,
        textareaProps: _.omit(getTextareaProps(field, {}), "key"),
        isPending,
      });
    }

    // Otherwise treat as standard text input
    return safeCall(
      formRenderer.Text,
      "Text",
    )({
      label,
      error,
      inputProps: _.omit(getInputProps(field, { type: derivedType }), "key"),
      isPending,
    });
  }

  // Handle ZodNumber
  if (fieldSchema._def.typeName === "ZodNumber") {
    return safeCall(
      formRenderer.Number,
      "Number",
    )({
      label,
      error,
      inputProps: _.omit(getInputProps(field, { type: "number" }), "key"),
      isPending,
    });
  }

  // Handle ZodBoolean
  if (fieldSchema._def.typeName === "ZodBoolean") {
    return safeCall(
      formRenderer.Checkbox,
      "Checkbox",
    )({
      label,
      error,
      inputProps: _.omit(getInputProps(field, { type: "checkbox" }), "key"),
      isPending,
    });
  }

  // Handle ZodDate
  if (fieldSchema._def.typeName === "ZodDate") {
    return safeCall(
      formRenderer.Date,
      "Date",
    )({
      label,
      error,
      inputProps: _.omit(getInputProps(field, { type: "date" }), "key"),
      isPending,
    });
  }

  // Handle ZodEnum
  if (fieldSchema._def.typeName === "ZodEnum") {
    const enumSchema = fieldSchema as z.ZodEnum<any>;
    const derivedType = enumConfigSchema.parse(config).type ?? "select";
    if (derivedType !== "select") {
      throw new Error(
        `ZodEnum field "${field.name}" must use config.type = "select" or provide a custom renderer.`,
      );
    }
    const selectEnumConfig = selectEnumConfigSchema.parse(config);
    return safeCall(
      formRenderer.Select,
      "Select",
    )({
      label,
      error,
      selectProps: _.omit(getSelectProps(field, {}), "key"),
      options: enumSchema.options.map((opt: string) => ({
        key: opt,
        value: opt,
        label: selectEnumConfig.options?.[opt] ?? opt,
      })),
      isPending,
    });
  }

  // Handle ZodNativeEnum
  if (fieldSchema._def.typeName === "ZodNativeEnum") {
    const nativeEnumSchema = fieldSchema as z.ZodNativeEnum<any>;
    const derivedType = enumConfigSchema.parse(config).type ?? "select";
    const values = Object.entries(nativeEnumSchema.enum);
    if (!values.every(([k]) => typeof k === "string")) {
      throw new Error(
        `ZodNativeEnum for "${field.name}" must contain only string values.`,
      );
    }

    if (derivedType !== "select") {
      throw new Error(
        `ZodNativeEnum field "${field.name}" must use config.type = "select" or provide a custom renderer.`,
      );
    }
    return safeCall(
      formRenderer.Select,
      "Select",
    )({
      label,
      error,
      selectProps: _.omit(getSelectProps(field, {}), "key"),
      options: values.map(([k, v]) => ({
        key: k,
        value: v as string,
        label: k,
      })),
      isPending,
    });
  }

  throw new Error(`Unsupported Zod type for field "${field.name}".`);
}
