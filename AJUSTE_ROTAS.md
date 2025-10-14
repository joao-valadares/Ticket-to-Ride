# 🗺️ ESTRUTURA E AJUSTE DAS ROTAS - TICKET TO RIDE BRASIL

## 📍 POSICIONAMENTO DAS CIDADES

As cidades são posicionadas usando coordenadas **percentuais (x, y)** no mapa:
- **x**: Posição horizontal (0% = esquerda, 100% = direita)
- **y**: Posição vertical (0% = topo, 100% = base)

### **Arquivo:** `backend/src/data/brasilMap.js`

```javascript
export const cities = [
  { id: 'manaus', name: 'Manaus', x: 25, y: 20 },
  // id: identificador único
  // name: nome exibido
  // x: posição horizontal (%)
  // y: posição vertical (%)
];
```

---

## 🎨 MAPA ATUAL - POSIÇÕES DAS CIDADES

### **REGIÃO NORTE** (topo do mapa)

| Cidade | ID | X | Y | Localização Visual |
|--------|----|----|---|--------------------|
| Rio Branco | rio-branco | 10% | 35% | Extremo oeste |
| Porto Velho | porto-velho | 20% | 32% | Oeste-centro |
| Manaus | manaus | 25% | 20% | Norte-oeste |
| Belém | belem | 48% | 18% | Norte-leste |

---

### **REGIÃO NORDESTE** (lado direito/leste)

| Cidade | ID | X | Y | Localização Visual |
|--------|----|----|---|--------------------|
| Fortaleza | fortaleza | 68% | 22% | Nordeste |
| Natal | natal | 73% | 26% | Leste (litoral) |
| Recife | recife | 72% | 32% | Leste (litoral) |
| Salvador | salvador | 67% | 42% | Leste-centro |

---

### **REGIÃO CENTRO-OESTE** (centro do mapa)

| Cidade | ID | X | Y | Localização Visual |
|--------|----|----|---|--------------------|
| Cuiabá | cuiaba | 35% | 45% | Centro-oeste |
| Campo Grande | campo-grande | 40% | 55% | Centro-sul |
| Goiânia | goiania | 48% | 48% | Centro |
| Brasília | brasilia | 52% | 45% | Centro |

---

### **REGIÃO SUDESTE** (centro-leste)

| Cidade | ID | X | Y | Localização Visual |
|--------|----|----|---|--------------------|
| Belo Horizonte | belo-horizonte | 60% | 52% | Centro-leste |
| Rio de Janeiro | rio-de-janeiro | 63% | 58% | Leste (litoral) |
| São Paulo | sao-paulo | 54% | 59% | Centro-sul |

---

### **REGIÃO SUL** (base do mapa)

| Cidade | ID | X | Y | Localização Visual |
|--------|----|----|---|--------------------|
| Curitiba | curitiba | 52% | 66% | Sul-centro |
| Florianópolis | florianopolis | 54% | 72% | Sul (litoral) |
| Porto Alegre | porto-alegre | 48% | 78% | Extremo sul |

---

## 🛤️ ESTRUTURA DAS ROTAS

### **Arquivo:** `backend/src/data/brasilMap.js`

```javascript
export const routes = [
  { 
    id: 'r1',                    // ID único da rota
    city1: 'manaus',             // Cidade de origem
    city2: 'belem',              // Cidade de destino
    color: 'green',              // Cor da rota
    length: 6                    // Número de peças necessárias
  },
];
```

---

## 🎨 CORES DISPONÍVEIS

| Cor | Código CSS | Uso |
|-----|-----------|-----|
| `red` | #e74c3c | Rotas vermelhas |
| `blue` | #3498db | Rotas azuis |
| `green` | #2ecc71 | Rotas verdes |
| `yellow` | #f1c40f | Rotas amarelas |
| `black` | #2c3e50 | Rotas pretas |
| `white` | #ecf0f1 | Rotas brancas |
| `orange` | #e67e22 | Rotas laranjas |
| `purple` | #9b59b6 | Rotas roxas |
| `gray` | #95a5a6 | Rotas cinzas (qualquer cor) |

---

## 📐 COMO AS ROTAS SÃO DESENHADAS

### **Cálculo Automático**

O sistema **calcula automaticamente** a posição e rotação das rotas baseado nas coordenadas das cidades:

```javascript
// frontend/src/components/GameBoard.jsx

const getRouteStyle = (route) => {
  const city1 = cities.find(c => c.id === route.city1);
  const city2 = cities.find(c => c.id === route.city2);
  
  // Calcula distância
  const distance = Math.sqrt(
    Math.pow(city2.x - city1.x, 2) + 
    Math.pow(city2.y - city1.y, 2)
  );
  
  // Calcula ângulo
  const angle = Math.atan2(city2.y - city1.y, city2.x - city1.x) * 180 / Math.PI;
  
  // Define posição e rotação
  return {
    left: `${city1.x}%`,
    top: `${city1.y}%`,
    width: `${distance}%`,
    transform: `rotate(${angle}deg)`,
    backgroundColor: getColorCode(route.color),
  };
};
```

---

## ✏️ COMO AJUSTAR POSIÇÕES

### **1. Ajustar Posição de uma Cidade**

Edite o arquivo: `backend/src/data/brasilMap.js`

**Exemplo:** Mover São Paulo mais para a esquerda

```javascript
// ANTES
{ id: 'sao-paulo', name: 'São Paulo', x: 54, y: 59 }

// DEPOIS (moveu 5% para esquerda)
{ id: 'sao-paulo', name: 'São Paulo', x: 49, y: 59 }
```

**Dica:** Ajuste pequeno (±1-3%) para refinamento, ±5-10% para mudanças maiores

---

### **2. Adicionar Nova Cidade**

```javascript
export const cities = [
  // ... cidades existentes ...
  
  // NOVA CIDADE
  { 
    id: 'vitoria',           // ID único (minúsculas, sem acentos)
    name: 'Vitória',         // Nome exibido (pode ter acentos)
    x: 65,                   // Posição X (0-100%)
    y: 55                    // Posição Y (0-100%)
  }
];
```

---

### **3. Adicionar Nova Rota**

```javascript
export const routes = [
  // ... rotas existentes ...
  
  // NOVA ROTA
  { 
    id: 'r26',                        // ID único (próximo número)
    city1: 'vitoria',                 // Use o ID da cidade
    city2: 'rio-de-janeiro',          // Use o ID da cidade
    color: 'blue',                    // Cor da rota
    length: 3                         // Número de peças
  }
];
```

---

### **4. Modificar Rota Existente**

**Exemplo:** Mudar cor ou comprimento de uma rota

```javascript
// ANTES
{ id: 'r18', city1: 'belo-horizonte', city2: 'rio-de-janeiro', color: 'black', length: 3 }

// DEPOIS (mudou para azul e 4 peças)
{ id: 'r18', city1: 'belo-horizonte', city2: 'rio-de-janeiro', color: 'blue', length: 4 }
```

---

## 🎯 DICAS DE POSICIONAMENTO

### **Regra Geral:**

```
OESTE ←─────────── CENTRO ───────────→ LESTE
(x: 0-30%)      (x: 30-70%)        (x: 70-100%)

NORTE
(y: 0-30%)

CENTRO
(y: 30-70%)

SUL
(y: 70-100%)
```

---

### **Evite Sobreposição:**

❌ **PROBLEMA:**
```javascript
{ id: 'cidade1', name: 'Cidade 1', x: 50, y: 50 }
{ id: 'cidade2', name: 'Cidade 2', x: 50, y: 50 }
// Mesma posição = cidades sobrepostas!
```

✅ **SOLUÇÃO:**
```javascript
{ id: 'cidade1', name: 'Cidade 1', x: 50, y: 50 }
{ id: 'cidade2', name: 'Cidade 2', x: 55, y: 52 }
// Distância mínima de 5% entre cidades
```

---

### **Rotas Duplas (Paralelas):**

Para criar rotas duplas entre as mesmas cidades:

```javascript
// Rota 1
{ id: 'r20', city1: 'rio-de-janeiro', city2: 'sao-paulo', color: 'white', length: 4 }

// Rota 2 (paralela)
{ id: 'r21', city1: 'rio-de-janeiro', city2: 'sao-paulo', color: 'green', length: 4 }

// O sistema detecta automaticamente e desenha paralelas
```

---

## 🔧 FERRAMENTAS ÚTEIS

### **Teste Visual de Posições**

Para testar posições visualmente:

1. **Inicie o jogo**
2. **Abra o Console (F12)**
3. **Execute este código:**

```javascript
// Mostrar coordenadas ao clicar no mapa
document.querySelector('.brasil-map').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
  const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
  console.log(`x: ${x}%, y: ${y}%`);
});
```

Agora clique no mapa e veja as coordenadas no console!

---

## 📊 TODAS AS ROTAS ATUAIS

### **Rotas por Região:**

**NORTE (4 rotas):**
```javascript
r1: Manaus → Belém (🟢 verde, 6 peças)
r2: Manaus → Porto Velho (🟠 laranja, 5 peças)
r3: Porto Velho → Rio Branco (🔵 azul, 3 peças)
r4: Porto Velho → Cuiabá (🟡 amarelo, 6 peças)
r5: Belém → Fortaleza (🔴 vermelho, 5 peças)
```

**NORDESTE (4 rotas):**
```javascript
r6: Fortaleza → Natal (🟣 roxo, 3 peças)
r7: Natal → Recife (⚪ branco, 2 peças)
r8: Recife → Salvador (🟠 laranja, 4 peças)
r9: Fortaleza → Salvador (⚫ preto, 5 peças)
```

**CENTRO-OESTE (5 rotas):**
```javascript
r10: Cuiabá → Goiânia (🔴 vermelho, 4 peças)
r11: Cuiabá → Campo Grande (⚪ branco, 3 peças)
r12: Goiânia → Brasília (🔵 azul, 2 peças)
r13: Campo Grande → Goiânia (🟣 roxo, 3 peças)
r14: Brasília → Salvador (🟢 verde, 5 peças)
```

**SUDESTE (7 rotas):**
```javascript
r15: Brasília → Belo Horizonte (🟡 amarelo, 4 peças)
r16: Goiânia → Belo Horizonte (🟠 laranja, 4 peças)
r17: Salvador → Belo Horizonte (🔴 vermelho, 5 peças)
r18: Belo Horizonte → Rio de Janeiro (⚫ preto, 3 peças)
r19: Belo Horizonte → São Paulo (🔵 azul, 4 peças)
r20: Rio de Janeiro → São Paulo (⚪ branco, 4 peças) // DUPLA 1
r21: Rio de Janeiro → São Paulo (🟢 verde, 4 peças) // DUPLA 2
```

**SUL (5 rotas):**
```javascript
r22: São Paulo → Curitiba (🟣 roxo, 3 peças)
r23: Campo Grande → São Paulo (🟢 verde, 5 peças)
r24: Curitiba → Florianópolis (⚪ branco, 3 peças)
r25: Florianópolis → Porto Alegre (🔵 azul, 4 peças)
```

**TOTAL: 25 rotas**

---

## 🎨 PERSONALIZAÇÃO VISUAL

### **Arquivo:** `frontend/src/App.css`

#### **Estilo das Cidades:**

```css
.city {
  width: 28px;              /* Tamanho da cidade */
  height: 28px;
  background: radial-gradient(...);
  border: 4px solid white;  /* Borda */
  border-radius: 50%;       /* Circular */
}
```

**Para mudar o tamanho das cidades:**
```css
.city {
  width: 35px;   /* Maior */
  height: 35px;
}
```

---

#### **Estilo das Rotas:**

```css
.route {
  height: 10px;             /* Espessura da rota */
  border-radius: 5px;       /* Arredondamento */
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.route:hover {
  height: 16px;             /* Mais grossa ao passar mouse */
}
```

**Para rotas mais grossas:**
```css
.route {
  height: 14px;  /* Padrão mais grosso */
}
```

---

## 🔍 SOLUÇÃO DE PROBLEMAS

### **Problema 1: Cidade não aparece**

**Causa:** ID errado ou coordenadas fora do mapa (>100% ou <0%)

**Solução:**
```javascript
// Verifique:
{ id: 'cidade', name: 'Nome', x: 50, y: 50 }  // ✅ OK
{ id: 'cidade', name: 'Nome', x: 150, y: 50 } // ❌ X > 100%
{ id: 'cidade', name: 'Nome', x: -10, y: 50 } // ❌ X < 0%
```

---

### **Problema 2: Rota não conecta visualmente**

**Causa:** IDs das cidades não correspondem

**Solução:**
```javascript
// Rota
{ id: 'r1', city1: 'sao-paulo', city2: 'curitiba', ... }

// Cidades devem ter EXATAMENTE esses IDs:
{ id: 'sao-paulo', ... }  // ✅ Corresponde
{ id: 'curitiba', ... }   // ✅ Corresponde
{ id: 'Sao-Paulo', ... }  // ❌ Case-sensitive!
```

---

### **Problema 3: Rotas se cruzam demais**

**Solução:** Ajuste a posição das cidades para evitar cruzamentos:

```javascript
// ANTES (rotas cruzam muito)
{ id: 'cidade1', x: 40, y: 50 }
{ id: 'cidade2', x: 60, y: 50 } // Mesma linha Y

// DEPOIS (menos cruzamentos)
{ id: 'cidade1', x: 40, y: 48 }
{ id: 'cidade2', x: 60, y: 52 } // Y diferente
```

---

## 📝 CHECKLIST PARA ADICIONAR NOVA ROTA

- [ ] Ambas as cidades existem no array `cities`
- [ ] IDs das cidades estão corretos (case-sensitive)
- [ ] ID da rota é único (não repete outro)
- [ ] Cor é válida (red, blue, green, yellow, black, white, orange, purple, gray)
- [ ] Length é um número entre 1 e 8
- [ ] Testou no jogo e a rota aparece corretamente
- [ ] A pontuação é calculada corretamente

---

## 🎓 EXEMPLO COMPLETO: ADICIONAR NOVA CIDADE E ROTA

### **Passo 1:** Adicionar cidade

```javascript
// backend/src/data/brasilMap.js

export const cities = [
  // ... cidades existentes ...
  
  { id: 'campinas', name: 'Campinas', x: 52, y: 58 }
];
```

### **Passo 2:** Adicionar rotas conectando à nova cidade

```javascript
export const routes = [
  // ... rotas existentes ...
  
  // Campinas → São Paulo
  { id: 'r26', city1: 'campinas', city2: 'sao-paulo', color: 'red', length: 2 },
  
  // Campinas → Belo Horizonte
  { id: 'r27', city1: 'campinas', city2: 'belo-horizonte', color: 'yellow', length: 4 }
];
```

### **Passo 3:** Reiniciar o servidor backend

```bash
cd backend
npm start
```

### **Passo 4:** Testar no jogo

1. Crie um novo jogo
2. Verifique se a cidade "Campinas" aparece
3. Verifique se as rotas conectam corretamente
4. Teste reivindicar as rotas

---

## 🚀 PRÓXIMOS PASSOS

Agora você sabe como:
- ✅ Ajustar posições das cidades
- ✅ Adicionar novas cidades
- ✅ Criar novas rotas
- ✅ Modificar cores e comprimentos
- ✅ Personalizar o visual do mapa

**Divirta-se personalizando seu Ticket to Ride Brasil! 🎮🗺️**

---

*Para mais informações sobre as regras do jogo, consulte: `REGRAS_DO_JOGO.md`*
