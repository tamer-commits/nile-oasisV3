import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

export default async function PropertiesListPage() {
  const service = createServiceClient();
  const { data: properties } = await service
    .from("properties")
    .select("id, name, slug, status, bedrooms, bathrooms, nightly_rate, currency")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 22 }}>Properties</h1>
        <Link
          href="/admin/properties/new"
          style={{ padding: "8px 16px", background: "#1a2e22", color: "#fff", borderRadius: 6 }}
        >
          + New property
        </Link>
      </div>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Beds/Baths</th>
            <th style={{ padding: 8 }}>Rate</th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {(properties ?? []).map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{p.name}</td>
              <td style={{ padding: 8 }}>{p.status}</td>
              <td style={{ padding: 8 }}>
                {p.bedrooms}bd / {p.bathrooms}ba
              </td>
              <td style={{ padding: 8 }}>
                {p.nightly_rate ? `${p.nightly_rate} ${p.currency}` : "— (pending Guesty sync)"}
              </td>
              <td style={{ padding: 8 }}>
                <Link href={`/admin/properties/${p.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
          {(properties ?? []).length === 0 && (
            <tr>
              <td style={{ padding: 8 }} colSpan={5}>
                No properties yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
