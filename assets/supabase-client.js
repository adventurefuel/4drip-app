// 4DRIP — shared Supabase client + WhatsApp helpers.
// Loaded after the supabase-js CDN script on every page.

const SUPABASE_URL = "https://huoortkwcgaqztgndxns.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1b29ydGt3Y2dhcXp0Z25keG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzAyNjEsImV4cCI6MjEwMzUwNjI2MX0.5wqyJyM3C8485CTtYL6NhFH1OOnvzgIaOjojjDCNuHo";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const WA_NUMBER = "15865535504"; // +1 586 553 5504
const WA_DISPLAY = "(586) 553-5504";

function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text || "")}`;
}

function waProductLink(p, extra) {
  let msg = `Hey 4DRIP, I'm interested in ${p.brand} ${p.name} (SKU ${p.sku}).`;
  if (extra) msg += `\n\n${extra}`;
  return waLink(msg);
}

function productImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path) || /^data:/.test(path)) return path;
  const { data } = db.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
