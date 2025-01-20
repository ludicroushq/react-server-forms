"use server";
import { createFormAction } from "react-server-forms/server";
import { formSchema } from "./schema";

export const formAction = createFormAction(formSchema, async ({ value }) => {
  console.log(value);

  return {
    asdf: "asdf",
  };
});
