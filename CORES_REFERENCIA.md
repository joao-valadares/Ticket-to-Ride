# 🎨 REFERÊNCIA RÁPIDA DE CORES - TICKET TO RIDE BRASIL

## 📋 CORES DAS CARTAS DE TREM

### **Cartas Normais (8 cores)**

```
🔴 VERMELHO     = 'red'      #e74c3c
🔵 AZUL         = 'blue'     #3498db
🟢 VERDE        = 'green'    #2ecc71
🟡 AMARELO      = 'yellow'   #f1c40f
⚫ PRETO        = 'black'    #2c3e50
⚪ BRANCO       = 'white'    #ecf0f1
🟠 LARANJA      = 'orange'   #e67e22
🟣 ROXO         = 'purple'   #9b59b6
```

### **Carta Especial**

```
🚂 LOCOMOTIVA   = N/A (coringa universal)
⚪ CINZA        = 'gray'     #95a5a6 (rotas que aceitam qualquer cor)
```

---

## 🛤️ DISTRIBUIÇÃO ATUAL DAS ROTAS POR COR

### **VERMELHO (3 rotas)**
- r5: Belém → Fortaleza (5 peças)
- r10: Cuiabá → Goiânia (4 peças)
- r17: Salvador → Belo Horizonte (5 peças)

### **AZUL (4 rotas)**
- r3: Porto Velho → Rio Branco (3 peças)
- r12: Goiânia → Brasília (2 peças)
- r19: Belo Horizonte → São Paulo (4 peças)
- r25: Florianópolis → Porto Alegre (4 peças)

### **VERDE (4 rotas)**
- r1: Manaus → Belém (6 peças)
- r14: Brasília → Salvador (5 peças)
- r21: Rio de Janeiro → São Paulo (4 peças) *DUPLA*
- r23: Campo Grande → São Paulo (5 peças)

### **AMARELO (2 rotas)**
- r4: Porto Velho → Cuiabá (6 peças)
- r15: Brasília → Belo Horizonte (4 peças)

### **PRETO (2 rotas)**
- r9: Fortaleza → Salvador (5 peças)
- r18: Belo Horizonte → Rio de Janeiro (3 peças)

### **BRANCO (4 rotas)**
- r7: Natal → Recife (2 peças)
- r11: Cuiabá → Campo Grande (3 peças)
- r20: Rio de Janeiro → São Paulo (4 peças) *DUPLA*
- r24: Curitiba → Florianópolis (3 peças)

### **LARANJA (3 rotas)**
- r2: Manaus → Porto Velho (5 peças)
- r8: Recife → Salvador (4 peças)
- r16: Goiânia → Belo Horizonte (4 peças)

### **ROXO (3 rotas)**
- r6: Fortaleza → Natal (3 peças)
- r13: Campo Grande → Goiânia (3 peças)
- r22: São Paulo → Curitiba (3 peças)

---

## 📊 ESTATÍSTICAS

- **Total de rotas:** 25
- **Rotas duplas:** 2 (Rio de Janeiro ↔ São Paulo)
- **Cor mais comum:** Azul, Verde, Branco (4 rotas cada)
- **Cor menos comum:** Amarelo, Preto (2 rotas cada)

---

## 🎯 SUGESTÕES DE BALANCEAMENTO

Para um jogo mais equilibrado, considere:

### **Adicionar mais rotas:**
- Amarelo (apenas 2 rotas)
- Preto (apenas 2 rotas)

### **Exemplo de novas rotas balanceadas:**

```javascript
// Adicionar rotas amarelas
{ id: 'r26', city1: 'salvador', city2: 'recife', color: 'yellow', length: 4 },
{ id: 'r27', city1: 'curitiba', city2: 'porto-alegre', color: 'yellow', length: 5 },

// Adicionar rotas pretas
{ id: 'r28', city1: 'manaus', city2: 'cuiaba', color: 'black', length: 7 },
{ id: 'r29', city1: 'natal', city2: 'fortaleza', color: 'black', length: 3 },
```

---

## 🎨 CÓDIGOS DE COR PARA CSS

Se precisar personalizar as cores no CSS:

```css
/* frontend/src/App.css */

.train-card.red { background: #e74c3c; }
.train-card.blue { background: #3498db; }
.train-card.green { background: #2ecc71; }
.train-card.yellow { background: #f1c40f; }
.train-card.black { background: #2c3e50; }
.train-card.white { background: #ecf0f1; color: #333; }
.train-card.orange { background: #e67e22; }
.train-card.purple { background: #9b59b6; }
.train-card.gray { background: #95a5a6; }
.train-card.locomotive { 
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
}
```

---

## 🔄 CONVERSÃO DE CORES

### **Do código para o emoji:**

| Código | Emoji | Nome |
|--------|-------|------|
| `'red'` | 🔴 | Vermelho |
| `'blue'` | 🔵 | Azul |
| `'green'` | 🟢 | Verde |
| `'yellow'` | 🟡 | Amarelo |
| `'black'` | ⚫ | Preto |
| `'white'` | ⚪ | Branco |
| `'orange'` | 🟠 | Laranja |
| `'purple'` | 🟣 | Roxo |
| `'gray'` | ⚪ | Cinza |

### **Do emoji para o código:**

| Emoji | Código | Hex Color |
|-------|--------|-----------|
| 🔴 | `'red'` | `#e74c3c` |
| 🔵 | `'blue'` | `#3498db` |
| 🟢 | `'green'` | `#2ecc71` |
| 🟡 | `'yellow'` | `#f1c40f` |
| ⚫ | `'black'` | `#2c3e50` |
| ⚪ | `'white'` | `#ecf0f1` |
| 🟠 | `'orange'` | `#e67e22` |
| 🟣 | `'purple'` | `#9b59b6` |

---

## 📝 TEMPLATE PARA NOVAS ROTAS

```javascript
// Copie e cole este template ao adicionar novas rotas:

// ROTA SIMPLES
{ 
  id: 'rXX',              // Próximo número disponível
  city1: 'cidade1',       // ID da cidade de origem
  city2: 'cidade2',       // ID da cidade de destino
  color: 'red',           // red, blue, green, yellow, black, white, orange, purple, gray
  length: 4               // 1-8 peças
},

// ROTA CINZA (QUALQUER COR)
{ 
  id: 'rXX', 
  city1: 'cidade1', 
  city2: 'cidade2', 
  color: 'gray',          // Aceita qualquer cor
  length: 3 
},
```

---

## 🎮 CORES NO JOGO

### **Como as cores funcionam:**

1. **Rotas Coloridas:** Requerem cartas da cor específica
2. **Rotas Cinzas:** Aceitam cartas de qualquer cor (mas todas iguais)
3. **Locomotivas:** Servem como coringa para qualquer cor

### **Exemplos:**

```
ROTA AZUL (4 peças):
✅ 4 cartas azuis
✅ 3 azuis + 1 Locomotiva
✅ 4 Locomotivas
❌ 2 azuis + 2 vermelhas (cores diferentes)

ROTA CINZA (5 peças):
✅ 5 cartas vermelhas
✅ 5 cartas azuis
✅ 3 verdes + 2 Locomotivas
❌ 3 vermelhas + 2 azuis (precisa ser mesma cor)
```

---

## 🎨 PALETA DE CORES ACESSÍVEL

As cores escolhidas são amigáveis para daltônicos:

- ✅ **Alto contraste** entre cores adjacentes
- ✅ **Vermelho e Verde** não são usados juntos em rotas próximas
- ✅ **Branco** tem borda preta para visibilidade

### **Para melhorar ainda mais a acessibilidade:**

Adicione ícones ou padrões às cartas:

```javascript
const cardPatterns = {
  red: '■',      // Quadrado
  blue: '●',     // Círculo
  green: '▲',    // Triângulo
  yellow: '★',   // Estrela
  black: '◆',    // Diamante
  white: '▼',    // Triângulo invertido
  orange: '◼',   // Quadrado grosso
  purple: '◐',   // Círculo meio
};
```

---

## 🔍 ENCONTRAR ROTAS POR COR

### **Comando útil para desenvolvedores:**

```javascript
// Cole no console do navegador (F12)

// Encontrar todas as rotas de uma cor específica:
const routes = []; // Cole aqui o array de rotas do brasilMap.js
const color = 'red'; // Mude para a cor desejada

const routesByColor = routes.filter(r => r.color === color);
console.table(routesByColor);

// Ver distribuição de cores:
const colorCount = routes.reduce((acc, r) => {
  acc[r.color] = (acc[r.color] || 0) + 1;
  return acc;
}, {});
console.table(colorCount);
```

---

## 🎯 QUICK REFERENCE

### **Qual cor usar para uma nova rota?**

**Critérios:**
1. ✅ Escolha uma cor **menos usada** (Amarelo, Preto)
2. ✅ Evite concentrar muitas rotas da mesma cor em uma região
3. ✅ Considere o comprimento da rota (rotas longas = cores menos comuns)
4. ✅ Use **cinza** para rotas que conectam regiões distantes

### **Exemplo de boa distribuição:**

```
REGIÃO SUL:
- Azul: 1 rota longa (6 peças)
- Verde: 1 rota média (4 peças)
- Roxo: 2 rotas curtas (3 peças cada)
- Branco: 1 rota curta (2 peças)
```

---

**Pronto! Use este guia sempre que precisar adicionar ou modificar rotas! 🎨🛤️**

---

*Última atualização: Outubro 2025*
