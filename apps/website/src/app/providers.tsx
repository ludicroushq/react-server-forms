"use client";
import type { PropsWithChildren } from "react";
import { createFormRenderer } from "@react-server-forms/daisy-ui";
import { ReactServerFormsProvider } from "react-server-forms/client";

const formRenderer = createFormRenderer();

export function Providers({ children }: PropsWithChildren) {
  return (
    <ReactServerFormsProvider formRenderer={formRenderer}>
      {children}
    </ReactServerFormsProvider>
  );
}
