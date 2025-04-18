"use client";

import { RenderForm } from "react-server-forms/client";
import { formSchema } from "./schema";
import { formAction } from "./actions";
import { zodForm } from "react-server-forms/schema";

export function Form() {
  return (
    <RenderForm
      schema={zodForm(formSchema)}
      action={formAction}
      onSuccess={(result) => console.log(result)}
      defaultValue={{
        text: "Hello",
      }}
    />
  );
}
