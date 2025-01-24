"use client";

import { useSearchParams } from "next/navigation";
import { RenderForm } from "react-server-forms/client";
import { formSchema } from "./schema";
import { formAction } from "./actions";

export function Form() {
  const searchParams = useSearchParams();
  if (searchParams.get("success") === "true") {
    return <div>SUCCESS!</div>;
  }
  return <RenderForm schema={formSchema} action={formAction} />;
}
