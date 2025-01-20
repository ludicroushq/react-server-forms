"use client";
import { createFormRenderer } from "@react-server-forms/daisy-ui";
import type { PropsWithChildren } from "react";
import { ReactServerFormsProvider } from "react-server-forms/client";

const formRenderer = createFormRenderer();

export function Providers(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ReactServerFormsProvider formRenderer={formRenderer}>
      {children}
    </ReactServerFormsProvider>
  );
}
