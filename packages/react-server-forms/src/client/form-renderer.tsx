"use client";
import { type JSX, type PropsWithChildren } from "react";

/**
 * A base type for the arguments passed to each renderer function.
 */
export type BaseRenderArgs = {
  label?: string;
  isPending: boolean;
  required?: boolean;
};

export type FieldsetProps = {
  children: React.ReactNode;
  errors?: string[];
};

export type SubmitProps = {
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  isPending: boolean;
  label: string;
};

export type InputProps = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
};

export type TextareaProps = {
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export type SelectProps = {
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>;
  options: {
    label: string;
    optionProps: React.OptionHTMLAttributes<HTMLOptionElement>;
  }[];
};

export type Renderer<Props> = (args: Props) => JSX.Element;

export type FormProps = PropsWithChildren<{
  formProps: React.FormHTMLAttributes<HTMLFormElement>;
  errors?: string[];
}>;

export type FormRendererOptions = {
  Form: Renderer<FormProps>;
  Fieldset: Renderer<FieldsetProps>;
  Text: Renderer<BaseRenderArgs & InputProps>;
  Textarea: Renderer<BaseRenderArgs & TextareaProps>;
  Number: Renderer<BaseRenderArgs & InputProps>;
  Date: Renderer<BaseRenderArgs & InputProps>;
  Checkbox: Renderer<BaseRenderArgs & InputProps>;
  Select: Renderer<BaseRenderArgs & SelectProps>;
  Submit: Renderer<SubmitProps>;
};

export type FormRenderer = FormRendererOptions;

export function createFormRenderer(options: FormRendererOptions): FormRenderer {
  return options;
}
