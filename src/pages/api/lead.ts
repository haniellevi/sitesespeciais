export const prerender = false;

import type { APIRoute } from 'astro';
import {
  emailRelatorioCalculadora,
  emailChecklist,
  emailDiagnosticoConfirmacao,
  emailDiagnosticoNotificacao,
} from '../../lib/emails';

const RESEND_KEY   = import.meta.env.RESEND_API_KEY as string;
const HUBSPOT_KEY  = import.meta.env.HUBSPOT_API_KEY as string | undefined;
const OWNER_EMAIL  = 'pr.raniellevi@gmail.com';
const FROM         = 'Sites Especiais <contato@sitesespeciais.com.br>';

// ── Resend helper ─────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
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

// Propriedades custom já criadas via scripts/hubspot-setup.mjs
const _hs_prop_ensured = true;

// ── HubSpot helper ────────────────────────────────────────
async function upsertHubSpotContact(params: {
  email: string;
  nome: string;
  whatsapp: string;
  setor?: string;
  problema?: string;
  temSite?: string;
  siteUrl?: string;
  fonte: string;
}): Promise<void> {
  if (!HUBSPOT_KEY) return;

  const { email, nome, whatsapp, setor, problema, siteUrl, fonte } = params;
  const [firstname, ...rest] = nome.trim().split(' ');
  const lastname = rest.join(' ');
  const temSite = params.temSite ?? '';

  // Propriedades padrão (sempre disponíveis)
  const baseProps: Record<string, string> = {
    email,
    firstname,
    lastname,
    phone: whatsapp,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    ...(siteUrl && { website: siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}` }),
  };

  // Propriedades customizadas (requerem crm.schemas.contacts.write)
  const customProps: Record<string, string> = {
    ...(_hs_prop_ensured && setor    ? { diagnostico_setor: setor }          : {}),
    ...(_hs_prop_ensured && problema ? { diagnostico_problema: problema }     : {}),
    ...(_hs_prop_ensured && temSite  ? { diagnostico_tem_site: temSite }      : {}),
    ...(_hs_prop_ensured && siteUrl  ? { diagnostico_url_site: siteUrl }      : {}),
    ...(_hs_prop_ensured             ? { lead_source: fonte }                 : {}),
  };

  const properties = { ...baseProps, ...customProps };

  const hsHeaders = {
    Authorization: `Bearer ${HUBSPOT_KEY}`,
    'Content-Type': 'application/json',
  };

  // Tenta criar; se duplicado (409) faz update pelo email
  const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: hsHeaders,
    body: JSON.stringify({ properties }),
  });

  if (createRes.status === 409) {
    // Lead já existe — faz PATCH pelo email
    await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      { method: 'PATCH', headers: hsHeaders, body: JSON.stringify({ properties }) },
    );
  } else if (!createRes.ok && createRes.status === 400) {
    // Alguma custom property não existe — tenta salvar só com base
    const fallbackRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: hsHeaders,
      body: JSON.stringify({ properties: baseProps }),
    });
    if (fallbackRes.status === 409) {
      await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        { method: 'PATCH', headers: hsHeaders, body: JSON.stringify({ properties: baseProps }) },
      );
    }
  }
}

// ── Main handler ──────────────────────────────────────────
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
    // ── Diagnóstico ───────────────────────────────────────
    if (tipo === 'diagnostico') {
      const { whatsapp = '', tem_site = 'nao', site_url, problema = '' } = body;

      if (!whatsapp || !problema) {
        return new Response(JSON.stringify({ ok: false, error: 'Dados incompletos' }), { status: 422, headers });
      }

      const diagParams = {
        nome,
        email,
        whatsapp,
        temSite: tem_site,
        siteUrl: site_url,
        setor,
        problema,
      };

      // Salva no HubSpot
      await upsertHubSpotContact({
        email,
        nome,
        whatsapp,
        setor,
        problema,
        temSite: tem_site,
        siteUrl: site_url,
        fonte: 'diagnostico_site',
      }).catch(console.error);

      // Email de confirmação ao lead
      const { subject: subjConf, html: htmlConf } = emailDiagnosticoConfirmacao(diagParams);
      await sendEmail(email, subjConf, htmlConf);

      // Email de notificação ao owner
      const { subject: subjNotif, html: htmlNotif } = emailDiagnosticoNotificacao(diagParams);
      await sendEmail(OWNER_EMAIL, subjNotif, htmlNotif);

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // ── Calculadora ───────────────────────────────────────
    if (tipo === 'calculadora') {
      const ticketN   = parseFloat(ticket)  || 1500;
      const visitasN  = parseFloat(visitas) || 300;
      const perdaMensal      = (visitasN * 0.03 - visitasN * 0.005) * ticketN;
      const clientesPerdidos = visitasN * 0.03 - visitasN * 0.005;

      const { subject, html } = emailRelatorioCalculadora({
        nome, setor, ticket: ticketN, visitas: visitasN, perdaMensal, clientesPerdidos,
      });
      const ok = await sendEmail(email, subject, html);
      if (!ok) throw new Error('Resend error');

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // ── Checklist ─────────────────────────────────────────
    if (tipo === 'checklist') {
      const { subject, html } = emailChecklist(nome);
      const ok = await sendEmail(email, subject, html);
      if (!ok) throw new Error('Resend error');

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Tipo desconhecido' }), { status: 422, headers });

  } catch (err) {
    console.error('[lead API]', err);
    return new Response(JSON.stringify({ ok: false, error: 'Erro interno' }), { status: 500, headers });
  }
};
