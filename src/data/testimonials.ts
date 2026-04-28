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
      'Em dois meses após a reforma do site, meus agendamentos online triplicaram. Antes recebia 3–4 por semana. Hoje recebo mais de 15 — e alguns vieram de cidades vizinhas porque me encontraram no Google. O investimento se pagou no primeiro mês.',
    autor: 'Equipe Clínica Pinheiro',
    cargo: 'Gestão',
    empresa: 'Clínica Pinheiro',
    cidade: 'Bom Jesus, PI',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'CP',
  },
  {
    id: '2',
    texto:
      'Nossa equipe vendia só por telefone há 12 anos. Com o site novo, em menos de dois meses começamos a receber pedidos de distribuidores que nunca tínhamos contatado. O formulário de parceria virou nosso melhor vendedor.',
    autor: 'Equipe Fiel Alimentos',
    cargo: 'Gestão Comercial',
    empresa: 'Fiel Alimentos',
    cidade: 'Corrente, PI',
    servico: 'Site Novo Premium',
    estrelas: 5,
    iniciais: 'FA',
  },
  {
    id: '3',
    texto:
      'Antes do site, pacientes de cidades vizinhas não sabiam que oferecemos Cardiologia e Neurologia aqui em Corrente. Com o site novo, toda semana chegam pacientes que disseram ter encontrado a clínica pelo Google. Valeu cada centavo.',
    autor: 'Equipe EmCORR',
    cargo: 'Gestão',
    empresa: 'EmCORR Centro Clínico',
    cidade: 'Corrente, PI',
    servico: 'Site Novo Premium',
    estrelas: 5,
    iniciais: 'EC',
  },
  {
    id: '4',
    texto:
      'Achei que ia demorar meses. Ficou pronto em 12 dias. E o mais importante: meus clientes começaram a comentar sobre o site sem eu nem ter pedido a opinião deles. "Achei vocês no Google" virou frase comum no balcão.',
    autor: 'Cliente Sites Especiais',
    cargo: 'Empresário',
    empresa: 'Comércio local — PI',
    cidade: 'Teresina, PI',
    servico: 'Reforma de Site',
    estrelas: 5,
    iniciais: 'CL',
  },
  {
    id: '5',
    texto:
      'Eu duvidava que um site pudesse fazer diferença pra um negócio pequeno como o meu. Em menos de 2 meses, tive clientes novos chegando dizendo que me encontraram no Google. Nunca tinha acontecido isso em 8 anos de empresa.',
    autor: 'Cliente Sites Especiais',
    cargo: 'Empreendedora',
    empresa: 'Serviços — Interior do PI',
    cidade: 'Piauí',
    servico: 'Site Novo Premium',
    estrelas: 5,
    iniciais: 'CL',
  },
];
