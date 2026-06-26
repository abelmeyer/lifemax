import { supabase } from "./supabase";
import { compressImage } from "./imageUtils";

const BUCKET = "photos";

export async function fetchPhotos(userId) {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function uploadPhoto({ userId, date, file }) {
  const blob = await compressImage(file);
  const path = `${userId}/${date}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("photos")
    .upsert({ user_id: userId, date, storage_path: path }, { onConflict: "user_id,date" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(photo) {
  await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  const { error } = await supabase.from("photos").delete().eq("id", photo.id);
  if (error) throw error;
}

export async function getSignedUrls(paths) {
  if (paths.length === 0) return {};
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
  if (error) throw error;
  const map = {};
  data.forEach((d, i) => {
    map[paths[i]] = d.signedUrl;
  });
  return map;
}
