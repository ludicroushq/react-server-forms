import type { z } from "zod";

export class FormError extends Error {
  message: string;

  constructor({ message }: { message: string }) {
    super(message);
    this.name = "FormError";
    this.message = message;
  }
}

export class FormFieldError<Schema extends z.ZodObject<any>> extends Error {
  message: string;
  field: keyof z.infer<Schema>;

  constructor({
    field,
    message,
  }: {
    field: keyof z.infer<Schema>;
    message: string;
  }) {
    super(message);
    this.name = "FormFieldError";
    this.field = field;
    this.message = message;
  }
}
