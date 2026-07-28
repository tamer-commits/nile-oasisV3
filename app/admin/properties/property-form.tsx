"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/types";

type Props = {
  property?: Partial<Property> & { id?: string };
};

const inputStyle: React.CSSProperties = { display: "block", width: "100%", padding: 8, marginTop: 4 };
const fieldStyle: React.CSSProperties = { marginBottom: 14 };

export default function PropertyForm({ property }: Props) {
  const router = useRouter();
  const isEdit = Boolean(property?.id);
  const [form, setForm] = useState({
    slug: property?.slug ?? "",
    name: property?.name ?? "",
    neighborhood: property?.neighborhood ?? "",
    status: property?.status ?? "draft",
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    max_guests: property?.max_guests ?? 2,
    nightly_rate: property?.nightly_rate ?? "",
    currency: property?.currency ?? "USD",
    min_stay_nights: property?.min_stay_nights ?? 3,
    check_in_time: property?.check_in_time ?? "14:00",
    check_out_time: property?.check_out_time ?? "10:00",
    description: property?.description ?? "",
    amenities: (property?.amenities ?? []).join("\n"),
    house_rules: (property?.house_rules ?? []).join("\n"),
    guesty_listing_id: property?.guesty_listing_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      max_guests: Number(form.max_guests),
      nightly_rate: form.nightly_rate === "" ? null : Number(form.nightly_rate),
      min_stay_nights: Number(form.min_stay_nights),
      amenities: form.amenities.split("\n").map((s) => s.trim()).filter(Boolean),
      house_rules: form.house_rules.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    const res = await fetch(
      isEdit ? `/api/admin/properties/${property!.id}` : "/api/admin/properties",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/properties");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <div style={fieldStyle}>
        <label>Slug (url-safe, e.g. corniche-suite)</label>
        <input style={inputStyle} value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
      </div>
      <div style={fieldStyle}>
        <label>Name</label>
        <input style={inputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} required />
      </div>
      <div style={fieldStyle}>
        <label>Neighborhood</label>
        <input
          style={inputStyle}
          value={form.neighborhood}
          onChange={(e) => update("neighborhood", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label>Status</label>
        <select style={inputStyle} value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option value="draft">Draft (hidden from public site)</option>
          <option value="live">Live (visible on public site)</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={fieldStyle}>
          <label>Bedrooms</label>
          <input
            type="number"
            style={inputStyle}
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label>Bathrooms</label>
          <input
            type="number"
            style={inputStyle}
            value={form.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label>Max guests</label>
          <input
            type="number"
            style={inputStyle}
            value={form.max_guests}
            onChange={(e) => update("max_guests", e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={fieldStyle}>
          <label>Nightly rate (blank = pending Guesty/PriceLab sync)</label>
          <input
            style={inputStyle}
            value={form.nightly_rate}
            onChange={(e) => update("nightly_rate", e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
        <div style={fieldStyle}>
          <label>Currency</label>
          <input style={inputStyle} value={form.currency} onChange={(e) => update("currency", e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label>Min stay (nights)</label>
          <input
            type="number"
            style={inputStyle}
            value={form.min_stay_nights}
            onChange={(e) => update("min_stay_nights", e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={fieldStyle}>
          <label>Check-in time</label>
          <input
            type="time"
            style={inputStyle}
            value={form.check_in_time}
            onChange={(e) => update("check_in_time", e.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label>Check-out time</label>
          <input
            type="time"
            style={inputStyle}
            value={form.check_out_time}
            onChange={(e) => update("check_out_time", e.target.value)}
          />
        </div>
      </div>
      <div style={fieldStyle}>
        <label>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 90 }}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label>Amenities (one per line)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 110 }}
          value={form.amenities}
          onChange={(e) => update("amenities", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label>House rules (one per line)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 140 }}
          value={form.house_rules}
          onChange={(e) => update("house_rules", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label>Guesty listing ID (once synced)</label>
        <input
          style={inputStyle}
          value={form.guesty_listing_id}
          onChange={(e) => update("guesty_listing_id", e.target.value)}
        />
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button type="submit" disabled={saving} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Create property"}
      </button>
    </form>
  );
}
