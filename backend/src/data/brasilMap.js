// =========================================================================
// 🗺️  MAPA DO BRASIL - TICKET TO RIDE
// =========================================================================
//
// ARQUIVO ÚNICO DE COORDENADAS - Fonte única de verdade para o jogo
// Editado por último em: [ADICIONE A DATA QUANDO AJUSTAR]
//
// =========================================================================
// COORDENADAS DAS CIDADES
// =========================================================================
// 
// SISTEMA DE COORDENADAS:
// - x: Posição horizontal (0 = esquerda, 100 = direita) em %
// - y: Posição vertical (0 = topo, 100 = base) em %
// - Coordenadas são RELATIVAS ao container .brasil-map (frontend)
// 
// 📐 COMO AJUSTAR MANUALMENTE (PASSO A PASSO):
// 
// 1. Inicie o servidor backend: cd backend && npm start
// 2. Inicie o frontend: cd frontend && npm run dev
// 3. Abra o jogo no navegador e crie uma partida
// 4. Compare as cidades com o mapa SVG de fundo
// 
// 5. Se uma cidade está desalinhada:
//    • Mover para DIREITA → aumentar x (ex: 50 → 55)
//    • Mover para ESQUERDA → diminuir x (ex: 50 → 45)
//    • Mover para BAIXO → aumentar y (ex: 30 → 35)
//    • Mover para CIMA → diminuir y (ex: 30 → 25)
// 
// 6. Salve este arquivo (Ctrl+S)
// 7. Recarregue o navegador (F5) para ver as mudanças
// 
// 💡 DICAS IMPORTANTES:
// - Ajuste em incrementos pequenos (1-5 unidades)
// - Use o mapa SVG como referência visual
// - As ROTAS se ajustam automaticamente - NÃO precisa alterá-las
// - Mantenha proporções geográficas reais do Brasil
// - Teste após cada ajuste para validar
// 
// 🎯 VALORES DE REFERÊNCIA:
// - Centro do Brasil (Brasília): x ≈ 50-52, y ≈ 45
// - Norte (Manaus, Belém): y ≈ 15-25
// - Sul (Porto Alegre): y ≈ 75-80
// - Nordeste (Fortaleza, Recife): x ≈ 68-75, y ≈ 22-35
// - Oeste (Rio Branco): x ≈ 10-15
// - Leste (Salvador, Rio): x ≈ 63-70
// =========================================================================

export const cities = [
  // REGIÃO NORTE
  { id: 'manaus', name: 'Manaus', x: 43.8, y: 25.5 },
  { id: 'belem', name: 'Belém', x: 52.0, y: 20.6 },
  { id: 'porto-velho', name: 'Porto Velho', x: 40.1, y: 38.9 },
  { id: 'rio-branco', name: 'Rio Branco', x: 35.9, y: 40.2 },
  { id: 'boa-vista', name: 'Boa Vista', x: 42.5, y: 20.0 },   
  { id: 'macapa', name: 'Macapá', x: 50.0, y: 19.0 },         
  { id: 'palmas', name: 'Palmas', x: 52.5, y: 47.0 },     


  // REGIÃO NORDESTE
  { id: 'fortaleza', name: 'Fortaleza', x: 60.3, y: 27.5 },
  { id: 'natal', name: 'Natal', x: 63.1, y: 31.2 },
  { id: 'recife', name: 'Recife', x: 62.9, y: 39.6 },
  { id: 'salvador', name: 'Salvador', x: 60.1, y: 48.0 },
  { id: 'sao-luis', name: 'São Luís', x: 56.0, y: 24.0 },     
  { id: 'teresina', name: 'Teresina', x: 57.5, y: 30.0 },     
  { id: 'joao-pessoa', name: 'João Pessoa', x: 63.8, y: 35.0 },
  { id: 'maceio', name: 'Maceió', x: 62.5, y: 42.0 }, 
  { id: 'aracaju', name: 'Aracaju', x: 61.3, y: 45.5 }, 

  // REGIÃO CENTRO-OESTE
  { id: 'cuiaba', name: 'Cuiabá', x: 47.3, y: 51.3 },
  { id: 'campo-grande', name: 'Campo Grande', x: 48.4, y: 63.8 },
  { id: 'goiania', name: 'Goiânia', x: 51.6, y: 56.8 },
  { id: 'brasilia', name: 'Brasília', x: 53.3, y: 53.2 },

  // REGIÃO SUDESTE
  { id: 'belo-horizonte', name: 'Belo Horizonte', x: 56.2, y: 64.3 },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', x: 58.1, y: 67.8 },
  { id: 'sao-paulo', name: 'São Paulo', x: 53.9, y: 70.4 },
  { id: 'vitoria', name: 'Vitória', x: 59.5, y: 65.0 },

  // REGIÃO SUL
  { id: 'curitiba', name: 'Curitiba', x: 52.7, y: 77.2 },
  { id: 'florianopolis', name: 'Florianópolis', x: 52.2, y: 83.2 },
  { id: 'porto-alegre', name: 'Porto Alegre', x: 50.6, y: 86.9 }
];



// =========================================================================
// ROTAS ENTRE CIDADES
// =========================================================================
// 
// As rotas são calculadas AUTOMATICAMENTE com base nas coordenadas das cidades.
// O sistema calcula:
// - Comprimento da linha: distância euclidiana entre city1 e city2
// - Ângulo de rotação: atan2(dy, dx) convertido para graus
// - Ponto inicial: coordenadas de city1
// 
// COMO AS ROTAS SÃO RENDERIZADAS:
// 1. Linha inicia na posição (x, y) de city1
// 2. Comprimento = sqrt((x2-x1)² + (y2-y1)²) em %
// 3. Rotação a partir do ponto inicial (transformOrigin: '0 50%')
// 4. Altura fixa de 8-10px (espessura da linha)
// 
// SE AS ROTAS ESTÃO DESALINHADAS:
// - Ajuste as coordenadas das CIDADES, não as rotas
// - As rotas se ajustarão automaticamente
// - Certifique-se que city1 e city2 estão corretos
// 
// PROPRIEDADES:
// - id: identificador único da rota
// - city1, city2: IDs das cidades conectadas
// - color: cor da rota (red, blue, green, yellow, black, white, orange, purple, gray)
// - length: número de vagões necessários para reivindicar
// =========================================================================

export const routes = [
  // Norte
  { id: 'r1', city1: 'manaus', city2: 'belem', color: 'green', length: 6 },
  { id: 'r2', city1: 'manaus', city2: 'porto-velho', color: 'orange', length: 5 },
  { id: 'r3', city1: 'porto-velho', city2: 'rio-branco', color: 'blue', length: 3 },
  { id: 'r4', city1: 'porto-velho', city2: 'cuiaba', color: 'yellow', length: 6 },
  { id: 'r5', city1: 'belem', city2: 'fortaleza', color: 'red', length: 5 },
  
  // Nordeste
  { id: 'r6', city1: 'fortaleza', city2: 'natal', color: 'purple', length: 3 },
  { id: 'r7', city1: 'natal', city2: 'recife', color: 'white', length: 2 },
  { id: 'r8', city1: 'recife', city2: 'salvador', color: 'orange', length: 4 },
  { id: 'r9', city1: 'fortaleza', city2: 'salvador', color: 'black', length: 5 },
  
  // Centro-Oeste
  { id: 'r10', city1: 'cuiaba', city2: 'goiania', color: 'red', length: 4 },
  { id: 'r11', city1: 'cuiaba', city2: 'campo-grande', color: 'white', length: 3 },
  { id: 'r12', city1: 'goiania', city2: 'brasilia', color: 'blue', length: 2 },
  { id: 'r13', city1: 'campo-grande', city2: 'goiania', color: 'purple', length: 3 },
  { id: 'r14', city1: 'brasilia', city2: 'salvador', color: 'green', length: 5 },
  
  // Sudeste
  { id: 'r15', city1: 'brasilia', city2: 'belo-horizonte', color: 'yellow', length: 4 },
  { id: 'r16', city1: 'goiania', city2: 'belo-horizonte', color: 'orange', length: 4 },
  { id: 'r17', city1: 'salvador', city2: 'belo-horizonte', color: 'red', length: 5 },
  { id: 'r18', city1: 'belo-horizonte', city2: 'rio-de-janeiro', color: 'black', length: 3 },
  { id: 'r19', city1: 'belo-horizonte', city2: 'sao-paulo', color: 'blue', length: 4 },
  { id: 'r20', city1: 'rio-de-janeiro', city2: 'sao-paulo', color: 'white', length: 2 },
  { id: 'r20b', city1: 'rio-de-janeiro', city2: 'sao-paulo', color: 'green', length: 2 }, // Rota dupla
  
  // Sul
  { id: 'r21', city1: 'sao-paulo', city2: 'curitiba', color: 'purple', length: 3 },
  { id: 'r22', city1: 'campo-grande', city2: 'curitiba', color: 'yellow', length: 5 },
  { id: 'r23', city1: 'curitiba', city2: 'florianopolis', color: 'red', length: 2 },
  { id: 'r24', city1: 'florianopolis', city2: 'porto-alegre', color: 'blue', length: 3 },
  { id: 'r25', city1: 'curitiba', city2: 'porto-alegre', color: 'orange', length: 4 }
];

// Bilhetes de destino (objetivos secretos)
export const destinationTickets = [
  // Longa distância (alto valor)
  { id: 't1', from: 'manaus', to: 'porto-alegre', points: 20 },
  { id: 't2', from: 'rio-branco', to: 'recife', points: 20 },
  { id: 't3', from: 'belem', to: 'sao-paulo', points: 17 },
  { id: 't4', from: 'fortaleza', to: 'curitiba', points: 16 },
  { id: 't5', from: 'manaus', to: 'rio-de-janeiro', points: 18 },
  
  // Média distância (valor médio)
  { id: 't6', from: 'brasilia', to: 'porto-alegre', points: 13 },
  { id: 't7', from: 'salvador', to: 'sao-paulo', points: 12 },
  { id: 't8', from: 'cuiaba', to: 'rio-de-janeiro', points: 14 },
  { id: 't9', from: 'belem', to: 'brasilia', points: 11 },
  { id: 't10', from: 'recife', to: 'belo-horizonte', points: 10 },
  { id: 't11', from: 'porto-velho', to: 'campo-grande', points: 11 },
  { id: 't12', from: 'fortaleza', to: 'belo-horizonte', points: 12 },
  
  // Curta distância (valor baixo)
  { id: 't13', from: 'sao-paulo', to: 'curitiba', points: 6 },
  { id: 't14', from: 'rio-de-janeiro', to: 'belo-horizonte', points: 7 },
  { id: 't15', from: 'brasilia', to: 'goiania', points: 5 },
  { id: 't16', from: 'curitiba', to: 'porto-alegre', points: 7 },
  { id: 't17', from: 'natal', to: 'recife', points: 5 },
  { id: 't18', from: 'florianopolis', to: 'porto-alegre', points: 6 },
  { id: 't19', from: 'goiania', to: 'campo-grande', points: 6 },
  { id: 't20', from: 'salvador', to: 'recife', points: 8 },
  
  // Rotas regionais
  { id: 't21', from: 'manaus', to: 'porto-velho', points: 8 },
  { id: 't22', from: 'cuiaba', to: 'brasilia', points: 9 },
  { id: 't23', from: 'belo-horizonte', to: 'sao-paulo', points: 7 },
  { id: 't24', from: 'fortaleza', to: 'salvador', points: 9 },
  { id: 't25', from: 'campo-grande', to: 'sao-paulo', points: 10 }
];

// Função auxiliar para encontrar uma cidade pelo ID
export function getCityById(cityId) {
  return cities.find(city => city.id === cityId);
}

// Função auxiliar para encontrar uma rota pelo ID
export function getRouteById(routeId) {
  return routes.find(route => route.id === routeId);
}

// Função auxiliar para verificar se duas cidades estão conectadas
export function areCitiesConnected(city1Id, city2Id) {
  return routes.some(route => 
    (route.city1 === city1Id && route.city2 === city2Id) ||
    (route.city2 === city1Id && route.city1 === city2Id)
  );
}

// Função auxiliar para obter todas as rotas conectadas a uma cidade
export function getRoutesForCity(cityId) {
  return routes.filter(route => 
    route.city1 === cityId || route.city2 === cityId
  );
}
