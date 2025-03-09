# TAXAD - Gestão Tributária

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

## 📌 Visão Geral

**TAXAD** é um jogo de tabuleiro digital inspirado em *Monopoly*, onde o objetivo é gerir a tributação de diversas lojas para arrecadar o máximo de dinheiro. Cada casa do tabuleiro representa uma loja ou um espaço especial, e os jogadores devem lançar dados para se movimentar, definir percentuais de taxação e tomar decisões estratégicas que influenciam a arrecadação e o desempenho das lojas.

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**

## 📋 Regras Básicas do Jogo

- **Objetivo:** Arrecadar o máximo de dinheiro por meio da taxação das lojas.
- **Tabuleiro:** Composto por 36 casas – 28 lojas com cenários variados e 8 casas especiais que podem alterar as condições do jogo.
- **Jogabilidade:**  
  - Os jogadores lançam dois dados e se movimentam pelo tabuleiro.  
  - Ao cair em uma loja, é necessário definir um percentual de taxação (com impactos diretos na arrecadação e, em certos casos, nas vendas futuras).  
  - Em cada loja, há uma *escolha secundária* que pode alterar o curso do jogo (como investir para melhorar vendas ou ajustar penalidades).  
  - Casas especiais incluem ações como bônus de arrecadação, penalidades, isenção fiscal, entre outras.
- **Conquista:** O jogo termina quando um jogador alcança R$ 15.000 em arrecadação (ou após 2 voltas completas, dependendo da variante). O jogador com o maior valor arrecadado vence.

## 🎲 Como Jogar

1. **Início da Partida:** Cada jogador inicia com 100% de capacidade de taxação.
2. **Movimentação:** Lance os dois dados para avançar no tabuleiro.
3. **Decisões Estratégicas:**  
   - Ao cair em uma loja, escolha o percentual de taxação de acordo com o cenário da empresa.  
   - Avalie os impactos imediatos (arrecadação) e futuros (redução de vendas, multas, etc.).
4. **Casas Especiais:** Siga as instruções ao cair em casas com eventos, que podem alterar as regras temporariamente (ex.: bônus, penalidades, auditoria fiscal, etc.).
5. **Aprimoramento:** Ao completar uma volta, o jogador ganha 10% adicionais de capacidade de taxação para distribuir.

## 📂 Estrutura do Projeto

A estrutura básica do projeto é a seguinte:

```
taxad/
├── index.html           # Interface principal do jogo
├── styles.css          # Estilos da aplicação
├── script.js           # Lógica principal e interações
├── jogo.js             # Funções e classes relacionadas à lógica do jogo
├── classicedition.js    # Arquivo específico
├── global.js           # Variáveis/funções globais
└── README.md            # Documentação do projeto
```

## 🚀 Configuração e Execução

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/henrique-sdc/taxad.git
    cd taxad
    ```

2.  **Executar a Aplicação:**

    Você tem duas opções para executar o TaxaD:

  1.  **Execução Local:**

      Abra o arquivo `index.html` diretamente em um navegador moderno (Chrome, Firefox, Edge, etc.).  Simplesmente dê um duplo clique no arquivo `index.html` no seu explorador de arquivos.

  2.  **Execução Online (Vercel):**

      Acesse o jogo online através do seguinte link: [https://taxad-kappa.vercel.app/](https://taxad-kappa.vercel.app/)

## ⚙️ Funcionamento da Aplicação

*   **Interface:** A tela inicial apresenta:
    *   Tabuleiro interativo.
    *   Controles para lançar os dados.
    *   Painéis de estatísticas (arrecadação, capacidade de taxação, etc.).

*   **Lógica de Jogo:**  A lógica do jogo, incluindo o movimento dos peões e os efeitos das decisões em cada loja, é implementada em JavaScript.  Não há back-end; tudo é executado no navegador do usuário.

*   **Interatividade:** As escolhas do jogador (taxar ou optar por ações secundárias) afetam:
    *   Os valores arrecadados.
    *   As condições das lojas para as rodadas seguintes.

## 🌟 Melhorias Futuras

*   **Animações e Feedback Visual:**  Adicionar animações e efeitos visuais para destacar jogadas importantes e mudanças no tabuleiro/estado do jogo.  Isso melhorará a experiência do usuário.

*   **Multiplayer Online:**  Implementar suporte para partidas online com um ranking de jogadores.  Isso exigirá um back-end (Node.js, Python/Flask, etc.) e o uso de WebSockets para comunicação em tempo real.

*   **Customização de Regras:**  Permitir que os jogadores configurem parâmetros do jogo, como:
    *   Valor objetivo.
    *   Número de voltas.
    *   Outras regras customizáveis.

*   **Relatórios de Desempenho:** Criar um dashboard/seção de estatísticas para analisar o desempenho em cada partida e as decisões estratégicas tomadas. Isso pode incluir gráficos e tabelas detalhadas.
