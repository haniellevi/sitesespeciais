export interface Testimonial {
  id: string;
  texto: string;
  autor: string;
  cargo: string;
  empresa: string;
  cidade: string;
  servico: string;
  estrelas: 5;
  iniciais: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    texto:
      'Em dois meses após o novo site, meus agendamentos online triplicaram. Antes eu recebia 3–4 por semana pelo site. Hoje recebo mais de 15. O investimento se pagou no primeiro mês.',
    autor: 'Dr. Carlos Pinheiro',
    cargo: 'Médico',
    empresa: 'Clínica Pinheiro',
    cidade: 'Teresina, PI',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'CP',
  },
  {
    id: '2',
    texto:
      'Nossa distribuidora vendia só pelo telefone há 20 anos. Com o site novo, em 45 dias recebemos os primeiros pedidos pelo formulário. Nunca aconteceu isso antes na história da empresa.',
    autor: 'Equipe Fiel Alimentos',
    cargo: 'Gestão',
    empresa: 'Fiel Alimentos',
    cidade: 'Piauí',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'FA',
  },
  {
    id: '3',
    texto:
      'O site antigo era uma vergonha que eu não mostrava pra ninguém. Hoje envio o link com orgulho nas propostas. Fechei dois contratos maiores em um mês depois do lançamento.',
    autor: 'Equipe EmCorr',
    cargo: 'Gestão',
    empresa: 'EmCorr Empreendimentos',
    cidade: 'Piauí',
    servico: 'Site Novo Premium',
    estrelas: 5,
    iniciais: 'EC',
  },
  {
    id: '4',
    texto:
      'Achei que ia demorar meses. Ficou pronto em 12 dias. E o mais importante: meus clientes começaram a comentar sobre o site sem eu nem ter pedido a opinião deles.',
    autor: 'Cliente Sites Especiais',
    cargo: 'Empresário',
    empresa: 'Serviços locais — PI',
    cidade: 'Piauí',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'CL',
  },
  {
    id: '5',
    texto:
      'Eu duvidava que um site pudesse fazer diferença pra um negócio pequeno como o meu. Mas em menos de 2 meses, tive clientes novos chegando dizendo que me encontraram no Google. Nunca tinha acontecido isso.',
    autor: 'Cliente Sites Especiais',
    cargo: 'Empreendedora',
    empresa: 'Comércio local — PI',
    cidade: 'Piauí',
    servico: 'Site Novo Premium',
    estrelas: 5,
    iniciais: 'CL',
  },
];
