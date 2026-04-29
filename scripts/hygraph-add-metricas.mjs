/**
 * hygraph-add-metricas.mjs
 * 1. Cria o componente Metrica (valor + label)
 * 2. Adiciona campo metricas[] ao modelo Case
 * 3. Popula os 3 cases existentes com suas métricas
 *
 * USO: node scripts/hygraph-add-metricas.mjs
 */
import { Client, SimpleFieldType, VisibilityTypes } from '@hygraph/management-sdk';

const TOKEN    = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzczMTk0ODQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21vaGx2OXB1MTQ3OTA2cGsxYXpkMG1ucC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMGJhYTM0NzctYjc3OC00NTZkLTkzYzAtNDhjNDA2YTZlZTM2IiwianRpIjoiY21vaG00cXVkMTZ2ZzA4bG4zbGY2ZmFpbSJ9.CfVUO6vQpBkwL6CD-J1uItCmjTPurVKGupAzvT63B90su_Qz8RfvAIaT-BIQjRmY_7B8GPsMBO2J633np9GvEaAPCpBoH5aIq8CINPJDP96zGlDm6NB3XpE7NouUS9Ka0R8Eqr55cebJFROHAlosOlWjKrmhqUi4TMk-H3lt7U4YUfeTFI6xEoSZCFHPyODBdxSmbr6r8VNoPVbAsO8zIB0YQgpMjTi8J0fSeb_4_ku6ISbcJw5xajimUdKQbwC9-BFKKf4Og5PqUQ4DNkD1f5U-RsEIGULcuOY1LoKwpFyIUc4Nq8f4NU18AFRxBwEwbnrymt7mZl6akgkEugwc9XaWLCBy36IZLrtm5_HJwB-aUtJLtQ32Y3_tJxw0Ca-dmZ14UrQxta05DGMVL_W805BabjODS03rbAf2F1-hZB3tdM3F01SilYBE9A6en5i_PRcqZBYg1cVD0yf5XDvy3L8sgZj6CDB_WG06CgFKlBkbFi18KoKaLPMtKGNKV7r7E1tY1sxhDJqN2PgWNC_50AB7otwuXUYQVn4p02gg4E3zuyIVlxSnMVRVLeLXC4oN4t9I8RhIPJjpj36WdEngiKcr64jFaD-Pi-0aSwzNrOwWpH1cjGt5eszve1pnir63Cu2A_ILIBpVWO1hXpzsS2g4K_KMMuOKomyf4xRt_7aA';
const ENDPOINT = 'https://api-us-west-2.hygraph.com/v2/cmohlv9pu147906pk1azd0mnp/master';

// ── Métricas dos cases (mesmos dados do seed) ─────────────
const caseMetricas = {
  'fiel-alimentos': [
    { valor: '+340%', label: 'visitas em 60 dias'     },
    { valor: '45 dias', label: '1° pedido pelo site'  },
    { valor: '14 dias', label: 'da aprovação ao ar'   },
  ],
  'emcorr-centro-clinico': [
    { valor: '3×',     label: 'mais agendamentos'      },
    { valor: '8',      label: 'especialidades no Google'},
    { valor: '2 meses',label: 'retorno do investimento'},
  ],
  'clinica-pinheiro': [
    { valor: '4×',     label: 'mais agendamentos'      },
    { valor: '8',      label: 'keywords na 1ª página'  },
    { valor: '1 mês',  label: 'para pagar o investimento'},
  ],
};

// ── GraphQL helper (Content API) ──────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
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

// ── Verifica schema existente ─────────────────────────────
async function mgmtQuery(query) {
  const res = await fetch('https://management-us-west-2.hygraph.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data;
}

async function main() {
  console.log('🔧  Hygraph — Fix Métricas\n');

  // ── Verificar se Metrica já existe ────────────────────
  const schemaData = await mgmtQuery(`{
    viewer {
      project(id: "d5058410389a498194cbbcc443fe0b33") {
        environment(name: "master") {
          contentModel {
            components { apiId }
            models {
              apiId
              fields { ... on IField { apiId } }
            }
          }
        }
      }
    }
  }`);

  const env = schemaData?.viewer?.project?.environment?.contentModel;
  const components  = (env?.components ?? []).map(c => c.apiId);
  const caseFields  = (env?.models?.find(m => m.apiId === 'Case')?.fields ?? []).map(f => f.apiId);

  console.log(`  Componentes: ${components.join(', ') || '(nenhum)'}`);
  console.log(`  Campos Case: ${caseFields.join(', ')}\n`);

  const metricaExists  = components.includes('Metrica');
  const metricasOnCase = caseFields.includes('metricas');

  // ── Parte 1: Schema (SDK) ─────────────────────────────
  if (!metricaExists || !metricasOnCase) {
    const client = new Client({
      authToken: TOKEN,
      endpoint:  ENDPOINT,
      name:      `add-metricas-v${Date.now()}`,
    });

    if (!metricaExists) {
      console.log('📦  Criando componente Metrica...');
      client.createComponent({
        apiId:        'Metrica',
        apiIdPlural:  'Metricas',
        displayName:  'Métrica',
        description:  'Par valor/label para exibir resultados nos cases',
      });
      client.createSimpleField({
        parentApiId: 'Metrica',
        apiId:       'valor',
        displayName: 'Valor',
        type:        SimpleFieldType.String,
        isRequired:  true,
        isList:      false,
        isUnique:    false,
        visibility:  VisibilityTypes.READ_WRITE,
      });
      client.createSimpleField({
        parentApiId: 'Metrica',
        apiId:       'label',
        displayName: 'Label',
        type:        SimpleFieldType.String,
        isRequired:  true,
        isList:      false,
        isUnique:    false,
        visibility:  VisibilityTypes.READ_WRITE,
      });
    }

    if (!metricasOnCase) {
      console.log('📋  Adicionando campo metricas[] ao Case...');
      client.createComponentField({
        parentApiId:    'Case',
        apiId:          'metricas',
        displayName:    'Métricas',
        componentApiId: 'Metrica',
        isList:         true,
        isRequired:     false,
        visibility:     VisibilityTypes.READ_WRITE,
      });
    }

    console.log('🚀  Executando migration...');
    try {
      const result = await client.run(true);
      if (result?.errors?.length) {
        console.error('❌  Migration errors:', JSON.stringify(result.errors));
        process.exit(1);
      }
      console.log(`✅  Schema ok (${result?.finishedAt ?? 'done'})\n`);
    } catch (e) {
      // "already exists" é ok
      if (e.message?.includes('already') || e.message?.includes('exists')) {
        console.log('⚠️  Componente/campo já existia, continuando...\n');
      } else {
        console.error('❌  Erro migration:', e.message);
        process.exit(1);
      }
    }
  } else {
    console.log('✓  Componente Metrica e campo metricas já existem\n');
  }

  // ── Parte 2: Buscar IDs dos cases ─────────────────────
  console.log('🔍  Buscando cases no Hygraph...');
  const casesData = await gql(`{
    cases(stage: DRAFT) { id slug }
  }`);

  if (!casesData?.cases?.length) {
    console.log('❌  Nenhum case encontrado. Verifique o Hygraph.');
    process.exit(1);
  }

  console.log(`  ${casesData.cases.length} cases encontrados\n`);

  // ── Parte 3: Popular métricas nos cases ───────────────
  for (const c of casesData.cases) {
    const metricas = caseMetricas[c.slug];
    if (!metricas) {
      console.log(`⚠️  Slug "${c.slug}" sem métricas definidas — pulando`);
      continue;
    }

    process.stdout.write(`📊  ${c.slug}: adicionando ${metricas.length} métricas... `);

    // Limpa metricas existentes e recria
    // MetricaCreateWithPositionInput requer { data: { valor, label } }
    const metricasInput = metricas.map(m => ({ data: m }));

    const update = await gql(`
      mutation UpdateMetricas($id: ID!, $metricas: [MetricaCreateWithPositionInput!]!) {
        updateCase(
          where: { id: $id }
          data: { metricas: { create: $metricas } }
        ) { id slug }
      }
    `, { id: c.id, metricas: metricasInput });

    if (!update) {
      console.log('❌  Erro ao atualizar');
      continue;
    }

    // Publicar
    await gql(`
      mutation PublishCase($id: ID!) {
        publishCase(where: { id: $id }, to: PUBLISHED) { id }
      }
    `, { id: c.id });

    console.log('✓');
  }

  console.log('\n✅  Métricas adicionadas a todos os cases!');
  console.log('   Os cases agora têm metricas[] com valor + label.\n');
}

main().catch(e => { console.error('Erro fatal:', e.message); process.exit(1); });
