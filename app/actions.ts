"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Recipe } from "@/types/Recipe";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !username) {
    return { error: "Email, parool, ja kasutajanimi on vajalikud" };
  }

  // Signup koos usernamega
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (data?.user) {
    const usernameFromMetadata = data.user.user_metadata?.username; // Accessing username from user_metadata
    console.log("User metadata:", data.user.user_metadata); // Confirm kas on olemas usermetadata
    console.log("Username from metadata:", usernameFromMetadata); // Logib username
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Tänud liitumast! Palun kontrolli oma emaili kinnituse jaoks."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email vajalik");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Parooli taastamine nurjus"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Parooli taastamise link saadetud emailile."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect("error", "/protected/reset-password", "Parool vajalik");
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/protected/reset-password", "Paroolid ei ühti");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Parooli uuendamine nurjus"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Parool uuendatud");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getAllRecipesAction = async () => {
  const supabase = await createClient();

  let { data: recipes, error } = await supabase
    .from("published_recipes")
    .select(`*, categories(*), ingredients!inner(*)`);
  console.log("server read all");

  if (error) {
    console.log("Error fetching server recipes");
    return [];
  }

  return recipes;
};
