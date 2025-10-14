# Projeto: Ticket To Ride - Brasil  
Versão: 1.0  
Data: 10 de setembro de 2025  
Autores: Anna Beatriz Chaboudet, João Portela Madureira, Rafael Vilares, João Pedro Valadares, Matheus Marcus, Ricardo Miranda Tanaka  

---

## 1. Visão Geral do Projeto

O projeto "Ticket To Ride - Brasil" consiste no desenvolvimento de um jogo de estratégia digital, web, inspirado em jogos de tabuleiro clássicos de coleta de conjuntos e conexão de rotas, como "Ticket to Ride".  
Os jogadores irão coletar cartas coloridas para reivindicar rotas em um mapa do Brasil, conectando cidades e completando objetivos secretos para marcar o maior número de pontos.  

O objetivo principal é criar uma experiência de jogo fiel às mecânicas que o inspiram, com uma interface de usuário intuitiva e suavidade na partida.

---

## 2. Escopo Detalhado

### 2.1. Funcionalidades (Features)

#### Módulo 1: Jogo Principal (Core Gameplay)

**Tabuleiro do Jogo**  
- Visualização de um mapa fixo (ex: Mapa do Brasil) com cidades e rotas coloridas pré-definidas.  
- Indicadores visuais para rotas disponíveis, reivindicadas e bloqueadas.  

**Sistema de Turnos**  
- Gerenciamento de turnos sequenciais para cada jogador.  
- O jogador, na sua vez, poderá realizar uma das seguintes ações:
  - Comprar Cartas de Trens: Pegar cartas do baralho principal ou das cartas abertas na mesa.  
  - Reivindicar uma Rota: Descartar cartas da mesma cor e quantidade correspondente à rota desejada para posicionar suas peças.  
  - Comprar Bilhetes de Destino: Pegar novos objetivos secretos (conectar duas cidades).  

**Sistema de Pontuação**  
- Cálculo de pontos em tempo real ao reivindicar rotas.  
- Cálculo de pontos ao final da partida:
  - Soma dos pontos por bilhetes de destino completos.  
  - Subtração de pontos por bilhetes de destino incompletos.  
  - Bônus para o jogador com a maior rota contínua.  

**Condição de Fim de Jogo**  
- O jogo entra na rodada final quando um jogador fica com 2 ou menos peças de trem.  
- Exibição da tela de pontuação final e declaração do vencedor.  

---

#### Módulo 2: Interface do Usuário (UI) e Experiência do Usuário (UX)

**Menu Principal**  
- Opções para "Jogar", "Configurações" e "Sair".  

**Tela de Jogo**  
- Visualização clara do mapa, mão de cartas do jogador, bilhetes de destino, cartas abertas e baralhos.  
- Exibição do placar e informações dos outros jogadores (nome, cor, quantidade de peças restantes).  
- Notificações e feedback visual para ações (ex: "Rota reivindicada com sucesso!", "Sua vez de jogar").  

**Fluxo de Interação**  
- Ações realizadas com cliques intuitivos (arrastar e soltar ou clicar para selecionar).  

---

#### Módulo 3: Jogador Único (Single Player)

- Oponentes.  
- Multiplayer Local.  

---

### 2.2. Requisitos Não Funcionais

**Plataforma Alvo**  
- Navegadores Web para Desktop (Google Chrome, Mozilla Firefox, Safari).  

**Tecnologia (Exemplo)**  
- Frontend: React ou Vue.js.  
- Backend: Node.js e WebSockets para comunicação em tempo real.  
- Banco de Dados: PostgreSQL para perfis de jogadores.  

**Desempenho**  
- O jogo deve rodar de forma fluida, sem travamentos ou lentidão perceptível durante as animações e ações dos jogadores.  

---

### Observações para o desenvolvimento por IA

1. Todas as mecânicas descritas devem ser implementadas de forma modular, respeitando a separação entre lógica de jogo, interface e persistência de dados.  
2. A IA deve estruturar o código em camadas (frontend, backend, database) seguindo boas práticas de clean architecture e design patterns.  
3. As regras de jogo, pontuação e condições de vitória devem ser totalmente automatizadas, sem intervenção manual.  
4. O mapa e as rotas devem ser definidos por um conjunto de dados fixo, representando cidades brasileiras conectadas por linhas de trem.  
5. O sistema de turnos deve gerenciar múltiplos jogadores (humanos e bots locais), garantindo consistência de estado e sincronização via WebSocket.  
6. O backend deve ser responsável por manter o estado da partida, validar jogadas e comunicar atualizações para todos os clientes conectados.  
7. O frontend deve priorizar clareza visual e interatividade simples, com uso de componentes reutilizáveis e responsivos.  
8. O banco de dados deve armazenar informações persistentes sobre jogadores, partidas e pontuações.  

---
