var square = getSquare();
// Dicionário de cores em português para inglês
var cores = {
    "Azul Claro": "aqua",
    "Preto": "black",
    "Azul": "blue",
    "Fúcsia": "fuchsia",
    "Cinza": "gray",
    "Verde": "green",
    "Verde Limão": "lime",
    "Marrom": "maroon",
    "Azul Marinho": "navy",
    "Verde Oliva": "olive",
    "Laranja": "orange",
    "Roxo": "purple",
    "Vermelho": "red",
    "Prata": "silver",
    "Azul Petróleo": "teal",
    "Amarelo": "yellow"
};

function Game() {
    var dado1;
    var dado2;
    var dadosLancados = false;

    this.jogarDados = function () {
        dado1 = Math.floor(Math.random() * 6) + 1;
        dado2 = Math.floor(Math.random() * 6) + 1;
        dadosLancados = true;
    };

    this.resetarDados = function () {
        dadosLancados = false;
    };

    this.proximo = function () {
        if (dadosLancados) {
            jogar();
        } else {
            rolarDados();
        }
    };

    this.getDado = function (dado) {
        if (dado === 1) {
            return dado1;
        } else {
            return dado2;
        }
    };
}

var jogo;

function Jogador(nome, corIngles) {
    this.nome = nome;
    this.cor = corIngles;
    this.posicao = 0;
    this.money = 0;
    this.taxaTotal = 100;
    this.voltasCompletas = 0;
    this.lojas = [];
    this.proximaArrecadacaoDobrada = false;
    this.ultimaPosicao = 0;
    this.pay = function(valor) {
        // Verifica se o jogador tem dinheiro suficiente
        if (this.money >= valor) {
          this.money -= valor;
        } else {
          this.money = 0; // Define o dinheiro como 0 se o valor for maior que o disponível
          addAlert(this.nome + " não tem dinheiro suficiente para pagar a penalidade. Seu dinheiro foi zerado."); // Adiciona um alerta
        }
      };

    // Inicializa as propriedades das lojas para cada jogador
    for (var i = 0; i < square.length; i++) {
        if (square[i].tipo === "loja") {
            this.lojas[i] = {
                taxa: 0,
                arrecadacaoBase: square[i].arrecadacaoBase,
                impactoVendas: square[i].impactoVendas,
                limiteTaxacao: square[i].limiteTaxacao,
                proximoBonusInvestimento: false
            };
        }
    }
}

Array.prototype.embaralhar = function (tamanho) {
    tamanho = tamanho || this.length;
    var num;
    var arrayIndices = [];

    for (var i = 0; i < tamanho; i++) {
        arrayIndices[i] = i;
    }

    for (var i = 0; i < tamanho; i++) {
        num = Math.floor(Math.random() * arrayIndices.length);
        this[i] = arrayIndices[num] + 1;
        arrayIndices.splice(num, 1);
    }
};

function adicionarAlerta(textoAlerta) {
    $alert = $("#alert");

    // Percorre o array de jogadores para encontrar o jogador atual
    for (var i = 1; i <= numeroJogadores; i++) {
        var jogador = jogadores[i];
        var regexJogador = new RegExp(jogador.nome, 'g');
        textoAlerta = textoAlerta.replace(regexJogador, "<span style='color: " + jogador.cor + "; font-weight: bold;'>" + jogador.nome + "</span>");
    }

    // Percorre o array de casas para encontrar as lojas e criar links clicáveis (Info Lojas - Tem que clica)
    //for (var i = 0; i < square.length; i++) {
    // var casa = square[i];
    //  if (casa.tipo === "loja") {
    // Substitui o nome da loja no texto por um link clicável
    //   textoAlerta = textoAlerta.replace(casa.nome, "<a href='#' onclick='showdeed(" + i + "); return false;'>" + casa.nome + "</a>");
    //   }
    // }

    // Percorre o array de casas para encontrar as lojas e criar links clicáveis 9 Info loja - popup)
    for (var i = 0; i < square.length; i++) {
        var casa = square[i];
        if (casa.tipo === "loja") {
            // Substitui o nome da loja no texto por um link clicável com eventos onclick, onmouseover e onmouseout
            textoAlerta = textoAlerta.replace(casa.nome, "<a href='#' onclick='showdeed(" + i + "); return false;' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();' >" + casa.nome + "</a>");
        }
    }

    // Adiciona o alerta estilizado ao terminal
    $(document.createElement("div")).html(textoAlerta).appendTo($alert);

    $alert.stop().animate({ scrollTop: $alert.prop("scrollHeight") }, 1000);
}

function popup(HTML, acao, opcao) {
    document.getElementById("popuptext").innerHTML = HTML;
    document.getElementById("popup").style.width = "300px";
    document.getElementById("popup").style.top = "0px";
    document.getElementById("popup").style.left = "0px";

    if (!opcao && typeof acao === "string") {
        opcao = acao;
    }

    opcao = opcao ? opcao.toLowerCase() : "";

    if (typeof acao !== "function") {
        acao = null;
    }

    if (opcao === "sim/não") {
        document.getElementById("popuptext").innerHTML +=
            "<div><input type=\"button\" value=\"Sim\" id=\"popupyes\" /><input type=\"button\" value=\"Não\" id=\"popupno\" /></div>";

        $("#popupyes, #popupno").on("click", function () {
            $("#popupwrap").hide();
            $("#popupbackground").fadeOut(400);
        });

        $("#popupyes").on("click", acao);
    } else if (opcao !== "blank") {
        $("#popuptext").append(
            "<div><input type='button' value='OK' id='popupclose' /></div>"
        );
        $("#popupclose").focus();

        $("#popupclose")
            .on("click", function () {
                $("#popupwrap").hide();
                $("#popupbackground").fadeOut(400);
            })
            .on("click", acao);
    }

    $("#popupbackground").fadeIn(400, function () {
        $("#popupwrap").show();
    });
}

function atualizarPosicao() {
    document.getElementById("jail").style.border = "1px solid black";
    document.getElementById("jailpositionholder").innerHTML = "";
    for (var i = 0; i < 40; i++) {
        document.getElementById("cell" + i).style.border = "1px solid black";
        document.getElementById("cell" + i + "positionholder").innerHTML = "";
    }

    var sq, left, top;

    for (var x = 0; x < 40; x++) {
        sq = square[x];
        left = 0;
        top = 0;

        for (var y = turno; y <= numeroJogadores; y++) {
            if (jogadores[y].posicao == x) {
                document.getElementById("cell" + x + "positionholder").innerHTML +=
                    "<div class='cell-position' title='" +
                    jogadores[y].nome +
                    "' style='background-color: " +
                    jogadores[y].cor +
                    "; left: " +
                    left +
                    "px; top: " +
                    top +
                    "px;'></div>";
                if (left == 36) {
                    left = 0;
                    top = 12;
                } else left += 12;
            }
        }

        for (var y = 1; y < turno; y++) {
            if (jogadores[y].posicao == x) {
                document.getElementById("cell" + x + "positionholder").innerHTML +=
                    "<div class='cell-position' title='" +
                    jogadores[y].nome +
                    "' style='background-color: " +
                    jogadores[y].cor +
                    "; left: " +
                    left +
                    "px; top: " +
                    top +
                    "px;'></div>";
                if (left == 36) {
                    left = 0;
                    top = 12;
                } else left += 12;
            }
        }
    }

    j = jogadores[turno];
    document.getElementById("cell" + j.posicao).style.border = "1px solid " + j.cor;
}

var taxacaoCasas = [];
for (var i = 0; i < 40; i++) {
    taxacaoCasas[i] = []; // Inicializa um array vazio para cada casa
}

function atualizarCoresJogadores() {
    // Reset borders e taxacao-bar
    for (var i = 0; i < 40; i++) {
        document.getElementById("cell" + i).style.border = "1px solid black";
        // Verifica se o elemento existe antes de tentar acessar
        var taxacaoBar = document.getElementById("cell" + i + "taxacao-bar");
        if (taxacaoBar) {
            taxacaoBar.style.width = "0%";
            taxacaoBar.innerHTML = "";
        }
    }
    document.getElementById("jail").style.border = "1px solid black";
    document.getElementById("jailpositionholder").innerHTML = "";

    // Define a posição e a borda dos jogadores nas células
    for (var i = 1; i <= numeroJogadores; i++) {
        var jogador = jogadores[i];
        var posicao = jogador.posicao;

        // Verifica se o jogador está na cadeia
        if (posicao === 30) { // Posição da cadeia
            var cellPositionHolder = document.getElementById("jailpositionholder");
            // Define a borda da célula da cadeia com a cor do jogador (se for o jogador atual)
            if (i === turno) {
                document.getElementById("jail").style.border = "2px solid " + jogador.cor;
            }
        } else {
            var cellPositionHolder = document.getElementById("cell" + posicao + "positionholder");
            // Define a borda da célula normal com a cor do jogador (se for o jogador atual)
            if (i === turno) {
                document.getElementById("cell" + posicao).style.border = "2px solid " + jogador.cor;
            }
        }

        // (isso dava bug das cores duplicadas)
        // var playerDiv = document.createElement("div");
        // playerDiv.className = "cell-position";
        // playerDiv.title = jogador.nome;
        // playerDiv.style.backgroundColor = jogador.cor;
        // playerDiv.style.left = (i - 1) * 14 + "px"; // Posiciona os jogadores lado a lado
        // cellPositionHolder.appendChild(playerDiv);
    }

    // Atualiza as barras de taxação
    for (var i = 1; i < square.length; i++) {
        if (square[i].tipo === "loja" && square[i].taxaAtual > 0) {
            var casa = square[i];
            var cellTaxacaoBar = document.getElementById("cell" + i + "taxacao-bar");
            var jogadoresNaCasa = taxacaoCasas[i];

            // Calcula a largura da barra para cada jogador
            var larguraBarra = 100 / jogadoresNaCasa.length;

            // Define as cores da barra de taxação
            for (var j = 0; j < jogadoresNaCasa.length; j++) {
                var jogador = jogadoresNaCasa[j];
                var corJogador = jogador.cor;

                var divTaxacao = document.createElement("div");
                divTaxacao.style.width = larguraBarra + "%";
                divTaxacao.style.height = "10px";
                divTaxacao.style.backgroundColor = corJogador;
                divTaxacao.style.cssFloat = "left"; // Alinha as cores lado a lado
                cellTaxacaoBar.appendChild(divTaxacao);
            }
        }
    }
}

function atualizarArrecadacao() {
    var j = jogadores[turno];

    document.getElementById("pmoney").innerHTML = "R$" + j.money;
    document.getElementById("pTaxaRestante").innerHTML = j.taxaTotal + "%";
    $(".money-bar-row").hide();

    for (var i = 1; i <= numeroJogadores; i++) {
        j_i = jogadores[i];

        $("#moneybarrow" + i).show();
        document.getElementById("p" + i + "moneybar").style.border = "2px solid " + j_i.cor;

        // Formata o dinheiro com vírgula e duas casas decimais
        var dinheiroFormatado = j_i.money.toFixed(2).replace(".", ",");
        document.getElementById("p" + i + "money").innerHTML = dinheiroFormatado;

        document.getElementById("p" + i + "moneyname").innerHTML = j_i.nome;
    }

    if (document.getElementById("landed").innerHTML === "") {
        $("#landed").hide();
    }

    document.getElementById("quickstats").style.borderColor = j.cor;
}

function atualizarDados() {
    var dado0 = jogo.getDado(1);
    var dado1 = jogo.getDado(2);

    $("#die0").show();
    $("#die1").show();

    if (document.images) {
        var elemento0 = document.getElementById("die0");
        var elemento1 = document.getElementById("die1");

        elemento0.classList.remove("die-no-img");
        elemento1.classList.remove("die-no-img");

        elemento0.title = "Dado (" + dado0 + " pontos)";
        elemento1.title = "Dado (" + dado1 + " pontos)";

        if (elemento0.firstChild) {
            elemento0 = elemento0.firstChild;
        } else {
            elemento0 = elemento0.appendChild(document.createElement("img"));
        }

        elemento0.src = "images/Die_" + dado0 + ".png";
        elemento0.alt = dado0;

        if (elemento1.firstChild) {
            elemento1 = elemento1.firstChild;
        } else {
            elemento1 = elemento1.appendChild(document.createElement("img"));
        }

        elemento1.src = "images/Die_" + dado1 + ".png";
        elemento1.alt = dado0;
    } else {
        document.getElementById("die0").textContent = dado0;
        document.getElementById("die1").textContent = dado1;

        document.getElementById("die0").title = "Dado";
        document.getElementById("die1").title = "Dado";
    }
}

function mostrarCartaEvento() {
    var j = jogadores[turno];

    var cartaEventoIndex = cartasEvento.deck[cartasEvento.index];

    popup(
        "<img src='images/chance_icon.png' style='height: 50px; width: 26px; float: left; margin: 8px 8px 8px 0px;' /><div style='font-weight: bold; font-size: 16px; '>Carta de Evento:</div><div style='text-align: justify;'>" +
        cartasEvento[cartaEventoIndex].text +
        "</div>",
        function () {
            acaoCartaEvento(cartaEventoIndex);
        }
    );

    cartasEvento.index++;

    if (cartasEvento.index >= cartasEvento.deck.length) {
        cartasEvento.index = 0;
    }
}

function acaoCartaEvento(cartaEventoIndex) {
    var j = jogadores[turno];

    cartasEvento[cartaEventoIndex].action(j);

    atualizarArrecadacao();

    jogo.proximo();
}

function pagarTaxaLuxo() {
    var j = jogadores[turno];
    j.pay(square[j.posicao].arrecadacaoBase); // Adicione os parênteses para chamar a função
    addAlert(j.nome + " pagou R$" + square[j.posicao].arrecadacaoBase + " de Imposto de Luxo.");
}

function pousar() {
    var j = jogadores[turno];
    var s = square[j.posicao];

    $("#landed").show();
    document.getElementById("landed").innerHTML =
        "Você parou em " + s.nome + ".";
    s.landcount++;
    adicionarAlerta(j.nome + " parou em " + s.nome + ".");

    // Ações para cada tipo de casa
    switch (s.tipo) {
        case "inicio":
            // Nenhuma ação especial para o início.
            break;
        case "loja":
            if (taxas[s.nome]) {
                var taxaLoja = taxas[s.nome];
                var inputTaxacaoHTML =
                    "<div>Defina a taxa para " +
                    s.nome +
                    " (" + taxaLoja.min + "% -" + taxaLoja.max + "%): <input type='number' id='inputTaxacao' min='" + taxaLoja.min + "' max='" + taxaLoja.max + "' value='" + taxaLoja.min + "'></div>";

                inputTaxacaoHTML += "<p>Impacto: " + calcularImpactoTaxa(taxaLoja, taxaLoja.min) + "</p>";

                inputTaxacaoHTML += "<input type='button' value='Aplicar Taxa' onclick='aplicarTaxaLoja(parseInt(document.getElementById(\"inputTaxacao\").value, 10));'>";

                // Adiciona a descrição da escolha secundária de volta
                if (s.escolhaSecundaria) {
                    inputTaxacaoHTML += "<p>" + s.escolhaSecundaria.descricao + "</p>";
                    inputTaxacaoHTML += "<input type='button' value='Executar Escolha Secundária' onclick='executarEscolhaSecundaria();'>";
                }

                document.getElementById("landed").innerHTML = inputTaxacaoHTML;

                // ... (código para atualizar o impacto da taxa) ...
            } else {
                console.error("Erro na casa", s.nome + ": a propriedade 'taxa' não está definida no objeto global 'taxas'.");
            }
            break;
        case "especial":
            s.escolhaSecundaria(j);
            break;
        case "impostoLuxo":
            pagarTaxaLuxo();
            break;
        case "cadeia":
            j.posicao = 30; // Define a posição do jogador como 30 (cadeia)
            atualizarCoresJogadores(); // Atualiza a posição do jogador no tabuleiro
            adicionarAlerta(j.nome + " foi para a cadeia!");
            break;
        case "paradaLivre":
            // Nenhuma ação especial para parada livre
            break;
        case "pontos":
            // Nenhuma ação especial para "pontos"
            break;
        default:
            console.error("Tipo de casa inválido:", s.tipo);
    }

    atualizarArrecadacao();
    atualizarPosicao();

    if (j.posicao < j.ultimaPosicao) {
        j.voltasCompletas++;
        j.taxaTotal += 10;
        adicionarAlerta(
            j.nome +
            " completou uma volta no tabuleiro e ganhou 10% de taxa adicional."
        );
    }
    j.ultimaPosicao = j.posicao;
}

// Função para calcular o impacto da taxa
function calcularImpactoTaxa(taxaLoja, valorTaxa) { // Recebe taxaLoja como argumento
    var ganho = taxaLoja.ganhoValor * (valorTaxa / taxaLoja.ganhoPorcento); // Acessa as propriedades diretamente de taxaLoja

    if (taxaLoja.quedaAcima && valorTaxa > taxaLoja.quedaAcima) {
        ganho *= 1 - (taxaLoja.quedaPorcento / 100);
        return "Arrecadação: R$" + ganho.toFixed(2) + ". Vendas caem " + taxaLoja.quedaPorcento + "% na próxima rodada.";
    } else if (taxaLoja.multaAcima && valorTaxa > taxaLoja.multaAcima) {
        return "Arrecadação: R$" + ganho.toFixed(2) + ". Multa de " + taxaLoja.multaPorcento + "% na próxima rodada.";
    } else {
        return "Arrecadação: R$" + ganho.toFixed(2) + ".";
    }
}


function aplicarTaxaLoja(taxa) {
    var j = jogadores[turno];
    var s = square[j.posicao];
    var taxaLoja = taxas[s.nome];

    // Verifica se a taxa está dentro dos limites
    if (taxa < taxaLoja.min || taxa > taxaLoja.max) {
        alert("Taxa inválida! A taxa deve estar entre " + taxaLoja.min + "% e " + taxaLoja.max + "%.");
        return;
    }

    // Calcula a arrecadação com base nas regras da loja
    var arrecadacao = taxaLoja.ganhoValor * (taxa / taxaLoja.ganhoPorcento);

    // Aplica a queda nas vendas, se necessário
    if (taxaLoja.quedaAcima && taxa > taxaLoja.quedaAcima) {
        j.lojas[j.posicao].arrecadacaoBase *= (1 - taxaLoja.quedaPorcento / 100);
        addAlert(s.nome + ": as vendas caíram " + taxaLoja.quedaPorcento + "% devido à alta taxa.");
    }

    // Aplica a multa, se necessário
    if (taxaLoja.multaAcima && taxa > taxaLoja.multaAcima) {
        j.money -= j.lojas[j.posicao].arrecadacaoBase * (taxaLoja.multaPorcento / 100);
        addAlert(j.nome + " pagou uma multa de " + taxaLoja.multaPorcento + "% sobre a arrecadação da " + s.nome + ".");
    }

    if (taxa < 0) {
        taxa = 0;
    } else if (taxa > j.taxaTotal) {
        taxa = j.taxaTotal;
    }

    s.taxaAtual = taxa;
    j.lojas[j.posicao].taxa = taxa;
    j.taxaTotal -= taxa;
    s.dono = turno;

    var arrecadacao = s.arrecadacaoBase * (taxa / 100);

    if (taxa > s.limiteTaxacao) {
        arrecadacao *= 1 + s.impactoVendas;
    }

    if (j.proximaArrecadacaoDobrada) {
        arrecadacao *= 2;
        j.proximaArrecadacaoDobrada = false;
    }

    if (j.lojas[j.posicao].proximoBonusInvestimento) {
        arrecadacao *= 1.2;
        j.lojas[j.posicao].proximoBonusInvestimento = false;
    }

    j.money += arrecadacao;

    adicionarAlerta(j.nome + " definiu a taxa da " + s.nome + " para " + taxa + "% e arrecadou R$" + arrecadacao.toFixed(2) + ".");

    // Atualiza a barra de taxação da loja
    var taxacaoBar = document.getElementById("cell" + j.posicao + "taxacao-bar");
    taxacaoBar.style.width = taxa + "%"; // Define a largura da barra de acordo com a taxa
    taxacaoBar.style.backgroundColor = j.cor; // Define a cor da barra com a cor do jogador

    atualizarArrecadacao();
    atualizarCoresJogadores();

    // Desabilita o botão de escolha secundária
    $("#landed input[value='Executar Escolha Secundária']").prop("disabled", true);

    // Remove o botão "Aplicar Taxa" do HTML
    $("#landed input[value='Aplicar Taxa']").prop("disabled", true);

    // Escolha secundária (se houver) - (Perguntava se quer fazer a esscolha secundaria)
    if (s.escolhaSecundaria) {
        //    mostrarEscolhaSecundaria(j);
    } else {
        finalizarTurno(); // Chama finalizarTurno apenas se não houver escolha secundária
    }
}

function mostrarCartaEscolhaSecundaria(index) {
    var carta = cartasEscolhaSecundaria[index];
    if (carta) {
        popup(
            "<img src='images/chance_icon.png' style='height: 50px; width: 26px; float: left; margin: 8px 8px 8px 0px;' /><div style='font-weight: bold; font-size: 16px; '>Carta de Evento:</div><div style='text-align: justify;'>" +
            carta.text +
            "</div>",
            function () {
                carta.action(jogadores[turno]);
                finalizarTurno(true); // Finaliza o turno após executar a ação da carta
            }
        );
    } else {
        console.error("Carta de escolha secundária não encontrada para o índice:", index);
    }
}

function executarEscolhaSecundaria() {
    var j = jogadores[turno];
    var s = square[j.posicao];

    if (s.escolhaSecundaria) {
        mostrarCartaEscolhaSecundaria(j.posicao);
        //s.escolhaSecundaria.efeito(j); // Executa o efeito da escolha secundária
        atualizarCoresJogadores();
        //finalizarTurno();`

        // Desabilita o botão de aplicar taxa
        $("#landed input[value='Aplicar Taxa']").prop("disabled", true);

        // Desabilita o botão de escolha secundária
        $("#landed input[value='Executar Escolha Secundária']").prop("disabled", true);
    }

    // **CÓDIGO ANTIGO**
    // Avalia a string da função escolhaSecundaria
    // var escolhaSecundariaFunc = eval(s.escolhaSecundaria);

    // Chama a função com o objeto jogador como argumento
    // s.escolhaSecundaria.efeito(j);

    // Chama a função efeito dentro do objeto escolhaSecundaria
    // if (s.escolhaSecundaria) {
    //     s.escolhaSecundaria.efeito(j);
    //     atualizarCoresJogadores();
    //     finalizarTurno();
    // }

    // finalizarTurno();
    //finalizarTurno(true); 
}

function mostrarEscolhaSecundaria(jogador) { // Recebe o jogador como argumento
    var s = square[jogador.posicao];
    var botaoEscolha = "<input type='button' value='Sim' onclick='executarEscolhaSecundaria(" + jogador.index + ");'>"; // Passa o índice do jogador para executarEscolhaSecundaria
    document.getElementById("landed").innerHTML += "<br>Deseja executar a escolha secundária? " + botaoEscolha;
}

function rolarDados() {
    var j = jogadores[turno];

    if (j.money >= valorObjetivo) {
        fimDeJogo();
        return;
    }

    document.getElementById("nextbutton").value = "Finalizar Turno";
    document.getElementById("nextbutton").title =
        "Finalizar turno e avançar para o próximo jogador.";

    jogo.jogarDados();
    var dado1 = jogo.getDado(1);
    var dado2 = jogo.getDado(2);

    adicionarAlerta(j.nome + " tirou " + (dado1 + dado2) + ".");

    atualizarDados(dado1, dado2);

    j.posicao += dado1 + dado2;

    if (j.posicao > 39) {
        j.posicao -= 40;
        j.voltasCompletas++;
        j.taxaTotal += 10;
        adicionarAlerta(j.nome + " completou uma volta no tabuleiro passando pela " + square[j.posicao].nome + " ganhou 10% de taxa adicional.");
    }

    pousar();
    atualizarCoresJogadores();
}

function jogar() {
    // Verifica se o jogo deve terminar
    if (jogoTerminou()) {
        fimDeJogo();
        return;
    }

    turno++;
    if (turno > numeroJogadores) {
        turno -= numeroJogadores;
    }

    var j = jogadores[turno];
    jogo.resetarDados();

    document.getElementById("pname").innerHTML = j.nome;
    document.getElementById("pTaxaRestante").innerHTML = j.taxaTotal + "%";
    document.getElementById("pmoney").innerHTML = j.money;

    adicionarAlerta("É a vez de " + j.nome + ".");

    $("#landed").hide();
    $("#board, #control, #moneybar, #viewstats").show();

    document.getElementById("nextbutton").value = "Jogar Dados";
    document.getElementById("nextbutton").title =
        "Jogue os dados e mova seu peão.";

    $("#die0").hide();
    $("#die1").hide();

    atualizarArrecadacao();
    atualizarPosicao();
    atualizarCoresJogadores();

    $(".money-bar-arrow").hide();
    $("#p" + turno + "arrow").show();
}

// Função para verificar se o jogo terminou
function jogoTerminou() {
    // Verifica se algum jogador atingiu o valor objetivo
    for (var i = 1; i <= numeroJogadores; i++) {
        if (jogadores[i].money >= valorObjetivo) {
            return true;
        }
    }
    return false; // Se nenhum jogador atingiu o valor objetivo, o jogo continua

    // Verifica se todos os jogadores completaram 4 voltas
    //for (var i = 1; i <= numeroJogadores; i++) {
    //    if (jogadores[i].voltasCompletas < 4) {
    //        return false; // Se algum jogador não completou 4 voltas, o jogo continua
    //    }
    // }

    //return true; // Se todos os jogadores completaram 4 voltas, o jogo termina
}

function iniciarJogo() {
    jogo = new Game();
    numeroJogadores = parseInt(document.getElementById("playernumber").value, 10);

    var arrayJogadores = new Array(numeroJogadores);
    arrayJogadores.embaralhar();

    for (var i = 1; i <= numeroJogadores; i++) {
        // Obtém a cor em português do select
        var corPortugues = document.getElementById("player" + i + "color").value;
        // Converte a cor para inglês usando o dicionário
        var corIngles = cores[corPortugues];

        // Cria o jogador com a cor em inglês
        jogadores[arrayJogadores[i - 1]] = new Jogador(
            document.getElementById("player" + i + "name").value,
            corIngles // Define a cor do jogador em inglês
        );
        jogadores[arrayJogadores[i - 1]].index = arrayJogadores[i - 1];
    }

    for (var i = 1; i <= numeroJogadores; i++) {
        jogadores[arrayJogadores[i - 1]] = new Jogador(
            document.getElementById("player" + i + "name").value,
            document.getElementById("player" + i + "color").value.toLowerCase()
        );
        jogadores[arrayJogadores[i - 1]].index = arrayJogadores[i - 1];
    }

    $("#setup").hide();
    $("#moneybar2").show();

    if (numeroJogadores === 2) {
        document.getElementById("stats").style.width = "454px";
    } else if (numeroJogadores === 3) {
        document.getElementById("stats").style.width = "686px";
    }

    document.getElementById("stats").style.top = "0px";
    document.getElementById("stats").style.left = "0px";

    $("#moneybarwrap2").show(); 
    $("#nextbutton").click(jogo.proximo);

    $(document).on("tabuleiroPronto", function () {
        atualizarCoresJogadores();
        rolarDados(); // Chama a função rolarDados aqui
    });

    jogar();
}

function mostrarEstatisticas() {
    var HTML = "<table align='center'><tr>";

    for (var i = 1; i <= numeroJogadores; i++) {
        var jogador = jogadores[i];
        HTML += "<td class='statscell' id='statscell" + i + "' style='border: 2px solid " + jogador.cor + "'>";
        HTML += "<div class='statsplayername'>" + jogador.nome + "</div>";
        HTML += "<div>Arrecadação Total: R$" + jogador.money.toFixed(2) + "</div>";
        HTML += "<div>Taxa Total Disponível: " + jogador.taxaTotal + "%</div>";
        HTML += "<table>";

        for (var j = 1; j < square.length; j++) {
            var s = square[j];

            if (s.tipo === "loja" && s.dono === jogador.index) {
                HTML += "<tr><td class='statscellcolor' style='background: " + s.cor + ";'></td>";
                HTML += "<td class='statscellname'>" + s.nome + " (Taxa: " + s.taxaAtual + "%)</td></tr>";
            }
        }

        HTML += "</table></td>";
    }

    HTML += "</tr></table>";

    document.getElementById("statstext").innerHTML = HTML;

    $("#statsbackground").fadeIn(400, function () {
        $("#statswrap").show();
    });
}

function showdeed(index) {
    var s = square[index];
    if (s.tipo === "loja") {
        $("#deed").show();
        $("#deed-loja").show();
        document.getElementById("deed-header").style.backgroundColor = s.cor;
        document.getElementById("deed-name").textContent = s.nome;
        document.getElementById("deed-arrecadacaoBase").textContent = s.arrecadacaoBase;
        document.getElementById("deed-taxaAtual").textContent = s.taxaAtual;

        // Adiciona a imagem da loja ao popup
        var imgHTML = "<img src='images/lojas/" + s.nome + ".png' class='loja-img-popup'>";
        document.getElementById("lojaImgRow").innerHTML = "<tr><td colspan='2'>" + imgHTML + "</td></tr>";

        // Adiciona a descrição da loja usando s.descricaoLoja
        var descricaoHTML = "<tr><td colspan='2'>" + s.escolhaSecundaria.descricaoLoja + "</td></tr>";
        document.getElementById("lojaDescricaoRow").innerHTML = descricaoHTML;

        // Formata a arrecadação base
        var arrecadacaoBaseFormatada = s.arrecadacaoBase.toFixed(2).replace(".", ",");
        document.getElementById("deed-arrecadacaoBase").textContent = arrecadacaoBaseFormatada;

        var arrecadacaoTotal = s.arrecadacaoBase * (s.taxaAtual / 100);
        if (s.taxaAtual > s.limiteTaxacao) {
            arrecadacaoTotal *= 1 + s.impactoVendas;
        }
        document.getElementById("deed-arrecadacaoTotal").textContent = arrecadacaoTotal.toFixed(2);
    }
}

function hidedeed() {
    $("#deed").hide();
}

function finalizarTurno(escolhaSecundariaExecutada = false) {
    if (jogadores[turno].money >= valorObjetivo) {
        fimDeJogo();
        return;
    }

    // Mostra a carta de evento apenas se a escolha secundária não foi executada
    if (!escolhaSecundariaExecutada) {
        mostrarCartaEvento();
    }

    //mostrarCartaEvento();
    //jogar();
}

function fimDeJogo() {
    var vencedor = jogadores.reduce((maior, atual) => {
        return (maior.money > atual.money) ? maior : atual;
    });

    // Formata o dinheiro do vencedor
    var dinheiroFormatado = vencedor.money.toFixed(2).replace(".", ",");

    alert("Fim de Jogo! O jogador " + vencedor.nome + " venceu com R$" + dinheiroFormatado + " de arrecadação!");

    $("#control").hide();
    $("#board").hide();
    $("#refresh").show();
}

function playernumber_onchange() {
    numeroJogadores = parseInt(document.getElementById("playernumber").value, 10);

    $(".player-input").hide();

    for (var i = 1; i <= numeroJogadores; i++) {
        $("#player" + i + "input").show();
    }
}