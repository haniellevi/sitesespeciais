// Templates de email transacional — Sites Especiais
// Enviados via Resend. Inline CSS obrigatório para compatibilidade.

const BASE_URL = 'https://sitesespeciais.com.br';

const containerStyle = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #080808;
  color: #f5f5f0;
`;

const headerStyle = `
  background: linear-gradient(135deg, #0B0E14 0%, #141414 100%);
  border-bottom: 1px solid #222;
  padding: 32px 40px;
  text-align: center;
`;

const bodyStyle = `padding: 40px;`;

const footerStyle = `
  padding: 24px 40px;
  border-top: 1px solid #222;
  text-align: center;
  font-size: 12px;
  color: #555550;
`;

const btnStyle = `
  display: inline-block;
  background: #e8c547;
  color: #080808;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 24px;
`;

const cardStyle = `
  background: #141414;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
`;

// ── Template: Relatório da Calculadora ──────────────

export function emailRelatorioCalculadora(params: {
  nome: string;
  setor: string;
  ticket: number;
  visitas: number;
  perdaMensal: number;
  clientesPerdidos: number;
}) {
  const { nome, setor, ticket, visitas, perdaMensal, clientesPerdidos } = params;
  const perdaAnual = perdaMensal * 12;

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return {
    subject: `${nome}, seu site está te custando ${fmt(perdaMensal)}/mês`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;">
<div style="${containerStyle}">

  <!-- Header -->
  <div style="${headerStyle}">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#4FD1C5;margin:0 0 8px;">Sites Especiais</p>
    <h1 style="font-size:22px;color:#f5f5f0;margin:0;font-weight:400;">Relatório de Custo Silencioso</h1>
  </div>

  <!-- Corpo -->
  <div style="${bodyStyle}">
    <p style="font-size:16px;color:#b0b0a8;margin:0 0 24px;">Olá${nome ? `, ${nome}` : ''}!</p>
    <p style="font-size:15px;color:#b0b0a8;line-height:1.7;margin:0 0 24px;">
      Calculamos o custo real do seu site atual com base nas informações que você forneceu.
      O número pode ser desconfortável — mas o primeiro passo é saber.
    </p>

    <!-- Número principal -->
    <div style="text-align:center;padding:32px;background:#0B0E14;border:1px solid #222;border-radius:12px;margin:0 0 24px;">
      <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#555550;margin:0 0 8px;">Seu site está te custando</p>
      <p style="font-size:48px;font-weight:700;color:#e53e3e;margin:0;line-height:1;font-family:monospace;">${fmt(perdaMensal)}</p>
      <p style="font-size:13px;color:#555550;margin:8px 0 0;">por mês — ou ${fmt(perdaAnual)} por ano</p>
    </div>

    <!-- Breakdown -->
    <div style="${cardStyle}">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#555550;margin:0 0 16px;">Como chegamos nesse número</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#b0b0a8;font-size:14px;">Setor</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#f5f5f0;font-size:14px;text-align:right;">${setor}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#b0b0a8;font-size:14px;">Ticket médio</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#f5f5f0;font-size:14px;text-align:right;">${fmt(ticket)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#b0b0a8;font-size:14px;">Visitas/mês</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#f5f5f0;font-size:14px;text-align:right;">${visitas.toLocaleString('pt-BR')}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#b0b0a8;font-size:14px;">Taxa atual (site antigo)</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#e53e3e;font-size:14px;text-align:right;">0,5%</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#b0b0a8;font-size:14px;">Taxa possível (site moderno)</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;color:#38a169;font-size:14px;text-align:right;">3%</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#f5f5f0;font-size:14px;font-weight:700;">Clientes perdidos por mês</td>
          <td style="padding:10px 0;color:#e53e3e;font-size:16px;font-weight:700;text-align:right;">${Math.round(clientesPerdidos)}</td>
        </tr>
      </table>
    </div>

    <!-- O que fazer -->
    <div style="${cardStyle}border-color:#e8c54740;background:linear-gradient(135deg,rgba(232,197,71,0.04) 0%,#141414 60%);">
      <p style="font-size:14px;font-weight:700;color:#e8c547;margin:0 0 12px;">O que você pode fazer agora</p>
      <p style="font-size:14px;color:#b0b0a8;line-height:1.7;margin:0 0 16px;">
        Um diagnóstico gratuito do seu site mostra exatamente o que está impedindo as conversões.
        Em 14 dias, seu site pode estar reformado e gerando clientes que antes iam embora.
      </p>
      <p style="font-size:14px;color:#b0b0a8;line-height:1.7;margin:0;">
        Reforma a partir de <strong style="color:#e8c547;">R$ 1.997</strong> —
        ou 10x de R$ 199,70. Com garantia incondicional de 7 dias.
      </p>
    </div>

    <div style="text-align:center;">
      <a href="${BASE_URL}/diagnostico" style="${btnStyle}">
        Quero o Diagnóstico Gratuito →
      </a>
    </div>

    <p style="font-size:13px;color:#555550;text-align:center;margin:20px 0 0;">
      Ou fale diretamente no <a href="https://wa.me/5589994711318" style="color:#4FD1C5;">WhatsApp</a>
    </p>
  </div>

  <!-- Footer -->
  <div style="${footerStyle}">
    <p style="margin:0 0 4px;"><strong style="color:#e8c547;">Sites Especiais</strong></p>
    <p style="margin:0 0 4px;">Feito para Gerar Autoridade</p>
    <p style="margin:0;">
      <a href="${BASE_URL}" style="color:#4FD1C5;text-decoration:none;">sitesespeciais.com.br</a>
    </p>
  </div>

</div>
</body>
</html>`,
  };
}

// ── Template: Checklist PDF ─────────────────────────

const checklistItems = [
  { num: '01', titulo: 'Carrega em menos de 3 segundos no celular', desc: 'Use Google PageSpeed para testar. Abaixo de 50 pontos = clientes saindo antes de ver seu conteúdo.' },
  { num: '02', titulo: 'Funciona perfeitamente no smartphone', desc: 'Abra no seu celular agora. Se texto está cortado ou botões pequenos demais, você está perdendo 70% das visitas.' },
  { num: '03', titulo: 'Tem botão de WhatsApp visível em todas as páginas', desc: 'O WhatsApp deve aparecer sem precisar rolar a página. Cada clique extra perde 20% dos interessados.' },
  { num: '04', titulo: 'Aparece no Google para buscas do seu setor + cidade', desc: 'Pesquise "[seu serviço] em [sua cidade]". Se não aparecer na primeira página, você é invisível para quem está comprando.' },
  { num: '05', titulo: 'Tem formulário de contato funcional', desc: 'Teste você mesmo: envie uma mensagem pelo formulário. Recebeu o email? O formulário é a porta de entrada de leads.' },
  { num: '06', titulo: 'Mostra endereço e telefone na página inicial', desc: 'Clientes locais precisam confirmar que você é real. Endereço e telefone visíveis aumentam a confiança imediatamente.' },
  { num: '07', titulo: 'Tem pelo menos 3 depoimentos reais de clientes', desc: 'Avaliações reais com nome e empresa valem mais que qualquer texto de marketing. São a prova social que fecha vendas.' },
  { num: '08', titulo: 'A última atualização tem menos de 6 meses', desc: 'Site sem novidades parece empresa fechada. O Google também penaliza sites que ficam parados por muito tempo.' },
  { num: '09', titulo: 'Tem fotos reais da equipe ou do espaço', desc: 'Stock photos genéricas tiram credibilidade. Uma foto real sua ou do seu negócio vale 10x mais.' },
  { num: '10', titulo: 'Aparece quando pesquisado no ChatGPT ou Gemini', desc: 'Pergunte "melhor [seu serviço] em [sua cidade]" no ChatGPT. Se não aparecer, você é invisível para a nova internet.' },
];

export function emailChecklist(nome: string) {
  const itensHTML = checklistItems
    .map(
      (item) => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #222;vertical-align:top;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="width:36px;vertical-align:top;padding-top:2px;">
              <div style="width:28px;height:28px;background:#141414;border:1px solid #222;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:monospace;color:#555550;text-align:center;line-height:28px;">${item.num}</div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="font-size:14px;font-weight:700;color:#f5f5f0;margin:0 0 4px;">${item.titulo}</p>
              <p style="font-size:13px;color:#b0b0a8;line-height:1.6;margin:0;">${item.desc}</p>
            </td>
            <td style="width:28px;vertical-align:top;text-align:right;">
              <div style="width:20px;height:20px;border:2px solid #333;border-radius:4px;margin-left:auto;"></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join('');

  return {
    subject: `${nome ? nome + ', o ' : 'O '}checklist que revela por que seu site não vende`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;">
<div style="${containerStyle}">

  <!-- Header -->
  <div style="${headerStyle}">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#4FD1C5;margin:0 0 8px;">Sites Especiais — Lead Magnet</p>
    <h1 style="font-size:22px;color:#f5f5f0;margin:0 0 8px;font-weight:400;">10 Sinais que Seu Site<br>Está Perdendo Clientes</h1>
    <p style="font-size:13px;color:#555550;margin:0;">Checklist para empresas locais</p>
  </div>

  <!-- Corpo -->
  <div style="${bodyStyle}">
    <p style="font-size:15px;color:#b0b0a8;line-height:1.7;margin:0 0 8px;">
      Olá${nome ? `, ${nome}` : ''}!
    </p>
    <p style="font-size:15px;color:#b0b0a8;line-height:1.7;margin:0 0 28px;">
      Aqui está o checklist que você pediu. Para cada item marcado como <strong style="color:#e53e3e;">NÃO</strong>,
      seu site está perdendo clientes agora — sem você saber.
    </p>

    <!-- Checklist -->
    <div style="${cardStyle}">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#4FD1C5;margin:0 0 4px;">Checklist completo</p>
      <p style="font-size:20px;color:#f5f5f0;font-weight:400;margin:0 0 20px;">10 Sinais de Site Saudável</p>
      <table style="width:100%;border-collapse:collapse;">
        ${itensHTML}
      </table>
    </div>

    <!-- Score -->
    <div style="text-align:center;padding:24px;background:#0B0E14;border:1px solid #222;border-radius:12px;margin:24px 0;">
      <p style="font-size:14px;color:#b0b0a8;margin:0 0 8px;">Quantos itens você marcou?</p>
      <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin:0 0 16px;">
        <div style="text-align:center;">
          <p style="font-size:22px;font-weight:700;color:#38a169;margin:0;font-family:monospace;">8–10</p>
          <p style="font-size:11px;color:#555550;margin:4px 0 0;">Site saudável</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:22px;font-weight:700;color:#d69e2e;margin:0;font-family:monospace;">5–7</p>
          <p style="font-size:11px;color:#555550;margin:4px 0 0;">Precisa de atenção</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:22px;font-weight:700;color:#e53e3e;margin:0;font-family:monospace;">0–4</p>
          <p style="font-size:11px;color:#555550;margin:4px 0 0;">Urgente reformar</p>
        </div>
      </div>
      <p style="font-size:13px;color:#555550;margin:0;">
        Cada item que falta = dinheiro que vai embora todo mês.
      </p>
    </div>

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,rgba(232,197,71,0.05) 0%,#141414 60%);border:1px solid rgba(232,197,71,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:15px;font-weight:700;color:#e8c547;margin:0 0 10px;">Próximo passo</p>
      <p style="font-size:14px;color:#b0b0a8;line-height:1.7;margin:0 0 16px;">
        O diagnóstico gratuito analisa cada um desses pontos no seu site específico e mostra
        exatamente o que corrigir primeiro. Em 14 dias, seu site pode estar convertendo 3x mais.
      </p>
      <p style="font-size:14px;color:#b0b0a8;margin:0;">
        Reforma a partir de <strong style="color:#e8c547;">R$ 1.997</strong> com
        garantia incondicional de 7 dias.
      </p>
    </div>

    <div style="text-align:center;">
      <a href="${BASE_URL}/diagnostico" style="${btnStyle}">
        Quero o Diagnóstico Gratuito →
      </a>
    </div>

    <p style="font-size:13px;color:#555550;text-align:center;margin:16px 0 0;">
      Fale no <a href="https://wa.me/5589994711318" style="color:#4FD1C5;">WhatsApp</a> agora
    </p>
  </div>

  <!-- Footer -->
  <div style="${footerStyle}">
    <p style="margin:0 0 4px;"><strong style="color:#e8c547;">Sites Especiais</strong> — Feito para Gerar Autoridade</p>
    <p style="margin:0;">
      <a href="${BASE_URL}" style="color:#4FD1C5;text-decoration:none;">sitesespeciais.com.br</a>
      &nbsp;·&nbsp;
      <a href="https://wa.me/5589994711318" style="color:#4FD1C5;text-decoration:none;">WhatsApp</a>
    </p>
  </div>

</div>
</body>
</html>`,
  };
}
