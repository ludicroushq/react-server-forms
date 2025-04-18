"use server";
import {
  createFormAction,
  FormError,
  FormFieldError,
} from "react-server-forms/server";
import { formSchema } from "./schema";
import type { z } from "zod";
import { zodForm } from "react-server-forms/schema";

export const formAction = createFormAction(
  zodForm(formSchema),
  async ({ data }: { data: z.infer<typeof formSchema> }) => {
    if (data.triggerGlobalError) {
      throw new FormError("This is a global error");
    }

    if (data.triggerFieldError) {
      throw new FormFieldError({
        field: "text",
        message: "This is a field error",
      });
    }

    return data;
  },
);
