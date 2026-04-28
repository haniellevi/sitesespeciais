export interface CaseMetrica {
  valor: string;
  label: string;
}

export interface Case {
  slug: string;
  nome: string;
  setor: string;
  cidade: string;
  servico: 'reforma' | 'site-novo';
  resumo: string;
  desafio: string;
  solucao: string;
  resultado: string;
  metricas: CaseMetrica[];
  depoimento?: {
    texto: string;
    autor: string;
    cargo: string;
  };
  antes: string[];
  depois: string[];
  cor: string;
}

export const cases: Case[] = [
  {
    slug: 'fiel-alimentos',
    nome: 'Fiel Alimentos',
    setor: 'Indústria de Alimentos / Atacado',
    cidade: 'Corrente, PI',
    servico: 'site-novo',
    resumo:
      'Indústria de temperos e molhos com 143 SKUs que vendia só por telefone e WhatsApp. Com o site novo, passou a receber pedidos de distribuidores de todo o Nordeste pelo formulário.',
    desafio:
      'A Fiel Alimentos tinha 143 produtos, 5 marcas e mais de 10 anos no mercado, mas seu site antigo não comunicava nada disso. Distribuidores e lojistas que pesquisavam no Google encontravam concorrentes menores. O catálogo era enviado manualmente por PDF no WhatsApp, e não havia como atrair novos parceiros B2B pelo digital.',
    solucao:
      'Site novo do zero com foco total em B2B: catálogo completo com as 5 marcas e 143 SKUs, formulário de parceria integrado, download de catálogo em PDF com captura de lead, e estrutura técnica para que distribuidores de toda a região encontrem a Fiel quando buscarem por fornecedores de temperos no Nordeste.',
    resultado:
      'Em 45 dias o site apareceu na primeira página do Google para as principais buscas do setor. A equipe comercial passou a receber solicitações de parceria por formulário toda semana — algo que nunca havia acontecido nos 12 anos de empresa.',
    metricas: [
      { valor: '+340%', label: 'mais visitas orgânicas em 60 dias' },
      { valor: '12', label: 'novos contatos B2B/mês pelo site' },
      { valor: '45 dias', label: 'para aparecer no Google' },
      { valor: 'R$ 0', label: 'em anúncios pagos' },
    ],
    depoimento: {
      texto:
        'Nossa equipe vendia só por telefone e WhatsApp há 12 anos. Com o site novo, em menos de dois meses começamos a receber pedidos de distribuidores que nunca tínhamos contatado. O formulário de parceria virou nosso melhor vendedor.',
      autor: 'Equipe Fiel Alimentos',
      cargo: 'Indústria de Alimentos — Corrente, PI',
    },
    antes: [
      'Site genérico que não mostrava o portfólio de 143 SKUs',
      'Sem formulário de parceria ou captura de lead',
      'Invisível no Google para buscas de distribuidores',
      'Catálogo enviado manualmente por PDF no WhatsApp',
    ],
    depois: [
      'Site B2B com catálogo completo das 5 marcas',
      'Formulário de parceria + download de catálogo com captura de lead',
      '1ª página do Google para buscas de fornecedores no Nordeste',
      'Carrega em menos de 1 segundo em qualquer dispositivo',
    ],
    cor: '#f0d060',
  },
  {
    slug: 'emcorr',
    nome: 'EmCORR Centro Clínico',
    setor: 'Saúde / Centro Clínico Multidisciplinar',
    cidade: 'Corrente, PI',
    servico: 'site-novo',
    resumo:
      'Centro clínico de referência em Corrente com 8 especialidades que não tinha presença digital. Com o site novo, novos pacientes passaram a agendar consultas diretamente pelo WhatsApp do site.',
    desafio:
      'O EmCORR tinha uma equipe qualificada, convênios com Humana Saúde, Camed e Medplan, e especialidades como Cardiologia, Pediatria e Neurologia — mas pacientes de cidades vizinhas não sabiam disso. Sem site, a clínica dependia exclusivamente de indicação boca a boca para crescer.',
    solucao:
      'Site novo com página dedicada a cada especialidade (facilitando a indexação no Google para buscas como "cardiologista em Corrente PI"), perfil completo dos médicos, convênios aceitos em destaque e botão de WhatsApp para agendamento imediato em cada seção. Design que transmite confiança e competência clínica.',
    resultado:
      'Dois meses após o lançamento, pacientes de Bom Jesus, Gilbués e Redenção do Gurguéia passaram a mencionar o site como forma de conhecer a clínica. O agendamento via WhatsApp vinculado ao site triplicou em relação ao período anterior.',
    metricas: [
      { valor: '3x', label: 'mais agendamentos via WhatsApp' },
      { valor: '8', label: 'especialidades com página própria' },
      { valor: '2 meses', label: 'para retorno do investimento' },
      { valor: '0 reais', label: 'em anúncios pagos' },
    ],
    depoimento: {
      texto:
        'Antes do site, pacientes de cidades vizinhas não sabiam que oferecemos Cardiologia e Neurologia aqui em Corrente. Com o site novo, toda semana recebemos pacientes que disseram ter encontrado a clínica pelo Google. Valeu cada centavo.',
      autor: 'Equipe EmCORR',
      cargo: 'Centro Clínico — Corrente, PI',
    },
    antes: [
      'Sem site — zero presença digital',
      'Especialidades desconhecidas fora de Corrente',
      'Agendamentos só por telefone e indicação',
      'Convênios aceitos não comunicados ao público',
    ],
    depois: [
      'Site com página dedicada a cada especialidade',
      'Encontrado no Google por pacientes da região',
      'Agendamento via WhatsApp integrado ao site',
      'Convênios e corpo clínico em destaque',
    ],
    cor: '#4FD1C5',
  },
  {
    slug: 'clinica-pinheiro',
    nome: 'Clínica Pinheiro',
    setor: 'Saúde / Clínica Médica e Laboratorial',
    cidade: 'Bom Jesus, PI',
    servico: 'reforma',
    resumo:
      'Clínica com mais de 25 anos em Bom Jesus que recebia 3–4 agendamentos por semana pelo site. Após a reforma, passou para 15+ sem investir em anúncios.',
    desafio:
      'A Clínica Pinheiro tinha 25 anos de história, exames laboratoriais, radiológicos e dezenas de especialidades — incluindo Medicina do Trabalho, Fonoaudiologia e Dermatologia. Mas o site WordPress era lento, não funcionava no celular e não aparecia no Google para as buscas que os pacientes faziam. O formulário de agendamento estava quebrado no mobile há meses.',
    solucao:
      'Reforma completa do site: novo design responsivo que abre em menos de 1 segundo no celular, página específica para cada especialidade (incluindo Exames Laboratoriais e Radiológicos), agendamento online simplificado e botão de WhatsApp visível em todas as páginas. Estrutura técnica para que o Google entenda cada serviço oferecido.',
    resultado:
      'Em dois meses, os agendamentos online saíram de 3–4 por semana para mais de 15. A clínica passou a aparecer na primeira página do Google para 8 palavras-chave relevantes em Bom Jesus e região, sem gastar um centavo em anúncios.',
    metricas: [
      { valor: '3x', label: 'mais agendamentos online' },
      { valor: '8', label: 'palavras-chave na 1ª página' },
      { valor: '1 mês', label: 'para pagar o investimento' },
      { valor: '0 reais', label: 'em anúncios pagos' },
    ],
    depoimento: {
      texto:
        'Em dois meses após a reforma do site, meus agendamentos online triplicaram. Antes recebia 3–4 por semana pelo site. Hoje recebo mais de 15. E vejo pacientes que vieram de outras cidades porque encontraram a clínica no Google. O investimento se pagou no primeiro mês.',
      autor: 'Equipe Clínica Pinheiro',
      cargo: 'Clínica Médica — Bom Jesus, PI',
    },
    antes: [
      '3–4 agendamentos/semana pelo site',
      'Invisível no Google para as principais especialidades',
      'Site lento e quebrado no celular',
      'Formulário de agendamento não funcionava no mobile',
    ],
    depois: [
      '15+ agendamentos/semana pelo site',
      '1ª página do Google para 8 palavras-chave',
      'Carrega em menos de 1 segundo em qualquer celular',
      'Agendamento e WhatsApp funcionando em todas as páginas',
    ],
    cor: '#f0d060',
  },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
