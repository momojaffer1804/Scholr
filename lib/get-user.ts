import { requireUser } from "@/lib/authorization";

export async function getOrCreateDefaultUser() {
  return await requireUser();
}
