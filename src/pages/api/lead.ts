export const prerender = false;

import type { APIRoute } from 'astro';
import { emailRelatorioCalculadora, emailChecklist } from '../../lib/emails';

const RESEND_KEY = import.meta.env.RESEND_API_KEY as string;
const FROM = 'Sites Especiais <contato@sitesespeciais.com.br>';

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  return res.ok;
}

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  let body: Record<string, string>;
  try {
    body = await request.json() as Record<string, string>;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), { status: 400, headers });
  }

  const { tipo, email, nome = '', setor = '', ticket = '1500', visitas = '300' } = body;

  if (!tipo || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'Dados inválidos' }), { status: 422, headers });
  }

  try {
    if (tipo === 'calculadora') {
      const ticketN  = parseFloat(ticket)  || 1500;
      const visitasN = parseFloat(visitas) || 300;
      const perdaMensal     = (visitasN * 0.03 - visitasN * 0.005) * ticketN;
      const clientesPerdidos = visitasN * 0.03 - visitasN * 0.005;

      const { subject, html } = emailRelatorioCalculadora({
        nome, setor, ticket: ticketN, visitas: visitasN, perdaMensal, clientesPerdidos,
      });
      const ok = await sendEmail(email, subject, html);
      if (!ok) throw new Error('Resend error');

    } else if (tipo === 'checklist') {
      const { subject, html } = emailChecklist(nome);
      const ok = await sendEmail(email, subject, html);
      if (!ok) throw new Error('Resend error');

    } else {
      return new Response(JSON.stringify({ ok: false, error: 'Tipo desconhecido' }), { status: 422, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error('[lead API]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Falha ao enviar email' }), { status: 500, headers });
  }
};
