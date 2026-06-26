import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const skillUrl = process.env.AGENT_SKILL_URL?.trim();
  const skillDigest = process.env.AGENT_SKILL_DIGEST?.trim();

  const metadata = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: skillUrl && skillDigest
      ? [
          {
            name: "traderadd-skill",
            type: "skill-md",
            description: "Analyze trading journals.",
            url: new URL(skillUrl, origin).toString(),
            digest: skillDigest
          }
        ]
      : []
  };

  return Response.json(metadata);
}
