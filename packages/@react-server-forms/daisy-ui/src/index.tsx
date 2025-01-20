import type { FormRenderer } from "react-server-forms/client";
import { createFormRenderer as createFormRendererOriginal } from "react-server-forms/client";

export function createFormRenderer(): FormRenderer {
  return createFormRendererOriginal({
    Text: ({ label, error, inputProps }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input {...inputProps} className="input input-bordered w-full" />
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Textarea: ({ label, error, textareaProps }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <textarea {...textareaProps} className="textarea textarea-bordered" />

        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Number: ({ label, error, inputProps }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input {...inputProps} className="input input-bordered w-full" />
        <div className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
      </label>
    ),
    Date: ({ label, error, inputProps }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input {...inputProps} className="input input-bordered w-full" />
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
    Select: ({ label, error, selectProps, options }) => (
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <select {...selectProps} className="select select-bordered">
          {options.map(({ key, value, label }) => (
            <option key={key} value={value}>
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
