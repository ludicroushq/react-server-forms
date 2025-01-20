import type { z } from "zod";
import type { FormRendererOptions } from "../client/form-renderer";
import type {
  enumConfigSchema,
  rootConfigSchema,
  selectEnumConfigSchema,
  stringConfigSchema,
  submitConfigSchema,
} from "../client/render-form-field";

type RootConfig = z.infer<typeof rootConfigSchema>;
type StringConfig = RootConfig & z.infer<typeof stringConfigSchema>;
type FormConfig = RootConfig & {
  submit?: z.infer<typeof submitConfigSchema>;
};
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
} satisfies Record<Exclude<keyof FormRendererOptions, "Submit"> | "Form", any>;
