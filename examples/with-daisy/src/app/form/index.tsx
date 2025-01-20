"use client";

import { RenderForm } from "react-server-forms/client";
import { formSchema } from "./schema";
import { formAction } from "./actions";

export function Form() {
  return <RenderForm schema={formSchema} action={formAction} />;
}
