import supabase from "./supabase";

export async function getSettings() {
  const { data, error } = await supabase
    .from("settings_data_analysis")
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings_data_analysis")
    .update(newSetting)
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}

export async function getValidationSettings() {
  const { data, error } = await supabase
    .from("settings_validation")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Validation Settings could not be loaded");
  }
  return data;
}

export async function getValidationSettings_Running() {
  const { data, error } = await supabase
    .from("settings_validation")
    .select("*")
    .eq("isrunning", true)
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Validation Settings could not be loaded");
  }
  return data;
}

export async function createEditValidationSetting(newData, id) {
  let query = supabase.from("settings_validation");

  if (id) query = query.update({ ...newData }).eq("id", id);

  const { data: editValidation, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Settings Validation could not be created");
  }

  await supabase
    .from("settings_validation")
    .update({ isactive: false })
    .neq("id", id);

  if (id === 2) {
    await supabase
      .from("settings_validation")
      .update({ islock: true })
      .eq("id", 1);
  }
  if (id === 3) {
    await supabase
      .from("settings_validation")
      .update({ islock: true })
      .in("id", [1, 2]);
  }
  if (id === 4) {
    await supabase
      .from("settings_validation")
      .update({ islock: true })
      .in("id", [1, 2, 3]);
  }

  return editValidation;
}
