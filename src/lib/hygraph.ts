const ENDPOINT = import.meta.env.HYGRAPH_ENDPOINT as string;
const TOKEN    = import.meta.env.HYGRAPH_TOKEN    as string;

async function fetchHygraph<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!ENDPOINT || !TOKEN) throw new Error('Hygraph env vars not set');

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

// ── Case ────────────────────────────────────────────
// Hygraph model: Case
// Fields: slug(String), nome(String), setor(String), cidade(String),
//   servico(String: "reforma"|"site-novo"), resumo(String), desafio(String),
//   solucao(String), resultado(String), metricas(Component[]: {valor,label}),
//   depoimentoTexto(String), depoimentoAutor(String), depoimentoCargo(String),
//   antes([String] multi-value), depois([String] multi-value), cor(String), ordem(Int)

export interface HygraphCase {
  slug: string;
  nome: string;
  setor: string;
  cidade: string;
  servico: string;
  resumo: string;
  desafio: string;
  solucao: string;
  resultado: string;
  metricas: { valor: string; label: string }[];
  depoimentoTexto?: string;
  depoimentoAutor?: string;
  depoimentoCargo?: string;
  antes: string[];
  depois: string[];
  cor: string;
}

const CASE_FIELDS = /* GraphQL */ `
  slug nome setor cidade servico resumo desafio solucao resultado
  metricas { valor label }
  depoimentoTexto depoimentoAutor depoimentoCargo
  antes depois cor
`;

export async function getAllCasesFromHygraph(): Promise<HygraphCase[]> {
  const data = await fetchHygraph<{ cases: HygraphCase[] }>(`
    query AllCases {
      cases(orderBy: ordem_ASC, stage: PUBLISHED) { ${CASE_FIELDS} }
    }
  `);
  return data.cases ?? [];
}

export async function getCaseFromHygraph(slug: string): Promise<HygraphCase | null> {
  const data = await fetchHygraph<{ case: HygraphCase | null }>(`
    query CaseBySlug($slug: String!) {
      case(where: { slug: $slug }, stage: PUBLISHED) { ${CASE_FIELDS} }
    }
  `, { slug });
  return data.case;
}

// ── Testimonial ─────────────────────────────────────
// Hygraph model: Testimonial
// Fields: texto(String), autor(String), cargo(String), empresa(String),
//   cidade(String), servico(String), estrelas(Int default 5),
//   iniciais(String), ordem(Int)

export interface HygraphTestimonial {
  id: string;
  texto: string;
  autor: string;
  cargo: string;
  empresa: string;
  cidade: string;
  servico: string;
  estrelas: number;
  iniciais: string;
}

export async function getAllTestimonialsFromHygraph(): Promise<HygraphTestimonial[]> {
  const data = await fetchHygraph<{ testimonials: HygraphTestimonial[] }>(`
    query AllTestimonials {
      testimonials(orderBy: ordem_ASC, stage: PUBLISHED) {
        id texto autor cargo empresa cidade servico estrelas iniciais
      }
    }
  `);
  return data.testimonials ?? [];
}
