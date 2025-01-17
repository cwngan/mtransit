import { supabase } from "../instances/supabase";

export default async function getStationsNearby(params: {
  position: {
    latitude: number;
    longitude: number;
  };
}) {
  if (!supabase)
    return {
      error: "could not connect to db.",
      status: 500,
    };
  const { position } = params;
  const res = await supabase
    .rpc("find_stations_nearby", {
      target_lat: position.latitude,
      target_lon: position.longitude,
    })
    .limit(5)
    .select("*");
  const data = res.data;
  return { data, status: 200 };
}
