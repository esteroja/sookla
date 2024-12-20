import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto items-center m-10 min-h-screen">
        <div>
          <h1 className="text-2xl font-medium">Parooli taastamine</h1>
          <p className="text-sm text-secondary-foreground">
            On juba konto olemas?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Logi sisse
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="Sinu email" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Taasta parool
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
