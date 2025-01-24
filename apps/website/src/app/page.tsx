import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "./_components/code-block";
import { Form } from "./_components/form";

const code = `// schema.ts
export const formSchema = z
  .object({
    firstName: z.string().min(1).describe(d.Text({ label: "First Name" })),
    lastName: z.string().min(1).describe(d.Text({ label: "Last Name" })),
    email: z.string().email().min(1).describe(d.Text({ label: "Email Address", type: "email" })),
  }).describe(d.Form({ submit: { label: "Lets go" } }));

// actions.ts
'use server'
export const formAction = createFormAction(formSchema, async ({ value }) => {
  redirect(\`/?success=true&firstName=\${value.firstName}&lastName=\${value.lastName}&email=\${value.email}\`);
});

// page.tsx
'use client';
export default function Page({ searchParams }: { searchParams: Promise<{ success: string }>}) {
  if ((await searchParams).success === 'true') return <div>SUCCESS!</div>
  return <RenderForm schema={formSchema} action={formAction} />;
}
`;

export default function LandingPage() {
  return (
    <>
      <div className="container mx-auto">
        <header className="navbar">
          <div className="navbar-start">
            <Link href="/" className="btn btn-ghost text-xl">
              react-server-forms
            </Link>
          </div>
          <div className="navbar-center" />
          <div className="navbar-end">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/get-started">Get Started</Link>
              </li>
            </ul>
          </div>
        </header>
      </div>

      <section className="py-16 bg-base-200 flex flex-col items-center justify-center">
        <div className="container mx-auto">
          <div className="prose prose-xl max-w-none text-center mx-auto">
            <h1 className="mb-0">React Server Forms</h1>
            <p className="mt-0">
              The React library for building server-side rendered forms with
              ease.
            </p>
            <div className="flex flex-row justify-center gap-4 not-prose">
              <Link href="/docs/getting-started" className="btn btn-primary">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/learn" className="btn btn-outline">
                Learn react-server-forms
              </Link>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 max-w-4xl mx-auto gap-4">
            <div className="card bg-base-100 border">
              <div className="card-body">
                <CodeBlock lang="typescript">{code}</CodeBlock>
              </div>
            </div>
            <div className="card bg-base-100 border">
              <div className="card-body">
                <Form />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
