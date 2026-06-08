"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addBookmark(formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  // Checkbox value read karo
  const isPublic = formData.get("is_public") === "on";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    title,
    url,
    is_public: isPublic,
  });

  if (error) {
    console.error("Bookmark insert error:", error);
  }

  revalidatePath("/dashboard");
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Bookmark delete error:", error);
  }

  revalidatePath("/dashboard");
}