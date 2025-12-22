import { supabase } from "../instances/supabase";

export async function getStationLocation(params: { codes: string[] }) {
  if (!supabase) return null;
  const result = await supabase
    .from("stations")
    .select("code,lat,lon")
    .in("code", params.codes);
  return result.data;
}
