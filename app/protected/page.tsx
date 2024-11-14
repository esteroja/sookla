import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RecipeFeed from "../recipe-feed/page";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <RecipeFeed userId={""} />
      </div>
    </div>
  );
}
