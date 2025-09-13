import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId ? await currentUser() : undefined,
  };
}
