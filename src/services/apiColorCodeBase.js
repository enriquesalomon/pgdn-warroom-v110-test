import supabase from "./supabase";

export async function getColorCodeBase() {
  const { data, error } = await supabase
    .from("color_codes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Color Codes Link could not be loaded");
  }
  return data;
}
