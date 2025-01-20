export class FormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormError";
    this.message = message;
  }
}

export class FormFieldError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
    this.name = "FormFieldError";
    this.field = field;
    this.message = message;
  }
}
