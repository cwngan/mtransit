import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_KEY
    ? createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    : null;

export { supabase };
