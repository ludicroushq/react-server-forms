"use client";
import type { JSONSchema7 } from "json-schema";
import { match, P } from "ts-pattern";
import type { FormField } from "./render-form-field";
import {
  rootConfigSchema,
  selectEnumConfigSchema,
  stringConfigSchema,
} from "../schema/d";

// Helper function to convert JSONSchema to FormField
export function jsonSchemaToFormField(
  schema: JSONSchema7,
  propertyName: string,
  required: boolean = false,
): FormField {
  const config = rootConfigSchema.safeParse(
    JSON.parse(schema.description ?? "{}"),
  );

  if (!schema.type) {
    throw new Error("No type found in schema");
  }
  if (typeof schema.type !== "string") {
    throw new Error("Multiple types are not supported");
  }

  const sharedFields = {
    name: propertyName,
    required,
    label: config.data?.label || propertyName,
    hidden: config.data?.hidden || false,
  };

  const field = match<typeof schema, FormField>(schema)
    .with({ format: "date" }, () => {
      return {
        ...sharedFields,
        type: "date",
      };
    })
    .with({ format: "date-time" }, () => {
      return {
        ...sharedFields,
        type: "date",
      };
    })
    .with({ type: "object" }, () => {
      throw new Error("Object type is not supported");
    })
    .with({ type: "array" }, () => {
      throw new Error("Array type is not supported");
    })
    .with({ type: "null" }, () => {
      throw new Error("Null type is not supported");
    })
    .with({ type: "string" }, () => {
      if (schema.enum) {
        const config = selectEnumConfigSchema.safeParse(
          JSON.parse(schema.description ?? "{}"),
        );
        return {
          ...sharedFields,
          type: "select",
          enumValues: schema.enum as string[],
          options: config.data?.options,
        };
      }
      const config = stringConfigSchema.safeParse(
        JSON.parse(schema.description ?? "{}"),
      );
      return {
        ...sharedFields,
        type: config.data?.type ?? "text",
      };
    })
    .with({ type: "number" }, () => {
      return {
        ...sharedFields,
        type: "number",
      };
    })
    .with({ type: "integer" }, () => {
      return {
        ...sharedFields,
        type: "number",
      };
    })
    .with({ type: "boolean" }, () => {
      return {
        ...sharedFields,
        type: "checkbox",
      };
    })
    .with({ type: P.any }, () => {
      throw new Error(`Unknown type ${schema.type} is not supported`);
    })
    .exhaustive();

  return field;
}

export function jsonSchemaToFormFields(schema: JSONSchema7): FormField[] {
  const fields: FormField[] = [];

  if (schema.type === "object" && schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const isRequired =
        Array.isArray(schema.required) && schema.required.includes(key);
      fields.push(jsonSchemaToFormField(prop as JSONSchema7, key, isRequired));
    }
  }

  return fields;
}
