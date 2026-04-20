import { ensureSchema } from "@/lib/database/ensure-schema";
import { optionalEnv } from "@/lib/env";
import { isSameOriginRequest } from "@/lib/http";
import {
  createSecondaryReferralLinkForUser,
  listReferralLinksForUser,
  ReferralLinkError,
} from "@/lib/referrals";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensureSchema();

  const links = await listReferralLinksForUser(session.sub);

  return Response.json({
    links: links.map((link) => ({
      ...link,
      url: new URL(
        `/r/${encodeURIComponent(link.code)}`,
        optionalEnv("CURRENT_DOMAIN") ?? request.url,
      ).toString(),
    })),
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const session = await getSession();

  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensureSchema();

  const body: unknown = await request.json().catch(() => null);
  const payload: Record<string, unknown> | null =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? Object.fromEntries(Object.entries(body))
      : null;

  try {
    const link = await createSecondaryReferralLinkForUser(
      session.sub,
      typeof payload?.name === "string" ? payload.name : "",
    );

    return Response.json(
      {
        link: {
          ...link,
          url: new URL(
            `/r/${encodeURIComponent(link.code)}`,
            optionalEnv("CURRENT_DOMAIN") ?? request.url,
          ).toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ReferralLinkError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Error) {
      console.error(error);
    }

    return Response.json({ error: "Failed to create referral link." }, { status: 400 });
  }
}
