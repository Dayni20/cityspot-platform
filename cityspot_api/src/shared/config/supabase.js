const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

function createSupabaseClient() {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    throw new Error("Supabase credentials are not configured");
  }

  return createClient(env.supabase.url, env.supabase.serviceRoleKey);
}

module.exports = createSupabaseClient;
