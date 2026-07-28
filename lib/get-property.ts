import { createServiceClient } from "@/lib/supabase/server";
import { FALLBACK_PROPERTY, type Property } from "@/lib/types";

// Fetches a property by slug (or the first live one if no slug given).
// Falls back to a hardcoded default so the site never breaks — before
// Supabase is configured, or if a query fails for any reason.
export async function getFeaturedProperty(slug?: string): Promise<Property> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return FALLBACK_PROPERTY;
  }

  try {
    const service = createServiceClient();
    let query = service
      .from("properties")
      .select("*, property_images(*)")
      .eq("status", "live");

    query = slug ? query.eq("slug", slug) : query.order("created_at", { ascending: true });

    const { data, error } = await query.limit(1).single();
    if (error || !data) return FALLBACK_PROPERTY;

    return {
      ...data,
      images: (data.property_images ?? []).sort(
        (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
      ),
    };
  } catch {
    return FALLBACK_PROPERTY;
  }
}
