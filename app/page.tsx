import { getFeaturedProperty } from "@/lib/get-property";
import HomeClient from "./home-client";

export default async function Home() {
  const property = await getFeaturedProperty();
  return <HomeClient property={property} />;
}
