import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "ضع رابط Project URL هنا";
const supabaseKey = "ضع Publishable Key هنا";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
