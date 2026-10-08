# Etapas do projeto Jantar Resolvido

## Etapa 1 — Projeto base, design system, navegação e tela Hoje ✅
Projeto Vite + React + TypeScript + Tailwind. Design system com cores, fontes, componentes de vidro e formas orgânicas. Navegação inferior em pílula de vidro. Tela Hoje fiel à imagem de referência com 3 receitas de exemplo.

## Etapa 2 — Receita completa, ajuste de porções e passo a passo ✅
Tela de receita (`/receita/:id`) com foto, ingredientes agrupados, substituições e ajuste de porções que recalcula quantidades. Modo passo a passo (`/receita/:id/preparo`) com cronômetro, tela sempre acesa e tela final "Prato pronto".

## Etapa 3 — Calendário com troca de dias e listas de compras por semana ✅
Tela Calendário com grade de 30 dias, troca de dias (com desfazer), restaurar sequência original e ajuste de data de início. Tela Compras com listas por semana geradas das receitas, agrupadas por categoria, com marcação, compartilhamento e itens extras.

## Etapa 4 — Extras e tela Sobre ✅
Tela Extras com os 3 complementos: 15 Jantares Econômicos, 10 Jantares SOS, Guia Geladeira Pronta. Busca de substituições. Tela Sobre com avisos, backup/importação de progresso e informações do app.

## Etapa 5 — Conteúdo completo das receitas ✅
Todas as 55 receitas escritas: 30 principais (dias 1–30), 15 Econômicos e 10 SOS. Cada uma com ingredientes categorizados, 5–8 passos com timers, 2–4 substituições e tempos reais (≤20 min principais, ≤10 min SOS). Nomes de ingredientes padronizados para agregação na lista de compras.

## Etapa 6 — PWA, offline e testes ✅
Instalação como app com vite-plugin-pwa (manifest.webmanifest, ícones 192/512/maskable, service worker com precache de 13 assets e cache de Google Fonts). Funciona 100% offline após primeira abertura. 30 testes unitários com Vitest: cálculo do dia do plano, geração/agregação de listas de compras, agrupamento por categoria e escala de porções com frações. README com instruções de uso, build, deploy e edição de conteúdo.
