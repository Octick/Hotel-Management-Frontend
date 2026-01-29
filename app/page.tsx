// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the combined Auth page
  redirect("/auth");
}
