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
    setor: 'Distribuidora de Alimentos',
    cidade: 'Piauí',
    servico: 'reforma',
    resumo:
      'Distribuidora de 20 anos que vendia só por telefone. Com o site reformado, passou a receber pedidos online pela primeira vez.',
    desafio:
      'O site existia desde 2018 mas não funcionava no celular. Não tinha formulário de contato nem WhatsApp visível. O Google nem indexava as páginas. Os vendedores perdiam tempo atendendo clientes que chegavam sem informação básica sobre o portfólio.',
    solucao:
      'Reforma completa com foco em mobile e em captura de leads. Catálogo de produtos simplificado, formulário de pedido integrado ao WhatsApp, e otimização técnica completa para o Google entender o negócio.',
    resultado:
      'Em 45 dias o site apareceu na primeira página do Google para buscas do setor. Em 60 dias, a distribuidora recebeu os primeiros pedidos pelo site — algo que nunca tinha acontecido nos 20 anos de empresa.',
    metricas: [
      { valor: '+340%', label: 'mais visitas em 60 dias' },
      { valor: '12', label: 'novos pedidos/mês pelo site' },
      { valor: '45 dias', label: 'para aparecer no Google' },
      { valor: 'R$ 0', label: 'em anúncios pagos' },
    ],
    depoimento: {
      texto:
        'Nossa distribuidora vendia só pelo telefone há 20 anos. Com o site novo, em 45 dias recebemos os primeiros pedidos pelo formulário. Nunca aconteceu isso antes.',
      autor: 'Equipe Fiel Alimentos',
      cargo: 'Distribuidora — Piauí',
    },
    antes: [
      'Não abria corretamente no celular',
      'Sem formulário de contato',
      'Não aparecia no Google',
      'Carregava em mais de 6 segundos',
    ],
    depois: [
      'Mobile perfeito em qualquer dispositivo',
      'Formulário de pedido + WhatsApp integrado',
      '1ª página do Google em 45 dias',
      'Carrega em menos de 1 segundo',
    ],
    cor: '#e8c547',
  },
  {
    slug: 'emcorr-empreendimentos',
    nome: 'EmCorr Empreendimentos',
    setor: 'Imobiliária',
    cidade: 'Piauí',
    servico: 'site-novo',
    resumo:
      'Imobiliária com site genérico que gerava zero leads. Com o site novo, fechou 2 contratos no primeiro mês.',
    desafio:
      'O site era um template genérico que não transmitia credibilidade. Carregava em 8 segundos, não tinha identidade visual própria e nunca gerou um lead sequer. A equipe de corretores tinha vergonha de mostrar o site para clientes.',
    solucao:
      'Site novo do zero com identidade visual exclusiva para o mercado imobiliário local. Design premium com portfolio de imóveis, depoimentos e CTA direto para WhatsApp. Otimizado para aparecer em buscas de "imóveis em [cidade]".',
    resultado:
      'A equipe passou a enviar o link com orgulho nas propostas. Em 30 dias, dois contratos de venda foram fechados por clientes que chegaram pelo site — nenhum deles tinha sido indicado.',
    metricas: [
      { valor: '2', label: 'contratos fechados no 1º mês' },
      { valor: '10x', label: 'mais rápido que o site anterior' },
      { valor: '+180%', label: 'mais tempo de permanência' },
      { valor: '0 → 15', label: 'leads/mês gerados pelo site' },
    ],
    depoimento: {
      texto:
        'O site antigo era uma vergonha que eu não mostrava pra ninguém. Hoje envio o link com orgulho nas propostas. Fechei dois contratos maiores em um mês depois do lançamento.',
      autor: 'Equipe EmCorr',
      cargo: 'Imobiliária — Piauí',
    },
    antes: [
      'Visual desatualizado e genérico',
      'Zero leads gerados pelo site',
      'Carregava em mais de 8 segundos',
      'Nenhuma identidade visual própria',
    ],
    depois: [
      'Design exclusivo e profissional',
      '15+ leads/mês pelo site',
      'Carrega em menos de 1 segundo',
      'Identidade visual que transmite confiança',
    ],
    cor: '#4FD1C5',
  },
  {
    slug: 'clinica-pinheiro',
    nome: 'Clínica Pinheiro',
    setor: 'Clínica Médica',
    cidade: 'Teresina, PI',
    servico: 'reforma',
    resumo:
      'Clínica médica que recebia 3 agendamentos/semana pelo site. Após a reforma, passou para 15+ sem investir em anúncios.',
    desafio:
      'O site tinha layout dos anos 2010, não aparecia no Google para os principais serviços da clínica e o formulário de agendamento estava quebrado no celular. Os pacientes ligavam perguntando sobre serviços que estavam no site — prova de que ninguém o encontrava.',
    solucao:
      'Reforma focada em conversão: agendamento online simplificado, cada especialidade com sua própria seção otimizada para Google, design que transmite competência e cuidado. WhatsApp integrado em cada página para agendamento imediato.',
    resultado:
      'Em dois meses, os agendamentos online triplicaram. A clínica passou a aparecer na primeira página do Google para 8 palavras-chave relevantes, sem gastar um centavo em anúncios.',
    metricas: [
      { valor: '3x', label: 'mais agendamentos online' },
      { valor: '8', label: 'palavras-chave na 1ª página' },
      { valor: '1 mês', label: 'para pagar o investimento' },
      { valor: '0 reais', label: 'em anúncios pagos' },
    ],
    depoimento: {
      texto:
        'Em dois meses após o novo site, meus agendamentos online triplicaram. Antes eu recebia 3–4 por semana pelo site. Hoje recebo mais de 15. O investimento se pagou no primeiro mês.',
      autor: 'Dr. Carlos Pinheiro',
      cargo: 'Clínica Pinheiro — Teresina, PI',
    },
    antes: [
      '3–4 agendamentos/semana pelo site',
      'Invisível no Google',
      'Layout dos anos 2010',
      'Formulário quebrado no celular',
    ],
    depois: [
      '15+ agendamentos/semana',
      '1ª página para 8 palavras-chave',
      'Design que transmite confiança',
      'Agendamento funciona em qualquer celular',
    ],
    cor: '#e8c547',
  },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
