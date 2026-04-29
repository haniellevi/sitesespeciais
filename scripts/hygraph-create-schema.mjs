/**
 * hygraph-create-schema.mjs
 * Cria modelos Case e Testimonial via @hygraph/management-sdk.
 * Roda UMA VEZ — se os modelos já existem, nada é sobrescrito.
 *
 * USO: node scripts/hygraph-create-schema.mjs
 */
import { Client, SimpleFieldType, VisibilityTypes } from '@hygraph/management-sdk';

const TOKEN    = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA';

// Endpoint Content API (o SDK usa /v2/... não a management API diretamente)
const ENDPOINT = 'https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master';

// Nome único por execução — mude se precisar rodar de novo
const MIGRATION_NAME = `create-case-testimonial-v${Date.now()}`;

// ── Verifica quais modelos já existem via Content API ──────
async function getExistingModels() {
  const res = await fetch('https://management-us-west-2.hygraph.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query: `{
      viewer { project(id: "d5058410389a498194cbbcc443fe0b33") {
        environment(name: "master") { contentModel { models { apiId } } }
      } }
    }` }),
  });
  const json = await res.json();
  return (json.data?.viewer?.project?.environment?.contentModel?.models ?? []).map(m => m.apiId);
}

// ── Verifica quais campos já existem num modelo ────────────
async function getExistingFields(modelApiId) {
  const res = await fetch('https://management-us-west-2.hygraph.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query: `{
      viewer { project(id: "d5058410389a498194cbbcc443fe0b33") {
        environment(name: "master") { contentModel {
          models { apiId fields { ... on IField { apiId } } }
        } }
      } }
    }` }),
  });
  const json = await res.json();
  const models = json.data?.viewer?.project?.environment?.contentModel?.models ?? [];
  const model = models.find(m => m.apiId === modelApiId);
  return (model?.fields ?? []).map(f => f.apiId);
}

async function main() {
  console.log('🔧  Hygraph Schema Setup — Sites Especiais\n');

  const existing = await getExistingModels();
  console.log(`✓  Modelos existentes: ${existing.join(', ')}\n`);

  const caseExists        = existing.includes('Case');
  const testimonialExists = existing.includes('Testimonial');

  // Descobre campos já criados
  const caseFields        = caseExists        ? await getExistingFields('Case')        : [];
  const testimonialFields = testimonialExists ? await getExistingFields('Testimonial') : [];

  console.log(`  Case campos existentes:        ${caseFields.join(', ') || '(nenhum)'}`);
  console.log(`  Testimonial campos existentes: ${testimonialFields.join(', ') || '(nenhum)'}\n`);

  // ── Definições dos campos ──────────────────────────────
  const caseFieldDefs = [
    { apiId: 'slug',            displayName: 'Slug',            type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'nome',            displayName: 'Nome',            type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'setor',           displayName: 'Setor',           type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'cidade',          displayName: 'Cidade',          type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'servico',         displayName: 'Serviço',         type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'resumo',          displayName: 'Resumo',          type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'desafio',         displayName: 'Desafio',         type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'solucao',         displayName: 'Solução',         type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'resultado',       displayName: 'Resultado',       type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'depoimentoTexto', displayName: 'Depo. Texto',     type: SimpleFieldType.String,  isRequired: false, isList: false },
    { apiId: 'depoimentoAutor', displayName: 'Depo. Autor',     type: SimpleFieldType.String,  isRequired: false, isList: false },
    { apiId: 'depoimentoCargo', displayName: 'Depo. Cargo',     type: SimpleFieldType.String,  isRequired: false, isList: false },
    { apiId: 'antes',           displayName: 'Antes',           type: SimpleFieldType.String,  isRequired: true,  isList: true  },
    { apiId: 'depois',          displayName: 'Depois',          type: SimpleFieldType.String,  isRequired: true,  isList: true  },
    { apiId: 'cor',             displayName: 'Cor',             type: SimpleFieldType.String,  isRequired: true,  isList: false },
    { apiId: 'ordem',           displayName: 'Ordem',           type: SimpleFieldType.Int,     isRequired: true,  isList: false },
  ];

  const testimonialFieldDefs = [
    { apiId: 'texto',    displayName: 'Texto',    type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'autor',    displayName: 'Autor',    type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'cargo',    displayName: 'Cargo',    type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'empresa',  displayName: 'Empresa',  type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'cidade',   displayName: 'Cidade',   type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'servico',  displayName: 'Serviço',  type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'estrelas', displayName: 'Estrelas', type: SimpleFieldType.Int,    isRequired: true,  isList: false },
    { apiId: 'iniciais', displayName: 'Iniciais', type: SimpleFieldType.String, isRequired: true,  isList: false },
    { apiId: 'ordem',    displayName: 'Ordem',    type: SimpleFieldType.Int,    isRequired: true,  isList: false },
  ];

  // Filtrar apenas o que ainda não existe
  const caseTodo        = caseFieldDefs.filter(f => !caseFields.includes(f.apiId));
  const testimonialTodo = testimonialFieldDefs.filter(f => !testimonialFields.includes(f.apiId));

  if (!caseExists && caseTodo.length === 0 && !testimonialExists && testimonialTodo.length === 0) {
    console.log('✅  Nada a fazer — tudo já existe!');
    return;
  }

  // ── Instanciar cliente SDK ─────────────────────────────
  const client = new Client({
    authToken: TOKEN,
    endpoint:  ENDPOINT,
    name:      MIGRATION_NAME,
  });

  let ops = 0;

  // Criar modelo Case
  if (!caseExists) {
    console.log('📦  Enfileirando: createModel Case');
    client.createModel({ apiId: 'Case', apiIdPlural: 'Cases', displayName: 'Case', description: 'Cases de sucesso' });
    ops++;
  }

  // Campos do Case (novo ou incremental)
  if (caseTodo.length > 0) {
    console.log(`📋  Enfileirando ${caseTodo.length} campos no Case: ${caseTodo.map(f => f.apiId).join(', ')}`);
    for (const f of caseTodo) {
      client.createSimpleField({
        parentApiId:  'Case',
        apiId:        f.apiId,
        displayName:  f.displayName,
        type:         f.type,
        isRequired:   f.isRequired,
        isList:       f.isList,
        isUnique:     false,
        visibility:   VisibilityTypes.READ_WRITE,
      });
      ops++;
    }
  }

  // Criar modelo Testimonial
  if (!testimonialExists) {
    console.log('📦  Enfileirando: createModel Testimonial');
    client.createModel({ apiId: 'Testimonial', apiIdPlural: 'Testimonials', displayName: 'Testimonial', description: 'Depoimentos de clientes' });
    ops++;
  }

  // Campos do Testimonial
  if (testimonialTodo.length > 0) {
    console.log(`📋  Enfileirando ${testimonialTodo.length} campos no Testimonial: ${testimonialTodo.map(f => f.apiId).join(', ')}`);
    for (const f of testimonialTodo) {
      client.createSimpleField({
        parentApiId:  'Testimonial',
        apiId:        f.apiId,
        displayName:  f.displayName,
        type:         f.type,
        isRequired:   f.isRequired,
        isList:       f.isList,
        isUnique:     false,
        visibility:   VisibilityTypes.READ_WRITE,
      });
      ops++;
    }
  }

  if (ops === 0) {
    console.log('✅  Nada a fazer — tudo já existe!');
    return;
  }

  // ── Executar migração (foreground = aguarda resultado) ──
  console.log(`\n🚀  Executando ${ops} operações (migration: ${MIGRATION_NAME})...\n`);
  try {
    const result = await client.run(true); // true = foreground, aguarda

    if (result?.errors?.length) {
      console.error('❌  Migration com erros:', JSON.stringify(result.errors, null, 2));
      process.exit(1);
    }

    console.log(`✅  Migration concluída: ${result?.name}`);
    console.log(`   Finalizada em: ${result?.finishedAt ?? 'ok'}`);
    console.log('\n   Próximo passo: node scripts/hygraph-seed.mjs\n');
  } catch (e) {
    console.error('❌  Erro ao executar migration:', e.message);
    process.exit(1);
  }
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
