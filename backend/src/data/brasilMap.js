// Dados do mapa do Brasil - Cidades e suas coordenadas (x, y em percentual)
// Posições ajustadas para representar melhor a geografia real do Brasil
export const cities = [
  // REGIÃO NORTE
  { id: 'manaus', name: 'Manaus', x: 25, y: 20 },        // Amazonas - noroeste
  { id: 'belem', name: 'Belém', x: 48, y: 18 },          // Pará - norte/leste
  { id: 'porto-velho', name: 'Porto Velho', x: 20, y: 32 }, // Rondônia - oeste
  { id: 'rio-branco', name: 'Rio Branco', x: 10, y: 35 },   // Acre - extremo oeste
  
  // REGIÃO NORDESTE
  { id: 'fortaleza', name: 'Fortaleza', x: 68, y: 22 },  // Ceará - nordeste
  { id: 'natal', name: 'Natal', x: 73, y: 26 },          // Rio Grande do Norte
  { id: 'recife', name: 'Recife', x: 72, y: 32 },        // Pernambuco
  { id: 'salvador', name: 'Salvador', x: 67, y: 42 },    // Bahia - leste
  
  // REGIÃO CENTRO-OESTE
  { id: 'cuiaba', name: 'Cuiabá', x: 35, y: 45 },        // Mato Grosso - centro-oeste
  { id: 'campo-grande', name: 'Campo Grande', x: 40, y: 55 }, // Mato Grosso do Sul
  { id: 'goiania', name: 'Goiânia', x: 48, y: 48 },      // Goiás - centro
  { id: 'brasilia', name: 'Brasília', x: 52, y: 45 },    // Distrito Federal - centro
  
  // REGIÃO SUDESTE
  { id: 'belo-horizonte', name: 'Belo Horizonte', x: 60, y: 52 }, // Minas Gerais
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', x: 63, y: 58 }, // Rio de Janeiro - litoral
  { id: 'sao-paulo', name: 'São Paulo', x: 54, y: 59 },           // São Paulo
  
  // REGIÃO SUL
  { id: 'curitiba', name: 'Curitiba', x: 52, y: 66 },           // Paraná
  { id: 'florianopolis', name: 'Florianópolis', x: 54, y: 72 }, // Santa Catarina - litoral
  { id: 'porto-alegre', name: 'Porto Alegre', x: 48, y: 78 }    // Rio Grande do Sul - extremo sul
];

// Rotas entre cidades (conexões de trem)
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
