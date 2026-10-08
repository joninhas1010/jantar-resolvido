export type SecaoGuia = {
  id: string
  titulo: string
  descricao: string
  itens: { id: string; texto: string; checkavel?: boolean }[]
}

export const guiaGeladeira: SecaoGuia[] = [
  {
    id: 'organizacao',
    titulo: 'Organização da geladeira',
    descricao: 'O que fica em cada lugar para durar mais e facilitar o dia a dia.',
    itens: [
      { id: 'org-1', texto: 'Prateleira de cima: alimentos prontos, sobras tampadas, iogurtes e frios.' },
      { id: 'org-2', texto: 'Prateleira do meio: ovos, leite, queijos e recipientes com alimentos em uso.' },
      { id: 'org-3', texto: 'Prateleira de baixo: carnes cruas e alimentos para descongelar (sempre em prato fundo para não pingar).' },
      { id: 'org-4', texto: 'Gaveta: frutas, verduras e legumes separados (frutas soltam gases que amadurecem verduras).' },
      { id: 'org-5', texto: 'Porta: molhos, condimentos, manteigas e bebidas. Nunca leite ou ovos na porta (a temperatura varia mais).' },
      { id: 'org-6', texto: 'Regra de ouro: o que vence primeiro fica na frente, o que chegou por último fica atrás.' },
    ],
  },
  {
    id: 'armazenamento',
    titulo: 'Armazenamento',
    descricao: 'Potes, porcionamento e congelamento seguros.',
    itens: [
      { id: 'arm-1', texto: 'Use potes herméticos transparentes para ver o conteúdo sem abrir.' },
      { id: 'arm-2', texto: 'Identifique cada pote com o nome do alimento e a data de preparo.' },
      { id: 'arm-3', texto: 'Alimentos cozidos duram até 3 dias na geladeira.' },
      { id: 'arm-4', texto: 'Congele porções individuais em potes rasos ou sacos zip achatados (descongelam mais rápido).' },
      { id: 'arm-5', texto: 'Descongele sempre na geladeira (de um dia para o outro) ou no micro-ondas. Nunca deixe descongelando na pia por horas.' },
      { id: 'arm-6', texto: 'Não recongele alimentos que já foram descongelados, a menos que tenha cozinhado antes.' },
    ],
  },
  {
    id: 'domingo-pronto',
    titulo: 'Preparos da semana ("Domingo pronto")',
    descricao: 'O que adiantar no fim de semana para a semana fluir.',
    itens: [
      { id: 'dom-1', texto: 'Cozinhe arroz e feijão e porcione em potes para a semana.', checkavel: true },
      { id: 'dom-2', texto: 'Lave, seque e guarde as verduras e legumes em potes com papel-toalha.', checkavel: true },
      { id: 'dom-3', texto: 'Corte legumes que vai usar nos primeiros dias (cenoura, cebola, pimentão).', checkavel: true },
      { id: 'dom-4', texto: 'Tempere as proteínas dos próximos 2-3 dias e refrigere em recipientes tampados.', checkavel: true },
      { id: 'dom-5', texto: 'Prepare um molho base (molho de tomate caseiro, por exemplo) e guarde na geladeira.', checkavel: true },
      { id: 'dom-6', texto: 'Porções de frango que vai usar depois do 3° dia: congele temperadas.', checkavel: true },
    ],
  },
  {
    id: 'sobras',
    titulo: 'Aproveitamento de sobras',
    descricao: 'Nada precisa ir para o lixo. Use a criatividade.',
    itens: [
      { id: 'sob-1', texto: 'Arroz de ontem vira arroz frito com ovo e legumes (ou o Bowl de arroz com sobras criativas, dia 30).' },
      { id: 'sob-2', texto: 'Frango desfiado que sobrou vira recheio de panqueca, wrap ou sanduíche.' },
      { id: 'sob-3', texto: 'Legumes cozidos podem virar sopa cremosa: bata tudo com caldo e temperos.' },
      { id: 'sob-4', texto: 'Macarrão que sobrou? Refogue na frigideira com azeite e ovo.' },
    ],
  },
  {
    id: 'checklist',
    titulo: 'Lista rápida "Geladeira pronta"',
    descricao: 'Confira toda semana se você tem esses itens básicos.',
    itens: [
      { id: 'chk-1', texto: 'Ovos (pelo menos 12)', checkavel: true },
      { id: 'chk-2', texto: 'Arroz cozido e porcionado', checkavel: true },
      { id: 'chk-3', texto: 'Feijão cozido e porcionado', checkavel: true },
      { id: 'chk-4', texto: 'Proteína da semana descongelada na geladeira', checkavel: true },
      { id: 'chk-5', texto: 'Legumes lavados e cortados (cenoura, cebola, alho)', checkavel: true },
      { id: 'chk-6', texto: 'Queijo e presunto/frios', checkavel: true },
      { id: 'chk-7', texto: 'Molho de tomate (caseiro ou pronto)', checkavel: true },
      { id: 'chk-8', texto: 'Manteiga ou azeite', checkavel: true },
      { id: 'chk-9', texto: 'Temperos frescos (alho, cebola, salsinha)', checkavel: true },
    ],
  },
]
