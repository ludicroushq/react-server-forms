import { createContext, useContext, type PropsWithChildren } from "react";
import type { FormRenderer } from "./form-renderer";

export const reactServerFormsContext = createContext<{
  formRenderer: FormRenderer;
} | null>(null);

export function ReactServerFormsProvider({
  children,
  formRenderer,
}: PropsWithChildren<{ formRenderer: FormRenderer }>) {
  return (
    <reactServerFormsContext.Provider value={{ formRenderer }}>
      {children}
    </reactServerFormsContext.Provider>
  );
}

export function useReactServerForms() {
  const form = useContext(reactServerFormsContext);
  if (!form) {
    throw new Error(
      "ReactServerFormsProvider not found. Please wrap your application in a ReactServerFormsProvider.",
    );
  }
  return form;
}
