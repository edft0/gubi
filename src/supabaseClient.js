// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
  console.warn("⚠️ Supabase 환경변수가 아직 기본 플레이스홀더 값입니다. .env.local 파일에 실제 본인의 Supabase 자격증명을 입력해 주세요!");
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-key");
