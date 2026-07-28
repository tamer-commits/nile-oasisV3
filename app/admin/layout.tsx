import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {user && (
        <nav
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            padding: "14px 24px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Link href="/admin" style={{ fontWeight: 600 }}>
            Nile Oasis Admin
          </Link>
          <Link href="/admin/properties">Properties</Link>
          <Link href="/admin/enquiries">Enquiries</Link>
          <span style={{ marginLeft: "auto", fontSize: 14, color: "#666" }}>{user.email}</span>
          <SignOutButton />
        </nav>
      )}
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
