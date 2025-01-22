"use client";
import { type JSX, type PropsWithChildren } from "react";

/**
 * A base type for the arguments passed to each renderer function.
 */
export type BaseRenderArgs = {
  label?: string;
  error?: string;
  key: string;
  isPending: boolean;
};

type SubmitProps = {
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  isPending: boolean;
  label: string;
};

type InputProps = { inputProps: React.InputHTMLAttributes<HTMLInputElement> };
type TextareaProps = {
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

type SelectProps = {
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>;
  options: {
    key: string;
    label: string;
    optionProps: React.OptionHTMLAttributes<HTMLOptionElement>;
  }[];
};

type Renderer<Props> = (args: Props) => JSX.Element;

type FormProps = PropsWithChildren<{
  formProps: React.FormHTMLAttributes<HTMLFormElement>;
  errors?: string[];
}>;

export type FormRendererOptions = {
  Form: Renderer<FormProps>;
  Text?: Renderer<BaseRenderArgs & InputProps>;
  Textarea?: Renderer<BaseRenderArgs & TextareaProps>;
  Number?: Renderer<BaseRenderArgs & InputProps>;
  Date?: Renderer<BaseRenderArgs & InputProps>;
  Checkbox?: Renderer<BaseRenderArgs & InputProps>;
  Select?: Renderer<BaseRenderArgs & SelectProps>;
  Submit: Renderer<SubmitProps>;
};

export type FormRenderer = FormRendererOptions;

export function createFormRenderer(options: FormRendererOptions): FormRenderer {
  return options;
}
