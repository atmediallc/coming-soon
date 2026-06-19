# auth.md

## Agent Audience
This service allows AI agents to access a trader's journal.

## Registration
To register your agent, please direct users to `https://example.com/agent/register`.

## Supported Methods
We currently support `id_jag` and `verified_email`.

## Credential Use
Use the obtained OAuth token as a Bearer token in the `Authorization` header for all requests to our protected API endpoints.
