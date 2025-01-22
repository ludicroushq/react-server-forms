"use server";
import {
  createFormAction,
  FormError,
  FormFieldError,
} from "react-server-forms/server";
import { formSchema } from "./schema";

export const formAction = createFormAction(formSchema, async ({ value }) => {
  console.log(value);

  if (value.triggerGlobalError) {
    throw new FormError({
      message: "Global error",
    });
  }

  if (value.triggerFieldError) {
    throw new FormFieldError<typeof formSchema>({
      field: "text",
      message: "Field error",
    });
  }

  return {
    message:
      "Woohoo! You submitted the form. This message comes from the server.",
  };
});
