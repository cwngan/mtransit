"use server";
import { supabase } from "../instances/supabase";

export default async function search({ query }: { query: string }) {
  if (!supabase) return;
  const { data, error } = await supabase
    .rpc("get_all_routes_with_origin_and_destination")
    .ilike("name", `%${query}%`)
    .select("*")
    .limit(10);
  return data;
}
