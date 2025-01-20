import { z } from "zod";
import { d } from "react-server-forms/schema";

enum NativeEnum {
  A = "a",
  B = "b",
  C = "c",
}

export const formSchema = z
  .object({
    text: z
      .string()
      .min(1)
      .describe(d.Text({ label: "Username" })),
    number: z.number().min(1),
    textarea: z
      .string()
      .min(1)
      .describe(d.Textarea({ label: "Textarea", type: "textarea" })),
    date: z.date().describe(d.Date({ label: "Date" })),
    checkbox: z.boolean().describe(d.Checkbox({ label: "Checkbox" })),
    select: z.enum(["a", "b", "c"]).describe(
      d.Select({
        options: {
          a: "A",
          b: "B",
          c: "C",
        },
      }),
    ),
    nativeSelect: z.nativeEnum(NativeEnum),
  })
  .describe(d.Form({ submit: { label: "Lets go" } }));
