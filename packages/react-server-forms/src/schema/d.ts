import { z } from "zod";
import type { FormRendererOptions } from "../client/form-renderer";

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

type RootConfig = z.infer<typeof rootConfigSchema>;
type StringConfig = RootConfig & z.infer<typeof stringConfigSchema>;
type FormConfig = RootConfig & z.infer<typeof submitConfigSchema>;
type EnumConfig = RootConfig & z.infer<typeof enumConfigSchema>;
type SelectEnumConfig = RootConfig & z.infer<typeof selectEnumConfigSchema>;

export const d = {
  Text: (p: StringConfig) => JSON.stringify(p),
  Textarea: (p: StringConfig) => JSON.stringify(p),
  Number: (p: RootConfig) => JSON.stringify(p),
  Date: (p: RootConfig) => JSON.stringify(p),
  Checkbox: (p: RootConfig) => JSON.stringify(p),
  Select: (p: EnumConfig & SelectEnumConfig) => JSON.stringify(p),
  Form: (p: FormConfig) => JSON.stringify(p),
} satisfies Record<
  Exclude<keyof FormRendererOptions, "Submit" | "Fieldset"> | "Form",
  any
>;
