import { createServiceClient } from "@/lib/supabase/server";

export default async function EnquiriesPage() {
  const service = createServiceClient();
  const { data: enquiries } = await service
    .from("enquiries")
    .select("*, properties(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Enquiries</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: 8 }}>Received</th>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Contact</th>
            <th style={{ padding: 8 }}>Dates</th>
            <th style={{ padding: 8 }}>Guests</th>
            <th style={{ padding: 8 }}>Property</th>
            <th style={{ padding: 8 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {(enquiries ?? []).map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{new Date(e.created_at).toLocaleString()}</td>
              <td style={{ padding: 8 }}>{e.name}</td>
              <td style={{ padding: 8 }}>{e.contact}</td>
              <td style={{ padding: 8 }}>
                {e.checkin ?? "—"} → {e.checkout ?? "—"}
              </td>
              <td style={{ padding: 8 }}>{e.guests ?? "—"}</td>
              <td style={{ padding: 8 }}>{e.properties?.name ?? "—"}</td>
              <td style={{ padding: 8 }}>{e.status}</td>
            </tr>
          ))}
          {(enquiries ?? []).length === 0 && (
            <tr>
              <td style={{ padding: 8 }} colSpan={7}>
                No enquiries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
