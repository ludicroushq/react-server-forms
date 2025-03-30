export class FormError extends Error {
  name = "FormError" as const;
  constructor(public message: string) {
    super(message);
  }
}

export class FormFieldError extends Error {
  name = "FormFieldError" as const;
  constructor(public props: { field: string; message: string }) {
    super(props.message);
  }

  get field() {
    return this.props.field;
  }

  get message() {
    return this.props.message;
  }
}
