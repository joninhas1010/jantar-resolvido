# Jantar Resolvido

30 jantares resolvidos para o seu mês. PWA instalável e offline-first com React + Vite + TypeScript + Tailwind CSS.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build para produção

```bash
npm run build
npm run preview
```

O build gera em `dist/` um app estático com service worker para funcionamento 100% offline. Pode ser hospedado em qualquer servidor estático (Vercel, Netlify, GitHub Pages, etc).

## Testes

```bash
npm test
```

Testes unitários com Vitest para: cálculo do dia do plano, geração e agregação de listas de compras, agrupamento por categoria e escala de porções com formatação de frações.

## Como editar o conteúdo

As receitas ficam em `src/content/`:

- `receitas-principais.ts` — 30 receitas do plano (dias 1–30)
- `receitas-economicos.ts` — 15 jantares econômicos
- `receitas-sos.ts` — 10 jantares SOS (≤10 min)
- `guia-geladeira.ts` — guia de organização da geladeira
- `substituicoes.ts` — lista consolidada de substituições

Cada receita segue o tipo `Receita` definido em `src/types.ts`. Para manter a lista de compras consistente, use nomes de ingredientes padronizados (ex: sempre "Peito de frango", nunca "Frango" ou "Filé de frango" em outra receita principal).

## Configuração

Edite `src/config.ts` para alterar: nome do app, versão, preço, contato de suporte e URL da página de vendas.

## Stack

- React 18 + TypeScript
- Vite 6 com vite-plugin-pwa
- Tailwind CSS 3
- Vitest para testes
- 100% client-side, sem backend, dados em localStorage
