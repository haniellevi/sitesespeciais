import { cases as localCases, getCaseBySlug as getLocalCase, type Case, type CaseMetrica } from '../data/cases';
import { testimonials as localTestimonials, type Testimonial } from '../data/testimonials';
import {
  getAllCasesFromHygraph,
  getCaseFromHygraph,
  getAllTestimonialsFromHygraph,
  type HygraphCase,
  type HygraphTestimonial,
} from './hygraph';

function mapCase(h: HygraphCase): Case {
  return {
    slug: h.slug,
    nome: h.nome,
    setor: h.setor,
    cidade: h.cidade,
    servico: h.servico as 'reforma' | 'site-novo',
    resumo: h.resumo,
    desafio: h.desafio,
    solucao: h.solucao,
    resultado: h.resultado,
    metricas: h.metricas as CaseMetrica[],
    depoimento: h.depoimentoTexto
      ? { texto: h.depoimentoTexto, autor: h.depoimentoAutor ?? '', cargo: h.depoimentoCargo ?? '' }
      : undefined,
    antes: h.antes,
    depois: h.depois,
    cor: h.cor,
  };
}

function mapTestimonial(h: HygraphTestimonial): Testimonial {
  return {
    id: h.id,
    texto: h.texto,
    autor: h.autor,
    cargo: h.cargo,
    empresa: h.empresa,
    cidade: h.cidade,
    servico: h.servico,
    estrelas: 5,
    iniciais: h.iniciais,
  };
}

export async function getAllCases(): Promise<Case[]> {
  try {
    const data = await getAllCasesFromHygraph();
    if (data.length > 0) return data.map(mapCase);
  } catch {
    // Hygraph model not yet created or network error — use local data
  }
  return localCases;
}

export async function getCaseBySlug(slug: string): Promise<Case | undefined> {
  try {
    const data = await getCaseFromHygraph(slug);
    if (data) return mapCase(data);
  } catch {
    // Hygraph model not yet created or network error — use local data
  }
  return getLocalCase(slug);
}

export async function getAllCaseSlugs(): Promise<string[]> {
  const cases = await getAllCases();
  return cases.map((c) => c.slug);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await getAllTestimonialsFromHygraph();
    if (data.length > 0) return data.map(mapTestimonial);
  } catch {
    // Hygraph model not yet created or network error — use local data
  }
  return localTestimonials;
}

export type { Case, CaseMetrica, Testimonial };
