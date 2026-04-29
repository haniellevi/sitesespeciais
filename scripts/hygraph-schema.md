# Hygraph Schema Setup — Sites Especiais

Modelos a criar em: https://app.hygraph.com → seu projeto → Schema → + Add Model

---

## Modelo 1: Case

**Display Name:** Case  
**API ID:** Case  
**API ID Plural:** Cases

### Campos:

| Display Name | API ID | Tipo | Obrigatório |
|---|---|---|---|
| Slug | slug | Single line text | ✅ |
| Nome | nome | Single line text | ✅ |
| Setor | setor | Single line text | ✅ |
| Cidade | cidade | Single line text | ✅ |
| Serviço | servico | Single line text | ✅ (valores: "reforma" ou "site-novo") |
| Resumo | resumo | Multi line text | ✅ |
| Desafio | desafio | Multi line text | ✅ |
| Solução | solucao | Multi line text | ✅ |
| Resultado | resultado | Multi line text | ✅ |
| Métricas | metricas | Component (ver abaixo) | ✅ (Allow multiple) |
| Depoimento Texto | depoimentoTexto | Multi line text | ❌ |
| Depoimento Autor | depoimentoAutor | Single line text | ❌ |
| Depoimento Cargo | depoimentoCargo | Single line text | ❌ |
| Antes | antes | Single line text | ✅ (Allow multiple) |
| Depois | depois | Single line text | ✅ (Allow multiple) |
| Cor | cor | Single line text | ✅ |
| Ordem | ordem | Integer | ✅ |

### Componente: Metrica

**Display Name:** Metrica  
**API ID:** Metrica

| Display Name | API ID | Tipo |
|---|---|---|
| Valor | valor | Single line text |
| Label | label | Single line text |

---

## Modelo 2: Testimonial

**Display Name:** Testimonial  
**API ID:** Testimonial  
**API ID Plural:** Testimonials

### Campos:

| Display Name | API ID | Tipo | Obrigatório |
|---|---|---|---|
| Texto | texto | Multi line text | ✅ |
| Autor | autor | Single line text | ✅ |
| Cargo | cargo | Single line text | ✅ |
| Empresa | empresa | Single line text | ✅ |
| Cidade | cidade | Single line text | ✅ |
| Serviço | servico | Single line text | ✅ |
| Estrelas | estrelas | Integer | ✅ (default: 5) |
| Iniciais | iniciais | Single line text | ✅ |
| Ordem | ordem | Integer | ✅ |

---

## Após criar os modelos, rode o seed:

```bash
HYGRAPH_ENDPOINT=<url_content_api> HYGRAPH_TOKEN=<token> node scripts/hygraph-seed.mjs
```

O token deve ser um "Permanent Auth Token" com role **Editor** criado em:
Settings → API Access → Permanent Auth Tokens → Add token
