# CLAUDE.md — Sites Especiais

> Contexto obrigatório para toda sessão. Leia antes de qualquer ação.

---

## Projeto

**Produto:** `sitesespeciais.com.br` — agência de reforma de sites e criação de sites premium para empresas locais e regionais brasileiras.

**Repositório:** `https://github.com/haniellevi/sitesespeciais`
**Deploy:** Vercel (produção) → `sitesespeciais.com.br`
**Pasta local:** `C:\Users\hanie\OneDrive\Documentos\WORKSPACE\Sites\sitesespeciais`

---

## Stack

```
Astro 6.1        output: 'static', adapter @astrojs/vercel@^10
Tailwind CSS 4   via PostCSS (postcss.config.mjs + @tailwindcss/postcss)
                 ⚠️ NÃO usar @tailwindcss/vite — bug com Vite 8 rolldown
GSAP 3 + Lenis   animações premium + smooth scroll
Fontsource       DM Sans, Space Grotesk, Playfair Display, Instrument Serif
Hygraph          CMS GraphQL (project ID: d5058410389a498194cbbcc443fe0b33)
Resend           email transacional + entrega de PDF
Cal.com          agendamento → https://cal.com/raniellevi/30min
```

### Variáveis de ambiente (`.env.local`, nunca comitar)
```
HYGRAPH_ENDPOINT=        # copiar de Hygraph Settings → API Access → Content API (CDN)
HYGRAPH_TOKEN=           # token de leitura pública
RESEND_API_KEY=          # ver .env.local existente
SITE_URL=https://sitesespeciais.com.br
```

---

## Design System — Luxota UI

Dark premium. Nunca alterar a paleta ou remover os efeitos.

```css
--background: #080808;
--foreground: #f5f5f0;
--card: #141414;
--border: #222222;
--primary: #e8c547;          /* dourado */
--accent-hover: #f0d060;
--luxota-accent: #4FD1C5;    /* mint/cyan */
--luxota-bg: #0B0E14;
--luxota-card: #161B27;
--luxota-border: rgba(79,209,197,0.12);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-expo: cubic-bezier(0.19, 1, 0.22, 1);
```

**Efeitos obrigatórios:** ambient blobs, spotlight cards (mouse tracking), perspective grid, custom cursor (desktop), Lenis smooth scroll, reveal animation (blur+scale), text-gradient shimmer.

**Fontes:**
- `Playfair Display` / `Instrument Serif` — headings display
- `DM Sans` — corpo de texto
- `Space Grotesk` — números, badges, mono

---

## Regras de Copy — NUNCA violar

### Palavras banidas em copy público
❌ stack, framework, tecnologia, plataforma, performance, arquitetura, infraestrutura
❌ Astro, Vercel, Hygraph, Next.js, GraphQL, CDN, edge, SSR
❌ "tecnologia de ponta", "última geração", "mais avançada"
❌ "usamos IA para criar seu site"
❌ template, robusto, escalável, alavancar, sinergia, disruptivo

### Tabela de tradução obrigatória

| Tech | Empresário |
|---|---|
| Stack moderna | Site que abre antes do cliente perder a paciência |
| Performance superior | Mais rápido que o app do banco no celular |
| Core Web Vitals | Carrega em menos de 1 segundo no 4G ruim |
| SEO técnico | O Google entende seu site na primeira vez |
| Mobile-first | Funciona no celular — onde 7 em cada 10 clientes te encontram |
| Headless CMS | Você atualiza textos sem chamar programador |
| Animações premium | Aquela sensação de estar no site da Apple, mas é o seu |

### Teste da mãe
> "Minha mãe entenderia essa frase em 3 segundos?"
> Se não → reescreve.

### FAQ obrigatório sobre IA
> **"Vocês usam IA?"** → *"Usamos as ferramentas mais avançadas que existem — incluindo as da era da IA. Mas não é a IA que faz o site. É gente especialista usando ferramentas certas, como pedreiro com britadeira: a obra fica boa nos dois casos, mas com a ferramenta certa fica pronta antes."*

### Tom e voz
- Arquétipo: **Rebelde + Autoridade**
- 9/10 ousado, 2/10 sério, 8/10 linguagem simples
- Confrontacional empático: nomeia a dor sem rodeios, oferece saída com autoridade
- Tagline: **"Feito para Gerar Autoridade"**

### Os 3 raciocínios que martelamos
1. **Custo silencioso da inação** — cada visita que não converte = dinheiro perdido. Sempre quantificar.
2. **Site antigo = filtro que afasta clientes premium** — quem paga mais é exatamente quem exige qualidade e vai embora primeiro.
3. **A internet de 2026 mudou** — pesquisa no Google E no ChatGPT/Gemini/Perplexity. Sites antigos são invisíveis para as IAs.

---

## Preços (confirmados)
- **Reforma de site:** a partir de R$ 1.997
- **Site novo premium:** a partir de R$ 2.997
- Parcelamento 10x no cartão, garantia incondicional 7 dias, suporte 90 dias

---

## Status dos Sprints

| Sprint | Status | Entregável |
|---|---|---|
| Sprint 0 | ✅ | Setup Astro + Tailwind + Luxota + git init + push |
| Sprint 1 | ✅ | Componentes: Navbar, Footer, SpotlightCard, Layout, global.css |
| **Sprint 2** | 🔜 **PRÓXIMO** | Home completa — 11 seções |
| Sprint 3 | ⏳ | Hygraph queries + Cases + Blog + Testimonials |
| Sprint 4 | ⏳ | Lead magnets: /calculadora + /checklist + Resend |
| Sprint 5 | ⏳ | Páginas: /reforma, /site-novo, /precos, /garantia, /processo |
| Sprint 6 | ⏳ | Verticais: /clinicas, /advocacia, /imobiliarias |
| Sprint 7 | ⏳ | Páginas /vs/: upsites, wix, freelancer |
| Sprint 8 | ⏳ | /sobre, /contato, /diagnostico, /obrigado |
| Sprint 9 | ⏳ | SEO técnico completo |
| Sprint 10 | ⏳ | Conteúdo Hygraph: 3 cases + 5 depoimentos + 3 posts |
| Sprint 11 | ⏳ | Deploy Vercel + DNS + redirects 301 |

---

## Sprint 2 — Home completa (detalhe das seções)

Arquivo: `src/pages/index.astro`. Construir as 11 seções na ordem:

### S1 — Hero (já existe placeholder — REFINAR)
Badge de vagas → H1 Playfair grande → sub DM Sans → 2 CTAs → microprova estrelas

### S2 — Calculadora "Quanto seu site está te custando"
Componente interativo: inputs (setor, ticket médio, clientes/mês) → output dramatizado em R$.
CTA: "Receber o relatório completo no email" (captura lead).
Arquivo sugerido: `src/components/Calculadora.astro`

### S3 — Sintomas de site doente
6 spotlight cards, cada um = sintoma + consequência financeira:
1. Carrega devagar → abandona em 3s
2. Mais de 2 anos sem reforma → cliente acha que sumiu do mercado
3. Não aparece no Google → invisível pra quem quer comprar
4. Não funciona no celular → 60% das visitas vão embora
5. Sem WhatsApp/contato fácil → cada clique extra = cliente a menos
6. Não aparece no ChatGPT/Gemini → a nova internet te ignora

### S4 — Antes/Depois
Slider visual com 3 cases (Fiel Alimentos, EmCorr, Clínica Pinheiro).
Por ora: imagens placeholder + métricas hardcoded. Hygraph vem no Sprint 3.

### S5 — Como fazemos (4 passos)
Diagnóstico → Aprovação → Execução → No ar em 14 dias

### S6 — Por que nossos sites vendem mais
3 spotlight cards: Velocidade / Aparece no Google e no ChatGPT / Design que passa confiança

### S7 — Âncora de preço
2 cards: Reforma (R$ 1.997) vs Site Novo (R$ 2.997) + bullet com parcelamento + garantia

### S8 — Depoimentos
3-5 depoimentos sintetizados (reais pendentes). Placeholder até coleta.

### S9 — Garantia
Card dourado grande: garantia incondicional 7 dias — texto direto, sem rodapé de advogado.

### S10 — FAQ
8 perguntas + respostas. Inclui a do FAQ de IA obrigatório. Schema FAQPage em JSON-LD.

### S11 — CTA final
Headline urgente → badge de vagas → botão dourado grande

---

## Componentes existentes

```
src/
├── components/
│   ├── Navbar.astro        links + CTA + hamburger mobile
│   ├── Footer.astro        4 colunas + tagline + WhatsApp + Cal.com
│   └── SpotlightCard.astro wrapper com mouse tracking CSS vars
├── layouts/
│   └── Layout.astro        SEO, Lenis, cursor, Schema.org, reveals
├── styles/
│   └── global.css          design tokens Luxota + todas classes CSS
└── pages/
    └── index.astro         hero placeholder (Sprint 2 expande)
```

---

## Sitemap completo (referência)
```
/                    Home
/reforma             LP Reforma
/site-novo           LP Site Novo
/diagnostico         Form + Cal.com
/calculadora         Lead magnet interativo
/checklist           Lead magnet PDF
/cases               Portfólio
/cases/[slug]        Case detalhado
/verticais/clinicas
/verticais/advocacia
/verticais/imobiliarias
/vs/upsites
/vs/wix
/vs/freelancer-wordpress
/blog
/blog/[slug]
/sobre
/processo
/garantia
/precos
/contato
/obrigado
```

---

## Cases confirmados (reais)
- Fiel Alimentos
- EmCorr
- Clínica Pinheiro

Depoimentos: sintetizados por ora. Coleta dos 12+ clientes reais: pendente.

---

## Links importantes
- WhatsApp: `https://wa.me/5589994711318`
- Agendamento: `https://cal.com/raniellevi/30min`
- Diagnóstico: `https://sitesespeciais.com.br/diagnostico`
