"use client";

import { RenderForm } from "react-server-forms/client";
import { formSchema } from "./schema";
import { formAction } from "./actions";
import { useState } from "react";

export function Form() {
  const [result, setResult] = useState<any>(null);

  if (result) {
    return (
      <div className="alert alert-success">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }
  return (
    <RenderForm
      schema={formSchema}
      action={formAction}
      onSuccess={(result) => {
        setResult(result);
      }}
    />
  );
}
