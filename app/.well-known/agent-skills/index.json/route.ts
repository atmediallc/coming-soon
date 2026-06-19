import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const metadata = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "traderadd-skill",
        type: "skill-md",
        description: "Analyze trading journals.",
        url: `${origin}/skill.md`,
        digest: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    ]
  };

  return Response.json(metadata);
}
