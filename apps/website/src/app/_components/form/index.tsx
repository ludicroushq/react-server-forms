"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RenderForm } from "react-server-forms/client";
import { formSchema } from "./schema";
import { formAction } from "./actions";

export function Form() {
  const searchParams = useSearchParams();
  const router = useRouter();
  if (searchParams.get("success") === "true") {
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="prose max-w-none">
          <h1>SUCCESS!</h1>
          <p>
            First Name: {firstName}
            <br />
            Last Name: {lastName}
            <br />
            Email: {email}
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>
            Go back
          </button>
        </div>
      </div>
    );
  }
  return <RenderForm schema={formSchema} action={formAction} />;
}
