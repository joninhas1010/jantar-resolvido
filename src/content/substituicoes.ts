import { Categoria, Substituicao } from '../types'
import { receitasPrincipais } from './receitas-principais'
import { receitasEconomicos } from './receitas-economicos'
import { receitasSOS } from './receitas-sos'

export type SubstituicaoGlobal = Substituicao & { categoria: Categoria }

const MAPA_CATEGORIA: Record<string, Categoria> = {
  'Peito de frango': 'Proteínas',
  'Sobrecoxa desossada em cubos': 'Proteínas',
  'Frango desfiado': 'Proteínas',
  'Frango desfiado já cozido': 'Proteínas',
  'Carne moída': 'Proteínas',
  'Presunto': 'Proteínas',
  'Peito de peru ou blanquet': 'Proteínas',
  'Ovo': 'Proteínas',
  'Atum em lata': 'Proteínas',
  'Pão de hambúrguer': 'Grãos e acompanhamentos',
  'Pão francês cortado ao meio': 'Grãos e acompanhamentos',
  'Pão de forma': 'Grãos e acompanhamentos',
  'Arroz arbóreo': 'Grãos e acompanhamentos',
  'Arroz comum': 'Grãos e acompanhamentos',
  'Macarrão espaguete': 'Grãos e acompanhamentos',
  'Batata': 'Legumes e verduras',
  'Batata-doce em palitos': 'Legumes e verduras',
  'Brócolis': 'Legumes e verduras',
  'Couve-flor': 'Legumes e verduras',
  'Abobrinha': 'Legumes e verduras',
  'Cenoura': 'Legumes e verduras',
  'Tomate': 'Legumes e verduras',
  'Pimentão': 'Legumes e verduras',
  'Ervilha': 'Legumes e verduras',
  'Cebola': 'Legumes e verduras',
  'Queijo muçarela': 'Outros',
  'Queijo prato': 'Outros',
  'Queijo parmesão': 'Outros',
  'Creme de leite': 'Outros',
  'Iogurte natural': 'Outros',
  'Cream cheese': 'Outros',
  'Requeijão': 'Outros',
  'Manteiga': 'Outros',
  'Molho de tomate': 'Outros',
  'Salsinha': 'Temperos',
  'Cebolinha': 'Temperos',
  'Manjericão': 'Temperos',
  'Orégano': 'Temperos',
}

function inferirCategoria(nome: string): Categoria {
  return MAPA_CATEGORIA[nome] || 'Outros'
}

function gerarSubstituicoesGlobais(): SubstituicaoGlobal[] {
  const todas = [...receitasPrincipais, ...receitasEconomicos, ...receitasSOS]
  const mapa = new Map<string, SubstituicaoGlobal>()

  for (const receita of todas) {
    for (const sub of receita.substituicoes) {
      const chave = `${sub.falta}|${sub.use}`
      if (!mapa.has(chave)) {
        mapa.set(chave, {
          ...sub,
          categoria: inferirCategoria(sub.falta),
        })
      }
    }
  }

  return Array.from(mapa.values())
}

export const substituicoesGlobais = gerarSubstituicoesGlobais()

export const SUBSTITUICOES_COMUNS: SubstituicaoGlobal[] = [
  { falta: 'Creme de leite', use: 'Iogurte natural ou requeijão', categoria: 'Outros' },
  { falta: 'Leite', use: 'Leite em pó diluído ou bebida vegetal', categoria: 'Outros' },
  { falta: 'Manteiga', use: 'Azeite ou óleo de coco', categoria: 'Outros' },
  { falta: 'Queijo parmesão', use: 'Cream cheese, requeijão ou queijo coalho ralado', categoria: 'Outros' },
  { falta: 'Peito de frango', use: 'Sobrecoxa desossada, frango desfiado ou peito de peru', categoria: 'Proteínas' },
  { falta: 'Carne moída', use: 'Carne de soja hidratada ou frango desfiado', categoria: 'Proteínas' },
  { falta: 'Peixe (tilápia)', use: 'Merluza, pescada ou filé de frango fino', categoria: 'Proteínas' },
  { falta: 'Brócolis', use: 'Couve-flor, vagem ou espinafre', categoria: 'Legumes e verduras' },
  { falta: 'Batata', use: 'Batata-doce, mandioquinha ou inhame', categoria: 'Legumes e verduras' },
  { falta: 'Tomate', use: 'Molho de tomate pronto ou pimentão', categoria: 'Legumes e verduras' },
  { falta: 'Arroz arbóreo', use: 'Arroz comum (fica menos cremoso, mas funciona)', categoria: 'Grãos e acompanhamentos' },
  { falta: 'Macarrão espaguete', use: 'Qualquer massa curta (penne, fusilli, parafuso)', categoria: 'Grãos e acompanhamentos' },
  { falta: 'Pão de hambúrguer', use: 'Pão francês ou pão de forma', categoria: 'Grãos e acompanhamentos' },
  { falta: 'Salsinha', use: 'Cebolinha, coentro ou manjericão', categoria: 'Temperos' },
  { falta: 'Alho fresco', use: 'Alho em pó (½ colher de chá por dente)', categoria: 'Temperos' },
]
