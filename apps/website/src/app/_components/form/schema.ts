import { z } from "zod";
import { d } from "react-server-forms/schema";

export const formSchema = z
  .object({
    firstName: z
      .string()
      .min(1)
      .describe(d.Text({ label: "First Name" })),
    lastName: z
      .string()
      .min(1)
      .describe(d.Text({ label: "Last Name" })),
    email: z
      .string()
      .email()
      .min(1)
      .describe(d.Text({ label: "Email Address", type: "email" })),
  })
  .describe(d.Form({ submit: { label: "Lets go" } }));
