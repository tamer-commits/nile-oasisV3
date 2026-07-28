import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const service = createServiceClient();
  const [{ count: propertyCount }, { count: newEnquiryCount }] = await Promise.all([
    service.from("properties").select("*", { count: "exact", head: true }),
    service.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Dashboard</h1>
      <div style={{ display: "flex", gap: 16 }}>
        <Link
          href="/admin/properties"
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, minWidth: 180 }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>{propertyCount ?? 0}</div>
          <div>Properties</div>
        </Link>
        <Link
          href="/admin/enquiries"
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, minWidth: 180 }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>{newEnquiryCount ?? 0}</div>
          <div>New enquiries</div>
        </Link>
      </div>
    </div>
  );
}
