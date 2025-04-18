import type { z } from "zod";
import type { SchemaValidator, ValidationResult } from "../server/actions";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { JSONSchema7 } from "json-schema";

export function zodForm<T extends z.ZodObject<any, any, any>>(
  schema: T,
): SchemaValidator<z.infer<T>> {
  return {
    validate: (data: unknown): ValidationResult<z.infer<T>> => {
      const result = schema.safeParse(data);
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        const errors = result.error.flatten();
        return {
          success: false,
          errors: {
            formErrors: errors.formErrors,
            fieldErrors: errors.fieldErrors as Record<string, string[]>,
          },
        };
      }
    },

    getJsonSchema: () => {
      return zodToJsonSchema(schema, {
        target: "jsonSchema7",
      }) as any as JSONSchema7;
    },
  };
}

// // Convert Zod type to form field
// function zodTypeToFormField(schema: z.ZodTypeAny, name: string): FormField {
//   // Extract common config from description
//   const config = parseConfig(schema.description);

//   // Handle wrapped types (optional, default, etc.)
//   let unwrappedSchema = schema;
//   let required = true;

//   if (schema instanceof z.ZodOptional) {
//     unwrappedSchema = schema._def.innerType;
//     required = false;
//   } else if (schema instanceof z.ZodDefault) {
//     unwrappedSchema = schema._def.innerType;
//   } else if (schema instanceof z.ZodNullable) {
//     unwrappedSchema = schema._def.innerType;
//   }

//   const field: FormField = {
//     name,
//     required,
//     label: config.label,
//     hidden: config.hidden,
//     config,
//   };

//   // Determine type and additional properties
//   if (unwrappedSchema instanceof z.ZodString) {
//     field.type = "string";
//   } else if (
//     unwrappedSchema instanceof z.ZodNumber ||
//     unwrappedSchema instanceof z.ZodBigInt
//   ) {
//     field.type = "number";
//   } else if (unwrappedSchema instanceof z.ZodBoolean) {
//     field.type = "boolean";
//   } else if (unwrappedSchema instanceof z.ZodDate) {
//     field.type = "date";
//   } else if (
//     unwrappedSchema instanceof z.ZodEnum ||
//     unwrappedSchema instanceof z.ZodNativeEnum
//   ) {
//     field.type = "enum";
//     field.enumValues =
//       unwrappedSchema instanceof z.ZodEnum
//         ? unwrappedSchema._def.values
//         : Object.keys(unwrappedSchema._def.values).filter((key) =>
//             isNaN(Number(key)),
//           );
//   } else {
//     // Default to string for unsupported types
//     field.type = "string";
//   }

//   return field;
// }
