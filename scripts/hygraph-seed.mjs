/**
 * hygraph-seed.mjs
 * Cria os modelos Case e Testimonial no Hygraph e popula com dados reais.
 *
 * COMO USAR:
 *   1. Abra app.hygraph.com → seu projeto → Settings → API Access
 *   2. Em "Permanent Auth Tokens" clique em "Add token"
 *      → Role: Editor (Content API)
 *      → Copie o token
 *   3. No terminal:
 *        HYGRAPH_ENDPOINT=<url_do_content_api> HYGRAPH_TOKEN=<seu_token> node scripts/hygraph-seed.mjs
 *
 * NOTA: Este script usa APENAS a Content API (mutations) — não precisa de token de management.
 * Os modelos (Case, Testimonial) precisam já existir no schema do Hygraph.
 * Se não existirem, crie-os pelo dashboard primeiro (veja README abaixo).
 */

const ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const TOKEN    = process.env.HYGRAPH_TOKEN;

if (!ENDPOINT || !TOKEN) {
  console.error('❌  Defina HYGRAPH_ENDPOINT e HYGRAPH_TOKEN como variáveis de ambiente.');
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT.replace('/cdn.', '/api.').replace('/content/', '/v2/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
    return null;
  }
  return json.data;
}

// ── Dados dos cases ───────────────────────────────────────
const cases = [
  {
    slug: 'fiel-alimentos',
    nome: 'Fiel Alimentos',
    setor: 'Distribuidora de Alimentos',
    cidade: 'Corrente, PI',
    servico: 'reforma',
    resumo: 'Distribuidora regional que em 45 dias após a reforma recebeu o primeiro pedido via formulário do site e começou a atrair distribuidores de outras regiões pelo Google.',
    desafio: 'Site de 2018 sem atualização alguma. Parecia empresa fechada. Invisível em buscas de distribuidores e parceiros. O único canal de contato era telefone e indicação pessoal. Sem página ou formulário de proposta de parceria.',
    solucao: 'Reforma completa com novo design premium, SEO técnico focado em buscas B2B regionais, formulário de proposta de parceria, schema markup para distribuidoras, e otimização para aparecer nas IAs como o ChatGPT e Gemini.',
    resultado: 'Primeiro pedido pelo formulário chegou em 45 dias. Distribuidores de outras regiões passaram a encontrar a empresa pelo Google. O formulário de parceria virou canal ativo de vendas. Google e IAs passaram a validar a empresa antes de qualquer reunião.',
    metricas: [
      { valor: '+340%', label: 'visitas em 60 dias' },
      { valor: '45 dias', label: '1° pedido pelo site' },
      { valor: '14 dias', label: 'da aprovação ao ar' },
    ],
    depoimentoTexto: 'Antes o site parecia que a empresa tinha fechado. Agora recebo pedido de parceria de distribuidores que nem conhecia. Em 45 dias o site já pagou o investimento.',
    depoimentoAutor: 'Equipe Fiel Alimentos',
    depoimentoCargo: 'Distribuidora · Corrente, PI',
    antes: [
      'Site de 2018 sem atualização — parecia empresa fechada',
      'Invisível em buscas de distribuidores e parceiros',
      'Único canal de contato: telefone e indicação',
      'Sem página ou formulário de proposta de parceria',
    ],
    depois: [
      'Primeiro pedido pelo formulário em 45 dias no ar',
      'Distribuidores de outras regiões chegando pelo Google',
      'Formulário de parceria virou canal de vendas ativo',
      'Google e IAs validam a empresa antes de qualquer reunião',
    ],
    cor: '#4FD1C5',
    ordem: 1,
  },
  {
    slug: 'emcorr-centro-clinico',
    nome: 'EmCORR Centro Clínico',
    setor: 'Saúde',
    cidade: 'Corrente, PI',
    servico: 'reforma',
    resumo: 'Centro clínico de Corrente que triplicou os agendamentos via WhatsApp em 2 meses após a reforma e passou a receber pacientes semanalmente de cidades vizinhas.',
    desafio: 'Presença digital desatualizada — as especialidades não eram conhecidas online. Pacientes de cidades vizinhas não sabiam que a clínica existia. Zero agendamentos digitais, dependência total de indicação pessoal. Concorrentes de outras cidades dominavam as buscas locais.',
    solucao: 'Reforma completa com todas as 8 especialidades indexadas e otimizadas para SEO local. Integração com WhatsApp para agendamento. Schema markup de HealthcareFacility. Páginas por especialidade para aparecer em buscas específicas da região.',
    resultado: '8 especialidades indexadas e encontradas no Google. Pacientes chegando toda semana de cidades vizinhas. Agendamentos via WhatsApp triplicaram em 2 meses. EmCORR se tornou referência de saúde digital na região de Corrente.',
    metricas: [
      { valor: '3×', label: 'mais agendamentos' },
      { valor: '8', label: 'especialidades no Google' },
      { valor: '2 meses', label: 'retorno do investimento' },
    ],
    depoimentoTexto: 'Entrei achando que ia ser uma reunião de venda. Saí com um roteiro do que estava errado no meu site — e a certeza de que era com ele que eu queria trabalhar.',
    depoimentoAutor: 'Equipe EmCORR',
    depoimentoCargo: 'Centro Clínico · Corrente, PI',
    antes: [
      'Presença digital desatualizada — especialidades desconhecidas',
      'Pacientes de cidades vizinhas não sabiam que a clínica existia',
      'Zero agendamentos digitais — dependência total de indicação',
      'Concorrentes de outras cidades dominavam as buscas locais',
    ],
    depois: [
      '8 especialidades indexadas e encontradas no Google',
      'Pacientes chegando toda semana de cidades vizinhas',
      'Agendamentos via WhatsApp triplicaram em 2 meses',
      'Referência de saúde digital na região de Corrente',
    ],
    cor: '#4FD1C5',
    ordem: 2,
  },
  {
    slug: 'clinica-pinheiro',
    nome: 'Clínica Pinheiro',
    setor: 'Clínica Médica',
    cidade: 'Bom Jesus, PI',
    servico: 'site-novo',
    resumo: 'Clínica médica de Bom Jesus que saiu de 3–4 agendamentos digitais por semana para 15+ no primeiro mês, com o investimento pago no próprio mês de lançamento.',
    desafio: 'Layout desatualizado afastando pacientes exigentes. Apenas 3–4 agendamentos por semana pelo digital. Invisível no Google — zero presença em busca local. Novos pacientes chegavam exclusivamente por indicação de conhecidos.',
    solucao: 'Site novo premium construído do zero com design que transmite autoridade médica. SEO local focado em Bom Jesus e região. Schema markup de Physician e MedicalClinic. Integração com WhatsApp para agendamento imediato. Velocidade abaixo de 1s no 4G.',
    resultado: '15+ agendamentos por semana a partir do primeiro mês. 1ª página do Google para 8 palavras-chave locais. Design que transmite confiança antes de qualquer contato. Investimento recuperado no próprio primeiro mês de operação.',
    metricas: [
      { valor: '4×', label: 'mais agendamentos' },
      { valor: '8', label: 'keywords na 1ª página' },
      { valor: '1 mês', label: 'para pagar o investimento' },
    ],
    depoimentoTexto: 'No primeiro mês já tinha mais agendamentos do que esperava em três. O site se pagou antes de eu receber a fatura do cartão.',
    depoimentoAutor: 'Dr. Pinheiro',
    depoimentoCargo: 'Clínica Médica · Bom Jesus, PI',
    antes: [
      'Layout desatualizado afastando pacientes exigentes',
      'Apenas 3–4 agendamentos por semana pelo digital',
      'Invisível no Google — zero aparece em busca local',
      'Novos pacientes chegavam só por indicação de conhecidos',
    ],
    depois: [
      '15+ agendamentos por semana a partir do primeiro mês',
      '1ª página do Google para 8 palavras-chave locais',
      'Design que transmite confiança antes de qualquer contato',
      'Investimento pago no primeiro mês de operação',
    ],
    cor: '#e8c547',
    ordem: 3,
  },
];

// ── Dados dos depoimentos ─────────────────────────────────
const testimonials = [
  {
    texto: 'Antes o site parecia que a empresa tinha fechado. Agora recebo pedido de parceria de distribuidores que nem conhecia. Em 45 dias o site já pagou o investimento.',
    autor: 'Equipe Fiel Alimentos',
    cargo: 'Gestão',
    empresa: 'Fiel Alimentos',
    cidade: 'Corrente, PI',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'FA',
    ordem: 1,
  },
  {
    texto: 'Entrei achando que ia ser uma reunião de venda. Saí com um roteiro do que estava errado no meu site — e a certeza de que era com ele que eu queria trabalhar.',
    autor: 'Equipe EmCORR',
    cargo: 'Gestão',
    empresa: 'EmCORR Centro Clínico',
    cidade: 'Corrente, PI',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'EC',
    ordem: 2,
  },
  {
    texto: 'No primeiro mês já tinha mais agendamentos do que esperava em três. O site se pagou antes de eu receber a fatura do cartão.',
    autor: 'Dr. Pinheiro',
    cargo: 'Diretor',
    empresa: 'Clínica Pinheiro',
    cidade: 'Bom Jesus, PI',
    servico: 'Site Novo',
    estrelas: 5,
    iniciais: 'CP',
    ordem: 3,
  },
];

// ── Mutations ─────────────────────────────────────────────
const CREATE_CASE = `
  mutation CreateCase(
    $slug: String!, $nome: String!, $setor: String!, $cidade: String!,
    $servico: String!, $resumo: String!, $desafio: String!, $solucao: String!,
    $resultado: String!, $depoimentoTexto: String, $depoimentoAutor: String,
    $depoimentoCargo: String, $antes: [String!]!, $depois: [String!]!,
    $cor: String!, $ordem: Int!
  ) {
    createCase(data: {
      slug: $slug, nome: $nome, setor: $setor, cidade: $cidade,
      servico: $servico, resumo: $resumo, desafio: $desafio, solucao: $solucao,
      resultado: $resultado, depoimentoTexto: $depoimentoTexto,
      depoimentoAutor: $depoimentoAutor, depoimentoCargo: $depoimentoCargo,
      antes: $antes, depois: $depois,
      cor: $cor, ordem: $ordem
    }) { id slug }
  }
`;

const PUBLISH_CASE = `
  mutation PublishCase($id: ID!) {
    publishCase(where: { id: $id }, to: PUBLISHED) { id }
  }
`;

const CREATE_TESTIMONIAL = `
  mutation CreateTestimonial(
    $texto: String!, $autor: String!, $cargo: String!, $empresa: String!,
    $cidade: String!, $servico: String!, $estrelas: Int!, $iniciais: String!, $ordem: Int!
  ) {
    createTestimonial(data: {
      texto: $texto, autor: $autor, cargo: $cargo, empresa: $empresa,
      cidade: $cidade, servico: $servico, estrelas: $estrelas,
      iniciais: $iniciais, ordem: $ordem
    }) { id autor }
  }
`;

const PUBLISH_TESTIMONIAL = `
  mutation PublishTestimonial($id: ID!) {
    publishTestimonial(where: { id: $id }, to: PUBLISHED) { id }
  }
`;

// ── Execução ──────────────────────────────────────────────
async function main() {
  console.log('🌱  Iniciando seed do Hygraph...\n');

  // Cases
  for (const c of cases) {
    const { metricas, ...vars } = c;
    console.log(`📋  Criando case: ${c.nome}...`);
    const data = await gql(CREATE_CASE, vars);
    if (!data) { console.log('   ⚠️  Erro ao criar — pode já existir, pulando.\n'); continue; }
    const id = data.createCase.id;
    console.log(`   ✓  Criado (id: ${id})`);
    await gql(PUBLISH_CASE, { id });
    console.log(`   ✓  Publicado\n`);
  }

  // Testimonials
  for (const t of testimonials) {
    console.log(`💬  Criando depoimento: ${t.autor}...`);
    const data = await gql(CREATE_TESTIMONIAL, t);
    if (!data) { console.log('   ⚠️  Erro ao criar — pode já existir, pulando.\n'); continue; }
    const id = data.createTestimonial.id;
    console.log(`   ✓  Criado (id: ${id})`);
    await gql(PUBLISH_TESTIMONIAL, { id });
    console.log(`   ✓  Publicado\n`);
  }

  console.log('✅  Seed concluído!');
  console.log('\n⚠️  IMPORTANTE: Os modelos Case e Testimonial precisam existir no schema.');
  console.log('   Se você vir erros de "mutation not found", crie os modelos no dashboard primeiro.');
  console.log('   Veja: https://app.hygraph.com → Schema → Add Model\n');
}

main().catch(console.error);
