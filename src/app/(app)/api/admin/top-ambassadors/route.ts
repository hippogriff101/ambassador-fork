import { isUserAdmin } from "@/lib/applications/review";
import { ensureSchema } from "@/lib/database/ensure-schema";
import { isSameOriginRequest } from "@/lib/http";
import { getActorSession } from "@/lib/session";
import { loadTopAmbassadors } from "@/lib/admin/top-ambassadors";

export async function GET(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const session = await getActorSession();
  if (!session) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  await ensureSchema();
  if (!(await isUserAdmin(session.sub))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const rangeParam = new URL(request.url).searchParams.get("range");
  const range = rangeParam === "7d" || rangeParam === "month" ? rangeParam : "all";

  const ambassadors = await loadTopAmbassadors(range);

  return Response.json({ range, ambassadors });
}
