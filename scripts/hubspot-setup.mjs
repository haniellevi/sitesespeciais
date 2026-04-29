/**
 * hubspot-setup.mjs
 * Configura as propriedades customizadas no HubSpot CRM.
 * Rodado UMA VEZ após criar o Private App.
 *
 * USO:
 *   HUBSPOT_API_KEY=pat-na1-... node scripts/hubspot-setup.mjs
 */

const TOKEN = process.env.HUBSPOT_API_KEY;
if (!TOKEN) {
  console.error('❌  Defina HUBSPOT_API_KEY como variável de ambiente.');
  process.exit(1);
}

const BASE = 'https://api.hubapi.com';
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function hs(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

// ── Propriedades customizadas a criar ────────────────────
const properties = [
  {
    groupName: 'contactinformation',
    name: 'diagnostico_problema',
    label: 'Diagnóstico — Principal Problema',
    type: 'string',
    fieldType: 'text',
    description: 'Problema informado no formulário de diagnóstico',
  },
  {
    groupName: 'contactinformation',
    name: 'diagnostico_setor',
    label: 'Diagnóstico — Setor',
    type: 'string',
    fieldType: 'text',
    description: 'Setor da empresa informado no formulário',
  },
  {
    groupName: 'contactinformation',
    name: 'diagnostico_tem_site',
    label: 'Diagnóstico — Tem Site',
    type: 'string',
    fieldType: 'select',
    options: [
      { label: 'Sim', value: 'sim', displayOrder: 0 },
      { label: 'Não', value: 'nao', displayOrder: 1 },
    ],
    description: 'Se a empresa já tem site',
  },
  {
    groupName: 'contactinformation',
    name: 'diagnostico_url_site',
    label: 'Diagnóstico — URL do Site',
    type: 'string',
    fieldType: 'text',
    description: 'URL do site informada no formulário',
  },
  {
    groupName: 'contactinformation',
    name: 'lead_source',
    label: 'Lead Source (Sites Especiais)',
    type: 'string',
    fieldType: 'text',
    description: 'Origem do lead (ex: diagnostico_site, calculadora, checklist)',
  },
];

async function main() {
  console.log('🔧  Configurando propriedades no HubSpot CRM...\n');

  // Verificar autenticação
  const me = await hs('GET', '/crm/v3/objects/contacts?limit=1');
  if (!me.ok && me.status === 401) {
    console.error('❌  Token inválido ou sem permissão. Verifique HUBSPOT_API_KEY.');
    process.exit(1);
  }
  console.log('✓  Token válido\n');

  for (const prop of properties) {
    process.stdout.write(`📋  Criando propriedade "${prop.name}"... `);
    const { ok, status, data } = await hs('POST', '/crm/v3/properties/contacts', prop);
    if (ok) {
      console.log('✓  Criada');
    } else if (status === 409 || data?.category === 'CONFLICT') {
      console.log('⚠️  Já existe (ok)');
    } else {
      console.log(`❌  Erro ${status}: ${data?.message ?? JSON.stringify(data)}`);
    }
  }

  // Testar criação de contato
  console.log('\n🧪  Testando criação de contato...');
  const testContact = await hs('POST', '/crm/v3/objects/contacts', {
    properties: {
      email: `teste-cli-${Date.now()}@sitesespeciais.com.br`,
      firstname: 'Teste',
      lastname: 'CLI',
      diagnostico_problema: 'invisivel_google',
      diagnostico_setor: 'clinica',
      diagnostico_tem_site: 'sim',
      lead_source: 'diagnostico_site',
    },
  });

  if (testContact.ok) {
    const id = testContact.data.id;
    console.log(`✓  Contato de teste criado (id: ${id})`);
    // Limpar contato de teste
    await hs('DELETE', `/crm/v3/objects/contacts/${id}`);
    console.log('✓  Contato de teste removido\n');
  } else {
    console.log(`❌  Erro: ${JSON.stringify(testContact.data)}\n`);
  }

  console.log('✅  Setup do HubSpot concluído!');
  console.log('\n📋  Próximo passo: adicione HUBSPOT_API_KEY ao Vercel:');
  console.log('   npx vercel env add HUBSPOT_API_KEY production\n');
}

main().catch(console.error);
