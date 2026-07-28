import { createServiceClient } from "@/lib/supabase/server";
import PropertyForm from "../property-form";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = createServiceClient();
  const { data: property } = await service.from("properties").select("*").eq("id", id).single();

  if (!property) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Edit — {property.name}</h1>
      <PropertyForm property={property} />
    </div>
  );
}
