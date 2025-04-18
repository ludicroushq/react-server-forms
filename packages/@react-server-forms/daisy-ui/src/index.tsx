import type { FormRenderer } from "react-server-forms/client";
import { createFormRenderer as createFormRendererOriginal } from "react-server-forms/client";

export function createFormRenderer(): FormRenderer {
  return createFormRendererOriginal({
    Form: ({ formProps, children, errors }) => (
      <form {...formProps} className="">
        {errors && (
          <div role="alert" className="alert alert-error mb-2">
            <span>{errors.join(", ")}</span>
          </div>
        )}
        {children}
      </form>
    ),
    Fieldset: ({ children, errors }) => (
      <fieldset className="fieldset">
        {children}
        <label className="label flex justify-between">
          {errors && <span className="text-error">{errors.join(", ")}</span>}
        </label>
      </fieldset>
    ),
    Text: ({ label, inputProps }) => (
      <>
        <label className="fieldset-label">{label}</label>

        <input className="input w-full" placeholder={label} {...inputProps} />
      </>
    ),
    Textarea: ({ label, textareaProps }) => (
      <>
        <label className="fieldset-label">{label}</label>
        <textarea {...textareaProps} className="textarea w-full" />
      </>
    ),
    Number: ({ label, inputProps }) => (
      <>
        <label className="fieldset-label">{label}</label>
        <input className="input w-full" placeholder={label} {...inputProps} />
      </>
    ),
    Date: ({ label, inputProps }) => (
      <>
        <label className="fieldset-label">{label}</label>
        <input className="input w-full" placeholder={label} {...inputProps} />
      </>
    ),
    Checkbox: ({ label, inputProps }) => (
      <>
        <label className="fieldset-label">
          <input type="checkbox" {...inputProps} className="checkbox" />
          {label}
        </label>
      </>
    ),
    Select: ({ label, selectProps, options }) => (
      <>
        <label className="fieldset-label">{label}</label>
        <select {...selectProps} className="select w-full">
          {options.map(({ optionProps, label }) => (
            <option key={label} {...optionProps}>
              {label}
            </option>
          ))}
        </select>
      </>
    ),
    Submit: ({ buttonProps, isPending, label }) => (
      <button {...buttonProps} className="btn  block" disabled={isPending}>
        {isPending && <span className="loading loading-spinner loading-sm" />}
        {label}
      </button>
    ),
  });
}
