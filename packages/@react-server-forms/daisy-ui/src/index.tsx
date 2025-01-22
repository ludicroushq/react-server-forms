import type { FormRenderer } from "react-server-forms/client";
import { createFormRenderer as createFormRendererOriginal } from "react-server-forms/client";

export function createFormRenderer(): FormRenderer {
  return createFormRendererOriginal({
    Form: ({ formProps, children, errors }) => (
      <form {...formProps}>
        {errors && (
          <div role="alert" className="alert alert-error mb-2">
            <span>{errors.join(", ")}</span>
          </div>
        )}
        {children}
      </form>
    ),
    Text: ({ label, error, inputProps, key }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...inputProps}
          key={key}
          className="input input-bordered w-full"
        />
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Textarea: ({ label, error, textareaProps, key }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <textarea
          key={key}
          {...textareaProps}
          className="textarea textarea-bordered"
        />

        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Number: ({ label, error, inputProps, key }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...inputProps}
          key={key}
          className="input input-bordered w-full"
        />
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Date: ({ label, error, inputProps, key }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          key={key}
          {...inputProps}
          className="input input-bordered w-full"
        />
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Checkbox: ({ label, error, inputProps }) => (
      <label className="form-control w-full">
        <div className="label justify-normal gap-4">
          <input {...inputProps} className="checkbox" />
          <span className="label-text">{label}</span>
        </div>
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Select: ({ label, error, selectProps, options, key }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <select key={key} {...selectProps} className="select select-bordered">
          {options.map(({ key, optionProps, label }) => (
            <option key={key} {...optionProps}>
              {label}
            </option>
          ))}
        </select>
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Submit: ({ buttonProps, isPending, label }) => (
      <button {...buttonProps} className="btn btn-primary" disabled={isPending}>
        {isPending && <span className="loading loading-spinner loading-sm" />}
        {label}
      </button>
    ),
  });
}
