"use server";
import { createFormAction } from "react-server-forms/server";
import { formSchema } from "./schema";
import { redirect } from "next/navigation";

export const formAction = createFormAction(formSchema, async ({ value }) => {
  redirect(
    `/?success=true&firstName=${value.firstName}&lastName=${value.lastName}&email=${value.email}`,
  );
});
