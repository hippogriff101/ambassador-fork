import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { isUserAdmin } from "@/lib/applications/review";
import { ensureSchema } from "@/lib/database/ensure-schema";
import { isProduction } from "@/lib/env";
import { getHcbAuthorizationUrl } from "@/lib/hcb/service";
import { getAppUrl, isSameOriginRequest } from "@/lib/http";
import { getActorSession } from "@/lib/session";

export async function POST(request: Request) {
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

  const state = randomUUID();
  const cookieStore = await cookies();

  cookieStore.set("ambassador_hcb_oauth_state", state, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return Response.redirect(getAppUrl(getHcbAuthorizationUrl(state), request), 303);
}
