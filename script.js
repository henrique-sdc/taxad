$(document).ready(function () {
  // Configurar eventos iniciais
  $("#playernumber").on("change", playernumber_onchange);
  playernumber_onchange();

  $("#noscript").hide();
  $("#setup, #noF5").show();

  // Criar tabuleiro visualmente
  var enlargeWrap = document.body.appendChild(document.createElement("div"));
  enlargeWrap.id = "enlarge-wrap";

  var HTML = "";
  for (var i = 0; i < 40; i++) {
    s = square[i];
    HTML += "<div id='enlarge" + i + "' class='enlarge'>";
    HTML += "<div id='enlarge" + i + "color' class='enlarge-color'></div><br /><div id='enlarge" + i + "name' class='enlarge-name'></div>";
    HTML += "</div>";
  }
  enlargeWrap.innerHTML = HTML;

  var currentCell;
  var currentCellAnchor;
  var currentCellPositionHolder;
  var currentCellName;
  var currentCellOwner;

  for (var i = 0; i < 40; i++) {
    s = square[i];

    currentCell = document.getElementById("cell" + i);

    currentCellAnchor = currentCell.appendChild(document.createElement("div"));
    currentCellAnchor.id = "cell" + i + "anchor";
    currentCellAnchor.className = "cell-anchor";

    currentCellPositionHolder = currentCellAnchor.appendChild(document.createElement("div"));
    currentCellPositionHolder.id = "cell" + i + "positionholder";
    currentCellPositionHolder.className = "cell-position-holder";
    currentCellPositionHolder.enlargeId = "enlarge" + i;

    currentCellName = currentCellAnchor.appendChild(document.createElement("div"));
    currentCellName.id = "cell" + i + "name";
    currentCellName.className = "cell-name";
    currentCellName.textContent = s.nome;

    if (square[i].tipo === "loja") {
      currentCellOwner = currentCellAnchor.appendChild(document.createElement("div"));
      currentCellOwner.id = "cell" + i + "owner";
      currentCellOwner.className = "cell-owner";

      // Adiciona a barra de taxação
      var taxacaoBar = document.createElement("div");
      taxacaoBar.id = "cell" + i + "taxacao-bar";
      taxacaoBar.className = "taxacao-bar";
      currentCellAnchor.appendChild(taxacaoBar);

      // adiciona imagem da loja
      var lojaImg = document.createElement("img");
      lojaImg.src = "images/lojas/" + square[i].nome + ".png"; // Define o caminho da imagem
      lojaImg.className = "loja-img"; // Adicione uma classe para estilizar a imagem
      currentCellAnchor.appendChild(lojaImg);
    }

    document.getElementById("enlarge" + i + "color").style.backgroundColor = s.cor;
    document.getElementById("enlarge" + i + "name").textContent = s.nome;
  }

  // Adicionar jailpositionholder
  var jailCell = document.getElementById("jail");
  var jailPositionHolder = document.createElement("div");
  jailPositionHolder.id = "jailpositionholder";
  jailCell.appendChild(jailPositionHolder);

  // Criar jogadores visualmente
  var playerTokens = [];

  for (var i = 1; i <= 4; i++) {
    var jogadorToken = document.createElement("div");
    jogadorToken.id = "player" + i + "token";
    jogadorToken.className = "cell-position";
    jogadorToken.style.display = "none";
    document.getElementById("cell0positionholder").appendChild(jogadorToken);
    playerTokens.push(jogadorToken);
  }

  $(document).trigger("tabuleiroPronto");

  // Função para atualizar as cores dos jogadores no tabuleiro
  function atualizarCoresJogadores() {
    // Limpa todas as posições dos jogadores no tabuleiro
    for (var i = 0; i < 40; i++) {
      document.getElementById("cell" + i + "positionholder").innerHTML = "";
    }

    // Posiciona os jogadores com suas cores
    for (var i = 1; i <= numeroJogadores; i++) {
      var jogador = jogadores[i];
      var posicao = jogador.posicao;
      var cellPositionHolder = document.getElementById("cell" + posicao + "positionholder");

      // Cria um novo elemento div para cada jogador na célula
      var playerDiv = document.createElement("div");
      playerDiv.className = "cell-position";
      playerDiv.title = jogador.nome;
      playerDiv.style.backgroundColor = jogador.cor;
      cellPositionHolder.appendChild(playerDiv);
    }
  }

  // Função para atualizar as posições dos jogadores no tabuleiro
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

  // Configurar eventos do tabuleiro
  $("#viewstats").on("click", mostrarEstatisticas);
  $("#statsclose, #statsbackground").on("click", function () {
    $("#statswrap").hide();
    $("#statsbackground").fadeOut(400);
  });

  $(".cell-anchor").click(function () {
    var index = parseInt($(this).attr("id").replace("cell", ""), 10);
    showdeed(index);
  });

  $(".cell-position-holder, #jail").on("mouseover", function (e) { // Adicione 'e' aqui
    if (document.getElementById(this.enlargeId)) {
      $("#" + this.enlargeId).show();

      var element = document.getElementById(this.enlargeId);
      if (e.clientY + 20 > window.innerHeight - 204) {
        element.style.top = (window.innerHeight - 204) + "px";
      } else {
        element.style.top = (e.clientY + 20) + "px";
      }
      element.style.left = (e.clientX + 10) + "px";
    }
  }).on("mouseout", function () {
    // Verifica se o elemento enlarge existe
    if (document.getElementById(this.enlargeId)) {
      $("#" + this.enlargeId).hide();
    }
  });

  $("body").on("mousemove", function (e) {
    var object;
    if (e.target) {
      object = e.target;
    } else if (window.event && window.event.srcElement) {
      object = window.event.srcElement;
    }

    if (object.classList.contains("propertycellcolor") || object.classList.contains("statscellcolor")) {
      if (e.clientY + 20 > window.innerHeight - 279) {
        document.getElementById("deed").style.top = (window.innerHeight - 279) + "px";
      } else {
        document.getElementById("deed").style.top = (e.clientY + 20) + "px";
      }
      document.getElementById("deed").style.left = (e.clientX + 10) + "px";
    }
  });

  // Açao que fecha popuos se clicar fora da tela
  $(document).mouseup(function (e) {
    var popup = $("#deed");
    if (!popup.is(e.target) && popup.has(e.target).length === 0) {
      hidedeed();
    }
  });

   // Função para fechar o resumo das regras
   $("#fecharResumo").click(function() {
    $("#resumoRegras").hide();
  });

  $(document).ready(function() {
    // ... (seu código anterior) ...
  
    // Função para fechar o resumo das regras
    $("#fecharResumo").click(function() {
      $("#linhaResumoRegras").hide(); // Esconde a linha da tabela
    });
  
  });

  $("body").on("mouseup", function () {
    drag = false;
  });
});