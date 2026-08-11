import { supabase } from "./supabase";

// The avatar_customization table lands in sprint10_migration.sql. Until the
// operator has run that migration, fetches fail with 42P01 (undefined table) —
// treat that as "table missing" so the app renders default appearance instead
// of breaking, and skips the forced setup screen (there'd be nowhere to save).
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST202"]);

export async function fetchCustomization(userId) {
  const { data, error } = await supabase
    .from("avatar_customization")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (MISSING_TABLE_CODES.has(error.code)) {
      console.warn("avatar_customization table missing — run supabase/sprint10_migration.sql");
      return { customization: null, tableMissing: true };
    }
    throw error;
  }
  return { customization: data, tableMissing: false };
}

export async function saveCustomization(userId, values) {
  const { data, error } = await supabase
    .from("avatar_customization")
    .upsert(
      {
        user_id: userId,
        skin_tone: values.skin_tone,
        hair_style: values.hair_style,
        hair_color: values.hair_color,
        facial_hair: values.facial_hair,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
