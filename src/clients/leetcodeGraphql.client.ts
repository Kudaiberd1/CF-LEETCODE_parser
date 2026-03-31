const GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

export async function executeLeetCodeGraphQL(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<unknown> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      `LeetCode GraphQL HTTP ${response.status}: ${JSON.stringify(payload)}`,
    );
  }
  if (payload?.errors) {
    throw new Error(
      `LeetCode GraphQL errors: ${JSON.stringify(payload.errors)}`,
    );
  }
  return payload.data;
}
