"use client";
import { type JSX } from "react";

/**
 * A base type for the arguments passed to each renderer function.
 */
export type BaseRenderArgs = {
  label?: string;
  error?: string;
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
  options: { key: string; value: string; label: string }[];
};

type Renderer<Props> = (args: Props) => JSX.Element;

export interface FormRendererOptions {
  Text?: Renderer<BaseRenderArgs & InputProps>;
  Textarea?: Renderer<BaseRenderArgs & TextareaProps>;
  Number?: Renderer<BaseRenderArgs & InputProps>;
  Date?: Renderer<BaseRenderArgs & InputProps>;
  Checkbox?: Renderer<BaseRenderArgs & InputProps>;
  Select?: Renderer<BaseRenderArgs & SelectProps>;
  Submit: Renderer<SubmitProps>;
}

export function createFormRenderer(options: FormRendererOptions) {
  return options;
}
