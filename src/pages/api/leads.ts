export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as {
      nome?: string;
      email?: string;
      whatsapp?: string;
      setor?: string;
      ticket?: string | number;
      visitas?: string | number;
      resultado?: string | number;
    };

    const { nome, email, whatsapp, setor, ticket, visitas, resultado } = body;

    if (!email || !nome) {
      return new Response(JSON.stringify({ error: 'Nome e e-mail são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY as string);

    // 1. Notifica o Raniel com os dados do lead
    await resend.emails.send({
      from: 'Sites Especiais <noreply@sitesespeciais.com.br>',
      to: 'pr.raniellevi@gmail.com',
      subject: `🔥 Novo lead calculadora: ${nome} (${setor ?? 'setor não informado'})`,
      html: `
        <h2 style="color:#e8c547;">Novo lead pela Calculadora</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:6px 12px;color:#888;">Nome</td><td style="padding:6px 12px;">${nome}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">E-mail</td><td style="padding:6px 12px;">${email}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">WhatsApp</td><td style="padding:6px 12px;">${whatsapp ?? '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">Setor</td><td style="padding:6px 12px;">${setor ?? '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">Ticket médio</td><td style="padding:6px 12px;">R$ ${ticket ?? '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">Visitas/mês</td><td style="padding:6px 12px;">${visitas ?? '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;font-weight:700;">Resultado calculado</td><td style="padding:6px 12px;font-weight:700;color:#e8c547;">R$ ${resultado ?? '—'}/mês</td></tr>
        </table>
        <p style="margin-top:16px;font-family:sans-serif;font-size:13px;color:#888;">
          Enviado via calculadora em sitesespeciais.com.br
        </p>
      `,
    });

    // 2. Entrega o "relatório" para o lead
    await resend.emails.send({
      from: 'Raniel · Sites Especiais <raniel@sitesespeciais.com.br>',
      to: email,
      replyTo: 'pr.raniellevi@gmail.com',
      subject: 'Seu relatório: quanto seu site está te custando',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#080808;color:#f5f5f0;">
          <div style="margin-bottom:24px;">
            <span style="font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#4FD1C5;">Sites Especiais</span>
          </div>

          <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#f5f5f0;">Olá, ${nome}!</h1>
          <p style="color:#b0b0a8;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Com base nos dados que você inseriu, calculamos que seu site está te custando
            aproximadamente <strong style="color:#f0d060;">R$ ${resultado}/mês</strong> em oportunidades não convertidas.
          </p>

          <div style="background:#141414;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:28px;">
            <p style="font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#4FD1C5;margin:0 0 8px;">Como calculamos</p>
            <p style="font-size:13px;color:#b0b0a8;line-height:1.6;margin:0;">
              Ticket médio R$ ${ticket} × ${visitas} visitas/mês × taxa média de abandono de 77% em sites que não convertem bem.
              É uma estimativa conservadora — na prática pode ser mais.
            </p>
          </div>

          <h2 style="font-size:17px;font-weight:700;color:#f5f5f0;margin:0 0 16px;">Os 3 ajustes que param o sangramento:</h2>

          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;">
            <div style="background:#141414;border:1px solid #222;border-radius:8px;padding:16px;">
              <p style="font-weight:700;color:#f5f5f0;margin:0 0 4px;">1. Velocidade</p>
              <p style="font-size:13px;color:#b0b0a8;margin:0;line-height:1.6;">Se o site demora mais de 2s no celular, 7 em 10 visitantes saem antes de ler qualquer coisa. Cada segundo a mais é dinheiro no ralo.</p>
            </div>
            <div style="background:#141414;border:1px solid #222;border-radius:8px;padding:16px;">
              <p style="font-weight:700;color:#f5f5f0;margin:0 0 4px;">2. Contato visível</p>
              <p style="font-size:13px;color:#b0b0a8;margin:0;line-height:1.6;">O WhatsApp precisa aparecer na primeira tela do celular — sem scroll. Se o cliente decidido precisa procurar seu contato, ele já foi para o concorrente.</p>
            </div>
            <div style="background:#141414;border:1px solid #222;border-radius:8px;padding:16px;">
              <p style="font-weight:700;color:#f5f5f0;margin:0 0 4px;">3. Google entende você</p>
              <p style="font-size:13px;color:#b0b0a8;margin:0;line-height:1.6;">Título, descrição e estrutura de página que o Google (e o ChatGPT) leem e entendem na primeira visita. Sem isso, você não aparece quando o cliente está procurando.</p>
            </div>
          </div>

          <a href="https://sitesespeciais.com.br/diagnostico"
             style="display:block;background:#f0d060;color:#080808;text-decoration:none;font-weight:700;font-size:15px;padding:16px 24px;border-radius:8px;text-align:center;margin-bottom:20px;">
            Agendar diagnóstico gratuito de 30 min →
          </a>

          <p style="font-size:12px;color:#555550;line-height:1.6;margin:0;">
            Você recebeu esse e-mail porque preencheu a calculadora em sitesespeciais.com.br.
            Dúvidas? Responde esse e-mail — você fala direto comigo.
            <br><br>
            — Raniel, Sites Especiais
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[/api/leads] erro:', err);
    return new Response(JSON.stringify({ error: 'Erro interno. Tente novamente.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
