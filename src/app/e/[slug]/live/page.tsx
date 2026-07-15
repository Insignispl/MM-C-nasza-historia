import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LiveWall } from "./LiveWall";

export const metadata = { robots: { index: false, follow: false } };

export default async function LiveWallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("id,couple_name,primary_color,secondary_color,live_wall_enabled").eq("slug", slug).single();
  if (!event || !event.live_wall_enabled) notFound();
  const { data: media } = await supabase.from("event_media").select("id,type,public_url,caption,guest_name").eq("event_id", event.id).eq("approved", true).order("created_at", { ascending: false }).limit(12);
  return <LiveWall eventId={event.id} coupleName={event.couple_name} primaryColor={event.primary_color} initialMedia={media || []} />;
}
