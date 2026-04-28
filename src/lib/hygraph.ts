const ENDPOINT = import.meta.env.HYGRAPH_ENDPOINT as string;
const TOKEN    = import.meta.env.HYGRAPH_TOKEN    as string;

async function fetchHygraph<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Hygraph fetch failed: ${res.status}`);

  const json = await res.json() as { data: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data;
}

// ── Tipos ───────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: { html: string };
  coverImage: { url: string; alt?: string };
  author?: { name: string; picture?: { url: string } };
  category: { name: string; slug: string }[];
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage: { url: string };
  author?: { name: string };
  category: { name: string; slug: string }[];
}

// ── Queries ─────────────────────────────────────────

const POST_SUMMARY_FIELDS = /* GraphQL */ `
  id
  title
  slug
  date
  excerpt
  coverImage { url }
  author { name }
  category { name slug }
`;

export async function getAllPosts(): Promise<PostSummary[]> {
  const data = await fetchHygraph<{ posts: PostSummary[] }>(`
    query AllPosts {
      posts(orderBy: date_DESC, stage: PUBLISHED) {
        ${POST_SUMMARY_FIELDS}
      }
    }
  `);
  return data.posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await fetchHygraph<{ post: Post | null }>(`
    query PostBySlug($slug: String!) {
      post(where: { slug: $slug }, stage: PUBLISHED) {
        id
        title
        slug
        date
        excerpt
        content { html }
        coverImage { url }
        author { name picture { url } }
        category { name slug }
      }
    }
  `, { slug });
  return data.post;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const data = await fetchHygraph<{ posts: { slug: string }[] }>(`
    query AllPostSlugs {
      posts(stage: PUBLISHED) { slug }
    }
  `);
  return data.posts.map((p) => p.slug);
}
