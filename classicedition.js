var cartasEscolhaSecundaria = [];

function Square(nome, cor, tipo, arrecadacaoBase, impactoVendas, limiteTaxacao, escolhaSecundaria) {
	this.nome = nome;
	this.cor = cor;
	this.dono = 0;
	this.tipo = tipo;
	this.taxaAtual = 0; 
	this.arrecadacaoBase = arrecadacaoBase || 0;
	this.impactoVendas = impactoVendas || 0; // Porcentagem de impacto nas vendas quando a taxa excede o limite
	this.limiteTaxacao = limiteTaxacao || 0; // Limite de taxação antes de impactar as vendas
	this.escolhaSecundaria = escolhaSecundaria || null; // Função a ser executada para a escolha secundária
	this.landcount = 0; 
}

function Card(text, action) {
	this.text = text;
	this.action = action;
}

function corrections() {
	// Correções para o tabuleiro (se necessário)
}

var square = [];

square[0] = new Square("INÍCIO", "#FFFFFF", "inicio");
square[1] = new Square("AliExpress", "#FF4500", "loja", 2000, -0.25, 40, {
    descricao: "Investir em logística para aumentar as vendas em 10% na próxima rodada.",
    efeito: function (p) {
        p.lojas[1].arrecadacaoBase *= 1.10;
        addAlert(p.nome + " investiu em logística na AliExpress, aumentando as vendas em 10% na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Gigante do varejo online, com sede na China, conecta compradores e vendedores de todo o mundo, oferecendo uma ampla gama de produtos a preços competitivos. <br><strong>Processos:</strong> Modelo de marketplace, com foco em logística eficiente e preços baixos. <br><strong>Departamentos:</strong> Operações, Logística, Tecnologia, Marketing, Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong> Plataforma online de compra e venda de produtos. <br><strong>Desafios:</strong> Manter a competitividade em preços, otimizar a logística global, lidar com questões de falsificação e qualidade de produtos. <br><strong>Objetivo:</strong> Aumentar a participação no mercado global e fortalecer a confiança dos consumidores."
},
taxas["AliExpress"]
);
square[2] = new Square("Casa de Isenção Fiscal", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    // Mostra um popup informando ao jogador em que casa ele caiu
    popup("Você caiu na Casa de Isenção Fiscal! Escolha uma loja para isentar de impostos por uma rodada.", function() {
        // Após o jogador clicar em "OK" no popup, solicita o nome da loja
        var nomeLoja = prompt("Digite o nome da loja que você deseja isentar:");
        if (nomeLoja) { 
            nomeLoja = nomeLoja.toLowerCase(); 
        } else {
            nomeLoja = "";
        }
        var lojaIndex = square.findIndex(loja => loja.nome.toLowerCase() === nomeLoja && loja.tipo === "loja" && loja.dono === p.index);
        if (lojaIndex !== -1) {
            square[lojaIndex].taxaAtual = 0;
            addAlert(p.nome + " isentou a loja " + square[lojaIndex].nome + " de impostos por uma rodada.");
            finalizarTurno(true);
        } else {
            addAlert("Nome de loja inválido ou você não é o dono da loja.");
        }
    });
});
square[3] = new Square("Shopee", "#FF6347", "loja", 3000, -0.10, 30, {
    descricao: "Fazer uma campanha de marketing que dobra a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " investiu em marketing na Shopee, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Plataforma de e-commerce com forte presença no Sudeste Asiático e em crescimento no Brasil, com foco em produtos de baixo custo e experiência de compra mobile-first. <br><strong>Processos:</strong> Marketplace com integração de pagamentos, entrega e ferramentas de marketing para vendedores. <br><strong>Departamentos:</strong> Operações, Marketing, Tecnologia, Atendimento ao Cliente, Financeiro. <br><strong>Produto/Serviço:</strong> Plataforma de e-commerce com foco em compras mobile. <br><strong>Desafios:</strong> Consolidar a marca no Brasil, enfrentar a concorrência de outros marketplaces, fidelizar vendedores e compradores. <br><strong>Objetivo:</strong> Tornar-se o principal marketplace do Brasil, oferecendo uma experiência de compra completa e acessível."
},
taxas["Shopee"]
);
square[4] = new Square("Casa de Penalidade", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    if (jogadores[turno] && typeof jogadores[turno].pay === 'function') {
        var multa = Math.round(jogadores[turno].money * 0.1);
        jogadores[turno].pay(multa); 
        addAlert(jogadores[turno].nome + " pagou R$" + multa + " de multa por má gestão tributária.");
    } else {
        console.error("Erro na Casa de Penalidade: jogador inválido no turno", turno);
    }
});
square[5] = new Square("Shein", "#DDA0DD", "loja", 1000, -0.20, 35, {
    descricao: "Expandir o catálogo de produtos, o que aumenta a arrecadação base em R$ 500 nas rodadas seguintes.",
    efeito: function (p) {
        p.lojas[5].arrecadacaoBase += 500;
        addAlert(p.nome + " expandiu o catálogo da Shein, aumentando a arrecadação base para R$" + p.lojas[5].arrecadacaoBase + ".");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Varejista online de moda rápida, com foco em roupas femininas a preços acessíveis, conhecido pela ampla variedade de produtos e rápida atualização de tendências. <br><strong>Processos:</strong> Produção em massa, controle de estoque, logística global, marketing digital agressivo. <br><strong>Departamentos:</strong> Design, Produção, Logística, Marketing, Vendas. <br><strong>Produto/Serviço:</strong> Roupas femininas e acessórios de moda. <br><strong>Desafios:</strong> Manter a qualidade dos produtos com produção em larga escala, gerenciar a logística global, lidar com as críticas sobre sustentabilidade. <br><strong>Objetivo:</strong> Aumentar a base de clientes globalmente e expandir para novas categorias de produtos."
},
taxas["Shein"]
);
square[6] = new Square("Casa de Expansão de Taxação", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    p.taxaTotal += 5;
    addAlert(p.nome + " ganhou 5% de taxa adicional.");
});
square[7] = new Square("Pix", "#40E0D0", "loja", 5000, -0.20, 30, {
    descricao: "Implementar transações rápidas, que aumentam a arrecadação em 50% nesta rodada, mas com uma redução de 5% na arrecadação base na próxima rodada.",
    efeito: function (p) {
        p.money += p.lojas[7].arrecadacaoBase * 0.5 * (1 + p.lojas[7].taxaAtual / 100); // Aumenta a arrecadação em 50%
        p.lojas[7].arrecadacaoBase *= 0.95; // Reduz a arrecadação base em 5% para a próxima rodada
        addAlert(p.nome + " implementou transações rápidas no Pix, aumentando a arrecadação em 50% nesta rodada, mas reduzindo a arrecadação base em 5% para a próxima.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Sistema de pagamento instantâneo brasileiro, desenvolvido pelo Banco Central, permite transferências e pagamentos 24/7. <br><strong>Processos:</strong> Integração com instituições financeiras, processamento de transações em tempo real. <br><strong>Departamentos:</strong> Tecnologia, Segurança, Operações, Relações Institucionais. <br><strong>Produto/Serviço:</strong> Sistema de pagamentos instantâneos. <br><strong>Desafios:</strong> Garantir a segurança e a estabilidade do sistema, expandir a aceitação em estabelecimentos comerciais, promover a inclusão financeira. <br><strong>Objetivo:</strong> Tornar-se o principal meio de pagamento no Brasil, facilitando as transações financeiras e modernizando o sistema financeiro."
},
taxas["Pix"]
);
square[8] = new Square("Casa de Bônus de Arrecadação", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    p.money += 5000;
    addAlert(p.nome + " recebeu R$5000 de bônus por boa gestão fiscal.");
});
square[9] = new Square("Mercado Livre", "#FFFF00", "loja", 2500, -0.15, 30, {
    descricao: "Melhorar o suporte ao cliente, aumentando as vendas em 5% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[9].impactoVendas += 0.05;
        addAlert(p.nome + " melhorou o suporte ao cliente do Mercado Livre, diminuindo o impacto negativo da taxa nas vendas em 5%.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Empresa líder em tecnologia para e-commerce e serviços financeiros na América Latina, opera um marketplace com grande variedade de produtos e serviços. <br><strong>Processos:</strong> Marketplace com foco em logística, pagamentos online seguros e soluções financeiras para vendedores e compradores. <br><strong>Departamentos:</strong> Operações, Logística, Tecnologia, Marketing, Financeiro, Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong> Plataforma de e-commerce, soluções de pagamento e crédito. <br><strong>Desafios:</strong> Manter a liderança no mercado latino-americano, expandir a oferta de serviços financeiros, lidar com a concorrência de outros players globais. <br><strong>Objetivo:</strong> Tornar-se uma plataforma digital completa, integrando e-commerce, serviços financeiros e logística em um único ecossistema."
},
taxas["Mercado Livre"]
);
square[10] = new Square("Casa de Auditoria Fiscal", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    for (var i = 1; i < square.length; i++) {
        if (square[i].tipo === "loja" && square[i].dono === p.index && square[i].taxaAtual > 30) {
            p.lojas[i].arrecadacaoBase *= 0.9;
            addAlert("Auditoria Fiscal: A arrecadação da " + square[i].nome + " foi reduzida em 10% por excesso de impostos.");
        }
    }
});
square[11] = new Square("Amazon", "#008000", "loja", 4000, -0.20, 35, {
    descricao: "Melhorar a logística para reduzir a queda nas vendas em 10%.",
    efeito: function (p) {
        p.lojas[11].impactoVendas += 0.10;
        addAlert(p.nome + " melhorou a logística da Amazon, diminuindo o impacto negativo da taxa nas vendas em 10%.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Gigante global de tecnologia, com atuação em e-commerce, computação em nuvem, streaming e inteligência artificial. <br><strong>Processos:</strong> Logística e entrega altamente otimizadas, foco em experiência do cliente e desenvolvimento de tecnologias inovadoras. <br><strong>Departamentos:</strong> Operações, Logística, Tecnologia, Marketing, Vendas,  Atendimento ao Cliente, Pesquisa e Desenvolvimento. <br><strong>Produto/Serviço:</strong> Plataforma de e-commerce, serviços de computação em nuvem, streaming de vídeo e música, dispositivos eletrônicos. <br><strong>Desafios:</strong> Manter a liderança global em diferentes setores, lidar com as críticas sobre práticas trabalhistas e impacto ambiental, expandir para novos mercados. <br><strong>Objetivo:</strong> Tornar-se a empresa mais centrada no cliente do mundo, oferecendo produtos e serviços inovadores e convenientes."
}, 
// Taxa
taxas["Amazon"]
);
square[12] = new Square("Casa de Inovação", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    // Mostra um popup informando ao jogador em que casa ele caiu
    popup("Você caiu na Casa de Inovação! Escolha uma loja para investir em inovação, aumentando a arrecadação em 10% nas próximas rodadas.", function() {
        // Após o jogador clicar em "OK" no popup, solicita o nome da loja
        var nomeLoja = prompt("Digite o nome da loja que você deseja inovar:");
        if (nomeLoja) { 
            nomeLoja = nomeLoja.toLowerCase(); 
        } else {
            nomeLoja = "";
        }
        var lojaIndex = square.findIndex(loja => loja.nome.toLowerCase() === nomeLoja && loja.tipo === "loja" && loja.dono === p.index);
        if (lojaIndex !== -1) {
            p.lojas[lojaIndex].arrecadacaoBase *= 1.1;
            addAlert(p.nome + " investiu em inovação na loja " + square[lojaIndex].nome + ", aumentando a arrecadação em 10% nas próximas rodadas.");
            finalizarTurno(true);
        } else {
            addAlert("Nome de loja inválido ou você não é o dono da loja.");
        }
    });
});
square[13] = new Square("Americanas", "#800000", "loja", 1500, -0.30, 40, {
    descricao: "Reduzir as taxas em 5% para aumentar as vendas em 15%.",
    efeito: function (p) {
        p.lojas[13].taxaAtual -= 5;
        p.lojas[13].impactoVendas += 0.15;
        addAlert(p.nome + " reduziu as taxas da Americanas em 5% para aumentar as vendas em 15%.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Tradicional varejista brasileira, com lojas físicas e online, oferece ampla variedade de produtos, de eletrônicos a vestuário. <br><strong>Processos:</strong> Gestão de lojas físicas e online, logística e entrega, marketing e vendas omnichannel. <br><strong>Departamentos:</strong> Vendas, Marketing, Operações, Logística, Tecnologia,  Atendimento ao Cliente, Recursos Humanos. <br><strong>Produto/Serviço:</strong> Varejo de produtos diversos. <br><strong>Desafios:</strong> Adaptar-se às novas tecnologias e ao e-commerce, integrar as operações online e offline, competir com novos players digitais. <br><strong>Objetivo:</strong> Manter a relevância no mercado brasileiro, oferecendo uma experiência de compra completa e integrada."
}, 
// Taxa
taxas["Americanas"]
);
square[14] = new Square("Casa de Crise Econômica", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    for (var i = 1; i < square.length; i++) {
        if (square[i].tipo === "loja") {
            square[i].arrecadacaoBase *= 0.85;
            addAlert("Crise Econômica: A arrecadação da " + square[i].nome + " foi reduzida em 15%.");
        }
    }
});
square[15] = new Square("Netshoes", "#000080", "loja", 3000, -0.15, 25, {
    descricao: "Investir em tecnologia para melhorar a experiência de compra, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " investiu em tecnologia na Netshoes, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Varejista online de artigos esportivos, com foco em calçados, roupas e equipamentos esportivos de diversas marcas. <br><strong>Processos:</strong> E-commerce com foco em experiência do cliente, logística especializada em produtos esportivos, marketing direcionado a públicos específicos. <br><strong>Departamentos:</strong> Vendas, Marketing, Logística, Tecnologia, Atendimento ao Cliente, Compras. <br><strong>Produto/Serviço:</strong> Artigos esportivos de diversas marcas. <br><strong>Desafios:</strong> Manter a liderança no mercado de artigos esportivos online, oferecer uma experiência de compra personalizada, lidar com a sazonalidade do mercado. <br><strong>Objetivo:</strong> Tornar-se a referência em artigos esportivos online, oferecendo a maior variedade de produtos e a melhor experiência de compra para os clientes."
},
taxas["Netshoes"]
);
square[16] = new Square("Casa de Investimento Estrangeiro", "#FFFFFF", "especial", 0, 0, 0, function (p) {
    // Mostra um popup informando ao jogador em que casa ele caiu
    popup("Você caiu na Casa de Investimento Estrangeiro! Escolha uma loja para receber um investimento que aumentará sua arrecadação em 20% na próxima rodada.", function() {
        // Após o jogador clicar em "OK" no popup, solicita o nome da loja
        var nomeLoja = prompt("Digite o nome da loja que você deseja receber o investimento:");
        if (nomeLoja) { 
            nomeLoja = nomeLoja.toLowerCase(); 
        } else {
            nomeLoja = "";
        }
        var lojaIndex = square.findIndex(loja => loja.nome.toLowerCase() === nomeLoja && loja.tipo === "loja" && loja.dono === p.index);
        if (lojaIndex !== -1) {
            p.lojas[lojaIndex].proximoBonusInvestimento = true;
            addAlert(p.nome + " atraiu investimento estrangeiro para a loja " + square[lojaIndex].nome + ", aumentando a arrecadação em 20% na próxima rodada.");
            finalizarTurno(true);
        } else {
            addAlert("Nome de loja inválido ou você não é o dono da loja.");
        }
    });
});
square[17] = new Square("iFood", "#32CD32", "loja", 4000, -0.10, 30, {
    descricao: "Investir em inovações tecnológicas, aumentando as vendas em 20% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[17].arrecadacaoBase *= 1.2; 
        addAlert(p.nome + " investiu em inovações tecnológicas no iFood, aumentando as vendas em 20% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Plataforma líder em delivery de comida online na América Latina, conecta restaurantes e clientes, oferecendo opções variadas de restaurantes e facilidade de pedido. <br><strong>Processos:</strong> Marketplace com foco em tecnologia, logística de entrega rápida, marketing e parcerias com restaurantes. <br><strong>Departamentos:</strong> Tecnologia, Operações, Logística, Marketing, Vendas,  Atendimento ao Cliente,  Relações com Restaurantes. <br><strong>Produto/Serviço:</strong> Plataforma de delivery de comida online. <br><strong>Desafios:</strong> Manter a liderança no mercado de food delivery, expandir para novas categorias de delivery, garantir a qualidade dos serviços prestados pelos restaurantes parceiros. <br><strong>Objetivo:</strong> Tornar-se a plataforma líder em delivery online, oferecendo a melhor experiência para clientes e restaurantes."
},
taxas["iFood"]
);
square[18] = new Square("eBay", "#FFD700", "loja", 2500, -0.20, 30, {
    descricao: "Investir em expansão internacional, aumentando as vendas em 25% na próxima rodada.",
    efeito: function (p) {
        p.lojas[18].arrecadacaoBase *= 1.25;
        addAlert(p.nome + " expandiu o eBay internacionalmente, aumentando as vendas em 25% na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Pionera no e-commerce global, conecta compradores e vendedores do mundo todo, com foco em leilões online e venda de produtos novos e usados. <br><strong>Processos:</strong> Marketplace com sistema de leilões, pagamentos online, ferramentas para vendedores e sistema de reputação para compradores e vendedores. <br><strong>Departamentos:</strong> Operações, Tecnologia, Marketing, Vendas, Atendimento ao Cliente, Segurança. <br><strong>Produto/Serviço:</strong> Plataforma de e-commerce com foco em leilões e venda de produtos diversos. <br><strong>Desafios:</strong> Manter a relevância em um mercado cada vez mais competitivo, adaptar-se às novas tendências de e-commerce, lidar com fraudes e disputas entre compradores e vendedores. <br><strong>Objetivo:</strong> Reconquistar a liderança no mercado global de e-commerce, oferecendo uma plataforma segura, confiável e inovadora para compradores e vendedores."
}, 
// Taxa
taxas["eBay"]
);
square[19] = new Square("Growth", "#87CEEB", "loja", 1000, -0.20, 25, {
    descricao: "Aumentar a produção, aumentando a arrecadação base em R$500.",
    efeito: function (p) {
        p.lojas[19].arrecadacaoBase += 500;
        addAlert(p.nome + " aumentou a produção da Growth, aumentando a arrecadação base para R$" + p.lojas[19].arrecadacaoBase + ".");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Startup fictícia em fase de crescimento acelerado, com foco em soluções inovadoras de tecnologia para o mercado financeiro. <br><strong>Processos:</strong> Desenvolvimento ágil de software, foco em inovação e escalabilidade, busca por investimento para expansão. <br><strong>Departamentos:</strong> Tecnologia, Produto, Marketing, Vendas,  Recursos Humanos. <br><strong>Produto/Serviço:</strong> Software para gestão de investimentos. <br><strong>Desafios:</strong> Desenvolver um produto escalável e competitivo, atrair investimento para financiar o crescimento, lidar com a rápida expansão da equipe. <br><strong>Objetivo:</strong> Consolidar-se como líder no mercado de tecnologia financeira, oferecendo soluções inovadoras e disruptivas."
}, 
// Taxa
taxas["Growth"] 
);
square[20] = new Square("PARADA LIVRE", "#FFFFFF", "paradaLivre");
square[21] = new Square("Netflix", "#E62020", "loja", 4000, -0.15, 30, {
    descricao: "Investir em conteúdo original, aumentando a arrecadação base em R$1000.",
    efeito: function (p) {
        p.lojas[21].arrecadacaoBase += 1000;
        addAlert(p.nome + " investiu em conteúdo original na Netflix, aumentando a arrecadação base para R$" + p.lojas[21].arrecadacaoBase + ".");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Plataforma global de streaming de vídeo, oferece filmes, séries e documentários, com foco em conteúdo original e personalizado. <br><strong>Processos:</strong> Produção de conteúdo original, licenciamento de conteúdo, desenvolvimento de tecnologias de streaming, marketing digital e análise de dados para personalização. <br><strong>Departamentos:</strong> Conteúdo, Produção, Tecnologia, Marketing,  Dados. <br><strong>Produto/Serviço:</strong> Streaming de vídeo por assinatura. <br><strong>Desafios:</strong> Manter o crescimento da base de assinantes, competir com outros serviços de streaming, produzir conteúdo original de alta qualidade, expandir para novos mercados. <br><strong>Objetivo:</strong> Tornar-se o principal serviço de entretenimento do mundo, oferecendo conteúdo diversificado e personalizado para todos os públicos."
}, 
// Taxa
taxas["Netflix"] 
);
square[22] = new Square("Disney+", "#00FFFF", "loja", 3500, -0.20, 40, {
    descricao: "Lançar um plano familiar, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " lançou um plano familiar no Disney+, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Serviço de streaming de vídeo da Disney, oferece filmes, séries e desenhos animados da Disney, Pixar, Marvel, Star Wars e National Geographic. <br><strong>Processos:</strong>  Licenciamento e produção de conteúdo, desenvolvimento de tecnologias de streaming, marketing digital. <br><strong>Departamentos:</strong> Conteúdo, Produção, Tecnologia, Marketing. <br><strong>Produto/Serviço:</strong> Streaming de vídeo por assinatura. <br><strong>Desafios:</strong>  Competir com outros serviços de streaming, expandir a base de assinantes globalmente, produzir conteúdo original que atraia diferentes públicos. <br><strong>Objetivo:</strong> Tornar-se um dos principais serviços de streaming do mundo, oferecendo conteúdo familiar e de alta qualidade."
}, 
// Taxa
taxas["Disney+"] 
);
square[23] = new Square("TikTok", "#FE325A", "loja", 3000, -0.15, 30, {
    descricao: "Fechar uma parceria com influenciadores, dobrando a arrecadação nas próximas rodadas.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " fechou uma parceria com influenciadores no TikTok, dobrando a arrecadação nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Rede social de vídeos curtos, popular entre jovens, permite criar, compartilhar e assistir a vídeos curtos de diversos gêneros. <br><strong>Processos:</strong>  Desenvolvimento de tecnologias de criação e compartilhamento de vídeos, moderação de conteúdo, marketing e parcerias com criadores de conteúdo. <br><strong>Departamentos:</strong> Tecnologia, Produto, Marketing, Comunidade. <br><strong>Produto/Serviço:</strong> Rede social de vídeos curtos. <br><strong>Desafios:</strong>  Manter o engajamento dos usuários, lidar com questões de privacidade e segurança, monetizar a plataforma. <br><strong>Objetivo:</strong> Tornar-se a principal plataforma de entretenimento para a geração Z, impulsionando a criatividade e a conexão entre as pessoas."
}, 
// Taxa
taxas["TikTok"] 
);
square[24] = new Square("Kwai", "#FF0000", "loja", 3500, -0.20, 30, {
    descricao: "Investir em ferramentas de criação de conteúdo, aumentando a arrecadação em 10% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[24].arrecadacaoBase *= 1.1;
        addAlert(p.nome + " investiu em ferramentas de criação de conteúdo no Kwai, aumentando a arrecadação em 10% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Rede social de vídeos curtos, com foco em mercados emergentes, oferece recompensas financeiras para criadores de conteúdo. <br><strong>Processos:</strong>  Desenvolvimento de tecnologias de criação e compartilhamento de vídeos, sistema de recompensas, marketing e parcerias com criadores de conteúdo. <br><strong>Departamentos:</strong> Tecnologia, Produto, Marketing, Comunidade. <br><strong>Produto/Serviço:</strong> Rede social de vídeos curtos com programa de recompensas. <br><strong>Desafios:</strong>  Competir com o TikTok, atrair e fidelizar criadores de conteúdo, expandir para novos mercados. <br><strong>Objetivo:</strong> Tornar-se a principal rede social de vídeos curtos em mercados emergentes, democratizando o acesso à criação de conteúdo e oferecendo oportunidades de monetização."
}, 
// Taxa
taxas["Kwai"] 
);
square[25] = new Square("Uber", "#0000FF", "loja", 3000, -0.25, 35, {
    descricao: "Investir em carros autônomos, aumentando a arrecadação em 30% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[25].arrecadacaoBase *= 1.3;
        addAlert(p.nome + " investiu em carros autônomos na Uber, aumentando a arrecadação em 30% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Plataforma de transporte privado urbano, conecta motoristas e passageiros, oferecendo corridas convenientes e acessíveis. <br><strong>Processos:</strong>  Desenvolvimento de aplicativo, gerenciamento de motoristas, sistema de pagamentos, atendimento ao cliente. <br><strong>Departamentos:</strong> Tecnologia, Operações, Marketing, Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong> Transporte privado urbano por aplicativo. <br><strong>Desafios:</strong> Lidar com a regulamentação do transporte privado, garantir a segurança de passageiros e motoristas, competir com outros serviços de transporte, desenvolver tecnologias de carros autônomos. <br><strong>Objetivo:</strong> Revolucionar o transporte urbano, oferecendo um serviço mais eficiente, acessível e sustentável."
}, 
// Taxa
taxas["Uber"] 
);
square[26] = new Square("Casas Bahia", "#808080", "loja", 2000, -0.20, 35, {
    descricao: "Iniciar uma campanha de descontos, aumentando as vendas em 15% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[26].impactoVendas += 0.15;
        addAlert(p.nome + " iniciou uma campanha de descontos nas Casas Bahia, aumentando as vendas em 15% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Tradicional varejista brasileira, com foco em eletrodomésticos, móveis e eletrônicos, com forte presença em lojas físicas e online. <br><strong>Processos:</strong> Gestão de lojas físicas e online, logística e entrega, marketing e vendas omnichannel, crédito e financiamento para clientes. <br><strong>Departamentos:</strong> Vendas, Marketing, Operações, Logística,  Financeiro, Atendimento ao Cliente, Recursos Humanos. <br><strong>Produto/Serviço:</strong> Varejo de eletrodomésticos, móveis e eletrônicos. <br><strong>Desafios:</strong> Manter a competitividade em um mercado em constante mudança, integrar as operações online e offline, oferecer um bom serviço de atendimento ao cliente, gerenciar o risco de crédito. <br><strong>Objetivo:</strong> Consolidar a liderança no mercado brasileiro de varejo, oferecendo a melhor experiência de compra para os clientes."
}, 
// Taxa
taxas["Casas Bahia"] 
);
square[27] = new Square("Zara", "#FFC300", "loja", 3500, -0.25, 40, {
    descricao: "Expandir o marketing digital, aumentando as vendas em 15% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[27].arrecadacaoBase *= 1.15;
        addAlert(p.nome + " expandiu o marketing digital da Zara, aumentando as vendas em 15% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Gigante espanhol de moda rápida, com lojas físicas em todo o mundo, conhecido pela rápida adaptação às tendências e produção eficiente. <br><strong>Processos:</strong> Design, produção, logística verticalmente integrada, controle de estoque, foco em experiência do cliente em lojas físicas. <br><strong>Departamentos:</strong> Design, Produção, Logística, Vendas, Marketing. <br><strong>Produto/Serviço:</strong> Roupas e acessórios de moda. <br><strong>Desafios:</strong>  Manter o ritmo de produção e entrega, adaptar-se às novas tecnologias e ao e-commerce, lidar com as críticas sobre sustentabilidade. <br><strong>Objetivo:</strong>  Manter a liderança no mercado global de moda rápida, oferecendo produtos de alta qualidade e design a preços acessíveis."
}, 
// Taxa
taxas["Zara"] 
);
square[28] = new Square("WebMotors", "#800080", "loja", 3000, -0.20, 30, {
    descricao: "Investir em otimização da plataforma, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " otimizou a plataforma da WebMotors, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Plataforma online líder em classificados de veículos no Brasil, conecta compradores e vendedores de carros, motos e outros veículos. <br><strong>Processos:</strong>  Gerenciamento de anúncios, desenvolvimento de tecnologias para pesquisa e comparação de veículos, marketing e vendas. <br><strong>Departamentos:</strong> Tecnologia, Produto, Marketing, Vendas,  Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong>  Plataforma online de classificados de veículos. <br><strong>Desafios:</strong>  Manter a liderança no mercado, enfrentar a concorrência de novas plataformas, oferecer uma experiência de usuário completa e intuitiva. <br><strong>Objetivo:</strong>  Tornar-se a plataforma definitiva para compra, venda e pesquisa de veículos no Brasil, conectando compradores e vendedores de forma eficiente."
}, 
// Taxa
taxas["WebMotors"] 
);
square[29] = new Square("LG", "#228B22", "loja", 4000, -0.25, 35, {
    descricao: "Investir em pesquisa e desenvolvimento, aumentando o valor arrecadado em 20% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[29].arrecadacaoBase *= 1.2;
        addAlert(p.nome + " investiu em pesquisa e desenvolvimento na LG, aumentando a arrecadação em 20% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Multinacional sul-coreana de eletrônicos, produz e comercializa smartphones, TVs, eletrodomésticos e outros produtos. <br><strong>Processos:</strong>  Produção em massa, pesquisa e desenvolvimento de novas tecnologias, logística global, marketing e vendas. <br><strong>Departamentos:</strong>  Produção, Pesquisa e Desenvolvimento, Logística, Marketing, Vendas,  Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong>  Eletrônicos e eletrodomésticos. <br><strong>Desafios:</strong>  Competir com outras marcas globais de eletrônicos, inovar constantemente para oferecer produtos diferenciados, lidar com as flutuações do mercado global. <br><strong>Objetivo:</strong> Consolidar-se como uma marca líder em tecnologia e inovação, oferecendo produtos de alta qualidade e design."
}, 
// Taxa
taxas["LG"] 
);
square[30] = new Square("VÁ PARA A CADEIA", "#FFFFFF", "cadeia");
square[31] = new Square("Samsung", "#00CED1", "loja", 3500, -0.15, 30, {
    descricao: "Investir em inovação de produtos, dobrando o valor arrecadado nas próximas rodadas.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " inovou nos produtos da Samsung, dobrando a arrecadação nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Multinacional sul-coreana de eletrônicos, líder global em smartphones, TVs, chips de memória e outros produtos. <br><strong>Processos:</strong>  Produção em massa, pesquisa e desenvolvimento de novas tecnologias, logística global, marketing e vendas. <br><strong>Departamentos:</strong>  Produção, Pesquisa e Desenvolvimento, Logística, Marketing, Vendas,  Atendimento ao Cliente. <br><strong>Produto/Serviço:</strong>  Eletrônicos e eletrodomésticos. <br><strong>Desafios:</strong>  Manter a liderança global em um mercado competitivo, inovar constantemente para oferecer produtos de ponta, lidar com questões de segurança e privacidade de dados. <br><strong>Objetivo:</strong>  Inspirar o mundo com tecnologias inovadoras que criem um futuro melhor."
}, 
// Taxa
taxas["Samsung"] 
);
square[32] = new Square("Natura", "#6B8E23", "loja", 2000, -0.15, 25, {
    descricao: "Investir em sustentabilidade, aumentando as vendas em 15% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[32].arrecadacaoBase *= 1.15;
        addAlert(p.nome + " investiu em sustentabilidade na Natura, aumentando as vendas em 15% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Empresa brasileira de cosméticos, com foco em produtos naturais e sustentáveis, atua com venda direta e lojas físicas.<br><strong>Processos:</strong> Desenvolvimento de produtos com ingredientes naturais, produção sustentável, logística, venda direta por meio de consultoras, marketing e branding.<br><strong>Departamentos:</strong> Pesquisa e Desenvolvimento, Produção, Logística, Vendas, Marketing, Sustentabilidade.<br><strong>Produto/Serviço:</strong> Cosméticos, produtos de higiene pessoal e perfumaria.<br><strong>Desafios:</strong> Manter o compromisso com a sustentabilidade, expandir a venda direta e o e-commerce, inovar em produtos e embalagens.<br><strong>Objetivo:</strong>  Promover o bem-estar bem, um conceito que une o bem estar pessoal ao bem estar coletivo, por meio de seus produtos e práticas sustentáveis."
},
// Taxa
taxas["Natura"] 
);
square[33] = new Square("Avon", "#FFA07A", "loja", 2500, -0.10, 30, {
    descricao: "Aumentar a rede de revendedores, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " expandiu a rede de revendedores da Avon, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Empresa multinacional de cosméticos, com foco em venda direta por meio de revendedoras, oferece produtos de beleza, higiene pessoal e perfumaria.<br><strong>Processos:</strong> Produção, logística, treinamento e gerenciamento de revendedoras, marketing e campanhas de venda.<br><strong>Departamentos:</strong> Produção, Logística, Vendas, Marketing,  Recursos Humanos.<br><strong>Produto/Serviço:</strong> Cosméticos, produtos de higiene pessoal e perfumaria.<br><strong>Desafios:</strong> Adaptar-se ao e-commerce e às novas tecnologias, fortalecer a rede de revendedoras, inovar em produtos e estratégias de venda.<br><strong>Objetivo:</strong> Empoderar as mulheres por meio de oportunidades de negócio e produtos de beleza que promovem a autoestima."
}, 
// Taxa
taxas["Avon"] 
);
square[34] = new Square("O'Boticário", "#FA8072", "loja", 1500, -0.10, 20, {
    descricao: "Aumentar a produção nacional, aumentando as vendas em 15% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[34].arrecadacaoBase *= 1.15;
        addAlert(p.nome + " aumentou a produção nacional do O'Boticário, aumentando as vendas em 15% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Empresa brasileira de cosméticos, perfumaria e produtos de higiene pessoal, com forte presença em lojas físicas e online.<br><strong>Processos:</strong> Desenvolvimento de produtos, produção, logística, gestão de lojas físicas e online, marketing e branding.<br><strong>Departamentos:</strong> Pesquisa e Desenvolvimento, Produção, Logística, Vendas, Marketing,  Recursos Humanos.<br><strong>Produto/Serviço:</strong> Cosméticos, perfumaria e produtos de higiene pessoal.<br><strong>Desafios:</strong> Manter a qualidade dos produtos, inovar em fragrâncias e produtos, fortalecer a presença online, expandir para novos mercados.<br><strong>Objetivo:</strong>  Despertar a beleza e a autoexpressão nas pessoas, por meio de produtos e experiências sensoriais."
}, 
// Taxa
taxas["O'Boticário"] 
);
square[35] = new Square("Renner", "#DA70D6", "loja", 3000, -0.20, 40, {
    descricao: "Expandir a presença online, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " expandiu a presença online da Renner, dobrando a arrecadação na próxima rodada.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Varejista brasileira de moda, com foco em roupas, calçados e acessórios, atua com lojas físicas e online. <br><strong>Processos:</strong>  Design, produção, logística, gestão de lojas físicas e online, marketing e vendas omnichannel. <br><strong>Departamentos:</strong>  Design, Produção, Logística, Vendas, Marketing, Tecnologia,  Atendimento ao Cliente, Recursos Humanos. <br><strong>Produto/Serviço:</strong>  Roupas, calçados e acessórios de moda. <br><strong>Desafios:</strong>  Competir com outros varejistas de moda, adaptar-se às novas tendências e ao e-commerce, oferecer uma experiência de compra integrada. <br><strong>Objetivo:</strong>  Ser a marca de moda preferida dos brasileiros, oferecendo produtos de qualidade e estilo a preços acessíveis."
}, 
// Taxa
taxas["Renner"] 
);
square[36] = new Square("AirBnB", "#FF5733", "loja", 2000, -0.15, 30, {
    descricao: "Investir em parcerias locais, aumentando as reservas e a arrecadação em R$500.",
    efeito: function (p) {
        p.lojas[36].arrecadacaoBase += 500;
        addAlert(p.nome + " investiu em parcerias locais no AirBnB, aumentando as reservas e a arrecadação futura.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong> Plataforma online de aluguel de acomodações por temporada, conecta viajantes e anfitriões, oferecendo opções diversas de hospedagem. <br><strong>Processos:</strong>  Gerenciamento de anúncios, sistema de reservas, pagamentos online, atendimento ao cliente, garantia para anfitriões e viajantes. <br><strong>Departamentos:</strong> Tecnologia, Produto, Marketing, Atendimento ao Cliente,  Comunidade. <br><strong>Produto/Serviço:</strong>  Plataforma online de aluguel de acomodações por temporada. <br><strong>Desafios:</strong>  Lidar com a regulamentação do aluguel por temporada, garantir a segurança de anfitriões e viajantes, expandir para novos mercados, desenvolver novas funcionalidades e serviços. <br><strong>Objetivo:</strong>  Criar um mundo onde qualquer pessoa possa pertencer a qualquer lugar, conectando pessoas por meio de viagens e experiências autênticas."
}, 
// Taxa
taxas["AirBnB"] 
);
square[37] = new Square("C&A", "#FFB6C1", "loja", 2500, -0.15, 35, {
    descricao: "Expandir o varejo digital, aumentando as vendas em 15% nas próximas rodadas.",
    efeito: function (p) {
        p.lojas[37].arrecadacaoBase *= 1.15;
        addAlert(p.nome + " expandiu o varejo digital da C&A, aumentando as vendas em 15% nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Varejista internacional de moda, com foco em roupas e acessórios para toda a família, com forte presença em lojas físicas e online.<br><strong>Processos:</strong>  Design, produção, logística, gestão de lojas físicas e online, marketing e vendas omnichannel.<br><strong>Departamentos:</strong>  Design, Produção, Logística, Vendas, Marketing, Tecnologia,  Atendimento ao Cliente, Recursos Humanos.<br><strong>Produto/Serviço:</strong>  Roupas e acessórios de moda.<br><strong>Desafios:</strong>  Competir com outros varejistas de moda, adaptar-se às novas tendências e ao e-commerce, fortalecer a presença digital.<br><strong>Objetivo:</strong>  Oferecer moda acessível e inspiradora para todos."
}, 
// Taxa
taxas["C&A"] 
);
square[38] = new Square("Kabum", "#7B68EE", "loja", 3500, -0.15, 40, {
    descricao: "Investir em otimização logística, dobrando a arrecadação na próxima rodada.",
    efeito: function (p) {
        p.proximaArrecadacaoDobrada = true;
        addAlert(p.nome + " otimizou a logística do Kabum, dobrando a arrecadação nas próximas rodadas.");
    },
    descricaoLoja: "<br><strong>Descrição da Empresa:</strong>  Varejista online brasileiro de tecnologia e eletrônicos, com foco em computadores, smartphones, games e outros produtos. <br><strong>Processos:</strong>  E-commerce, logística e entrega rápida, atendimento ao cliente especializado em tecnologia, marketing e vendas online. <br><strong>Departamentos:</strong>  Vendas, Marketing, Logística, Tecnologia,  Atendimento ao Cliente,  Compras. <br><strong>Produto/Serviço:</strong>  Produtos de tecnologia e eletrônicos. <br><strong>Desafios:</strong>  Competir com outros varejistas de tecnologia, lidar com a rápida obsolescência de produtos tecnológicos, oferecer preços competitivos e entregas rápidas. <br><strong>Objetivo:</strong>  Ser a principal referência em tecnologia e games para os consumidores brasileiros, oferecendo a melhor experiência de compra online."
}, 
// Taxa
taxas["Kabum"] 
);
square[39] = new Square("IMPOSTO DE LUXO", "#FFFFFF", "impostoLuxo", 100);

var cartasEvento = [];

// Cartas de aumento de arrecadação:
cartasEvento.push(new Card("Aumento na demanda online! A arrecadação de todas as lojas aumenta em 10% nesta rodada.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			square[i].arrecadacaoBase *= 1.1; 
		}
	}
}));

cartasEvento.push(new Card("Inflação! A arrecadação base de todas as lojas aumenta em 5%.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			square[i].arrecadacaoBase *= 1.05; 
		}
	}
}));

// Cartas de redução de arrecadação:
cartasEvento.push(new Card("Crise no mercado internacional! A arrecadação base de todas as lojas diminui em 10% nesta rodada.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			square[i].arrecadacaoBase *= 0.9; 
		}
	}
}));

cartasEvento.push(new Card("Escândalo de sonegação fiscal! As lojas com taxa acima de 30% tem sua arrecadação base reduzida em 15% nesta rodada.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja" && square[i].taxaAtual > 30) {
			square[i].arrecadacaoBase *= 0.85; 
		}
	}
}));

cartasEvento.push(new Card("Nova legislação tributária! A taxa máxima permitida para todas as lojas é reduzida em 5% até o fim do jogo.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			square[i].limiteTaxacao -= 5; 
		}
	}
}));

// Cartas de impacto nas vendas:
cartasEvento.push(new Card("Black Friday! As vendas de todas as lojas aumentam em 20% nesta rodada.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			p.lojas[i].impactoVendas += 0.2; 
		}
	}
}));

cartasEvento.push(new Card("Recessão econômica! As vendas de todas as lojas caem 10% nesta rodada.", function(p) {
	for (var i = 1; i < square.length; i++) {
		if (square[i].tipo === "loja") {
			p.lojas[i].impactoVendas -= 0.1;
		}
	}
}));

// Cartas de bônus para o jogador:
cartasEvento.push(new Card("Você encontrou uma brecha fiscal! Ganhe 10% de taxa adicional para usar neste turno.", function(p) {
	p.taxaTotal += 10;
}));

// Carta de Evento
cartasEvento.push(new Card("Investimento em tecnologia! Escolha uma loja para ter sua arrecadação base aumentada em 15% até o final do jogo.", function(p) {
    var nomeLoja = prompt("Digite o nome da loja que você deseja aumentar a arrecadação:");
    if (nomeLoja) { 
        nomeLoja = nomeLoja.toLowerCase(); 
    } else {
        nomeLoja = "";
    }
    var lojaIndex = square.findIndex(loja => loja.nome.toLowerCase() === nomeLoja && loja.tipo === "loja" && loja.dono === p.index);
    if (lojaIndex !== -1) {
        p.lojas[lojaIndex].arrecadacaoBase *= 1.15;
    } else {
        addAlert("Nome de loja inválido ou você não é o dono da loja.");
    }
}));

// AliExpress
cartasEscolhaSecundaria[1] = new Card("Investir em logística na AliExpress.", function (p) {
    p.lojas[1].impactoVendas += 0.10;
    addAlert(p.nome + " investiu em logística na AliExpress, diminuindo o impacto negativo da taxa nas vendas em 10%.");
    finalizarTurno(true); // Finaliza o turno após executar a escolha secundária
});

// Shopee
cartasEscolhaSecundaria[3] = new Card("Fazer uma campanha de marketing na Shopee.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " investiu em marketing na Shopee, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// Shein
cartasEscolhaSecundaria[5] = new Card("Expandir o catálogo de produtos da Shein.", function (p) {
    p.lojas[5].arrecadacaoBase += 500;
    addAlert(p.nome + " expandiu o catálogo da Shein, aumentando a arrecadação base para R$" + p.lojas[5].arrecadacaoBase + ".");
    finalizarTurno(true); 
});

// Pix
cartasEscolhaSecundaria[7] = new Card("Implementar transações rápidas no Pix.", function (p) {
    p.money += p.lojas[7].arrecadacaoBase * 0.5 * (1 + p.lojas[7].taxaAtual / 100);
    p.lojas[7].arrecadacaoBase *= 0.95;
    addAlert(p.nome + " implementou transações rápidas no Pix, aumentando a arrecadação em 50% nesta rodada, mas reduzindo a arrecadação base em 5% para a próxima.");
    finalizarTurno(true); 
});

// Mercado Livre
cartasEscolhaSecundaria[9] = new Card("Melhorar o suporte ao cliente do Mercado Livre.", function (p) {
    p.lojas[9].impactoVendas += 0.05;
    addAlert(p.nome + " melhorou o suporte ao cliente do Mercado Livre, diminuindo o impacto negativo da taxa nas vendas em 5%.");
    finalizarTurno(true); 
});

// Amazon
cartasEscolhaSecundaria[11] = new Card("Melhorar a logística da Amazon.", function (p) {
    p.lojas[11].impactoVendas += 0.10;
    addAlert(p.nome + " melhorou a logística da Amazon, diminuindo o impacto negativo da taxa nas vendas em 10%.");
    finalizarTurno(true); 
});

// Americanas
cartasEscolhaSecundaria[13] = new Card("Reduzir as taxas em 5% para aumentar as vendas em 15% na Americanas.", function (p) {
    p.lojas[13].taxaAtual -= 5;
    p.lojas[13].impactoVendas += 0.15;
    addAlert(p.nome + " reduziu as taxas da Americanas em 5% para aumentar as vendas em 15%.");
    finalizarTurno(true); 
});

// Netshoes
cartasEscolhaSecundaria[15] = new Card("Investir em tecnologia na Netshoes.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " investiu em tecnologia na Netshoes, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// iFood
cartasEscolhaSecundaria[17] = new Card("Investir em inovações tecnológicas no iFood.", function (p) {
    p.lojas[17].arrecadacaoBase *= 1.2;
    addAlert(p.nome + " investiu em inovações tecnológicas no iFood, aumentando as vendas em 20% nas próximas rodadas.");
    finalizarTurno(true); 
});

// eBay
cartasEscolhaSecundaria[18] = new Card("Investir em expansão internacional no eBay.", function (p) {
    p.lojas[18].arrecadacaoBase *= 1.25;
    addAlert(p.nome + " expandiu o eBay internacionalmente, aumentando as vendas em 25% na próxima rodada.");
    finalizarTurno(true); 
});

// Growth
cartasEscolhaSecundaria[19] = new Card("Aumentar a produção da Growth.", function (p) {
    p.lojas[19].arrecadacaoBase += 500;
    addAlert(p.nome + " aumentou a produção da Growth, aumentando a arrecadação base para R$" + p.lojas[19].arrecadacaoBase + ".");
    finalizarTurno(true); 
});

// Netflix
cartasEscolhaSecundaria[21] = new Card("Investir em conteúdo original na Netflix.", function (p) {
    p.lojas[21].arrecadacaoBase += 1000;
    addAlert(p.nome + " investiu em conteúdo original na Netflix, aumentando a arrecadação base para R$" + p.lojas[21].arrecadacaoBase + ".");
    finalizarTurno(true); 
});

// Disney+
cartasEscolhaSecundaria[22] = new Card("Lançar um plano familiar no Disney+.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " lançou um plano familiar no Disney+, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// TikTok
cartasEscolhaSecundaria[23] = new Card("Fechar uma parceria com influenciadores no TikTok.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " fechou uma parceria com influenciadores no TikTok, dobrando a arrecadação nas próximas rodadas.");
    finalizarTurno(true); 
});

// Kwai
cartasEscolhaSecundaria[24] = new Card("Investir em ferramentas de criação de conteúdo no Kwai.", function (p) {
    p.lojas[24].arrecadacaoBase *= 1.1;
    addAlert(p.nome + " investiu em ferramentas de criação de conteúdo no Kwai, aumentando a arrecadação em 10% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Uber
cartasEscolhaSecundaria[25] = new Card("Investir em carros autônomos na Uber.", function (p) {
    p.lojas[25].arrecadacaoBase *= 1.3;
    addAlert(p.nome + " investiu em carros autônomos na Uber, aumentando a arrecadação em 30% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Casas Bahia
cartasEscolhaSecundaria[26] = new Card("Iniciar uma campanha de descontos nas Casas Bahia.", function (p) {
    p.lojas[26].impactoVendas += 0.15;
    addAlert(p.nome + " iniciou uma campanha de descontos nas Casas Bahia, aumentando as vendas em 15% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Zara
cartasEscolhaSecundaria[27] = new Card("Expandir o marketing digital da Zara.", function (p) {
    p.lojas[27].arrecadacaoBase *= 1.15;
    addAlert(p.nome + " expandiu o marketing digital da Zara, aumentando as vendas em 15% nas próximas rodadas.");
    finalizarTurno(true); 
});

// WebMotors
cartasEscolhaSecundaria[28] = new Card("Investir em otimização da plataforma da WebMotors.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " otimizou a plataforma da WebMotors, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// LG
cartasEscolhaSecundaria[29] = new Card("Investir em pesquisa e desenvolvimento na LG.", function (p) {
    p.lojas[29].arrecadacaoBase *= 1.2;
    addAlert(p.nome + " investiu em pesquisa e desenvolvimento na LG, aumentando a arrecadação em 20% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Samsung
cartasEscolhaSecundaria[31] = new Card("Investir em inovação de produtos da Samsung.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " inovou nos produtos da Samsung, dobrando a arrecadação nas próximas rodadas.");
    finalizarTurno(true); 
});

// Natura
cartasEscolhaSecundaria[32] = new Card("Investir em sustentabilidade na Natura.", function (p) {
    p.lojas[32].arrecadacaoBase *= 1.15;
    addAlert(p.nome + " investiu em sustentabilidade na Natura, aumentando as vendas em 15% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Avon
cartasEscolhaSecundaria[33] = new Card("Aumentar a rede de revendedores da Avon.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " expandiu a rede de revendedores da Avon, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// O'Boticário
cartasEscolhaSecundaria[34] = new Card("Aumentar a produção nacional do O'Boticário.", function (p) {
    p.lojas[34].arrecadacaoBase *= 1.15;
    addAlert(p.nome + " aumentou a produção nacional do O'Boticário, aumentando as vendas em 15% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Renner
cartasEscolhaSecundaria[35] = new Card("Expandir a presença online da Renner.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " expandiu a presença online da Renner, dobrando a arrecadação na próxima rodada.");
    finalizarTurno(true); 
});

// AirBnB
cartasEscolhaSecundaria[36] = new Card("Investir em parcerias locais no AirBnB.", function (p) {
    p.lojas[36].arrecadacaoBase += 500;
    addAlert(p.nome + " investiu em parcerias locais no AirBnB, aumentando as reservas e a arrecadação futura.");
    finalizarTurno(true); 
});

// C&A
cartasEscolhaSecundaria[37] = new Card("Expandir o varejo digital da C&A.", function (p) {
    p.lojas[37].arrecadacaoBase *= 1.15;
    addAlert(p.nome + " expandiu o varejo digital da C&A, aumentando as vendas em 15% nas próximas rodadas.");
    finalizarTurno(true); 
});

// Kabum
cartasEscolhaSecundaria[38] = new Card("Investir em otimização logística no Kabum.", function (p) {
    p.proximaArrecadacaoDobrada = true;
    addAlert(p.nome + " otimizou a logística do Kabum, dobrando a arrecadação nas próximas rodadas.");
    finalizarTurno(true); 
});

// Embaralhar cartas:
cartasEvento.index = 0;
cartasEvento.deck = [];
for (var i = 0; i < cartasEvento.length; i++) {
	cartasEvento.deck[i] = i;
}
cartasEvento.deck.sort(function() {return Math.random() - 0.5;});

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

function Jogador(nome, cor) {
    this.nome = nome;
    this.cor = cor;
    this.posicao = 0;
    this.money = 0; 
    this.taxaTotal = 100; // Porcentagem de taxa total disponível
    this.voltasCompletas = 0;
    this.lojas = []; 
    this.proximaArrecadacaoDobrada = false; 

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

// Função para retornar o array square
function getSquare() {
    return square;
  }

function adicionarAlerta(textoAlerta) {
    $alert = $("#alert");
    $(document.createElement("div")).text(textoAlerta).appendTo($alert);
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

function atualizarArrecadacao() {
    var j = jogadores[turno];

    document.getElementById("pmoney").innerHTML = "R$" + j.money;
    document.getElementById("pTaxaRestante").innerHTML = j.taxaTotal + "%";
    $(".money-bar-row").hide();

    for (var i = 1; i <= numeroJogadores; i++) {
        j_i = jogadores[i];

        $("#moneybarrow" + i).show();
        document.getElementById("p" + i + "moneybar").style.border = "2px solid " + j_i.cor;
        document.getElementById("p" + i + "money").innerHTML = j_i.money;
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
	j.pay(square[j.posicao].arrecadacaoBase, 0);
	addAlert(j.name + " pagou R$" + square[j.posicao].arrecadacaoBase + " de Imposto de Luxo.");
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
			var inputTaxacaoHTML =
				"<div>Defina a taxa para " +
				s.nome +
				" (0-" +
				j.taxaTotal +
				"%): <input type='number' id='inputTaxacao' min='0' max='" +
				j.taxaTotal +
				"' value='0'></div>";
			inputTaxacaoHTML +=
				"<input type='button' value='Aplicar Taxa' onclick='aplicarTaxaLoja(parseInt(document.getElementById(\"inputTaxacao\").value, 10));'>";

			// Adiciona o botão para a escolha secundária (se houver)
			if (s.escolhaSecundaria) {
				inputTaxacaoHTML +=
					"<input type='button' value='[Nome da Escolha Secundária]' onclick='executarEscolhaSecundaria();'>";
			}
			document.getElementById("landed").innerHTML = inputTaxacaoHTML;
			break;
		case "especial":
			s.escolhaSecundaria(j);
			break;
		case "impostoLuxo":
			pagarTaxaLuxo();
			break;
		case "cadeia":
			// Implemente a ação da cadeia
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
        j.taxaTotal += 30;
        adicionarAlerta(
            j.nome +
            " completou uma volta no tabuleiro e ganhou 30% de taxa adicional."
        );
    }
    j.ultimaPosicao = j.posicao;

    if (j.money >= 100000 || j.voltasCompletas >= 4) {
        fimDeJogo();
    } else {
        mostrarCartaEvento();
    }
}

function aplicarTaxaLoja(taxa) {
	var j = jogadores[turno];
	var s = square[j.posicao];

	if (taxa < 0) {
		taxa = 0;
	} else if (taxa > j.taxaTotal) {
		taxa = j.taxaTotal;
	}

	s.taxaAtual = taxa;
	j.lojas[j.posicao].taxa = taxa; 
	j.taxaTotal -= taxa; 

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

	atualizarArrecadacao();

	// Escolha secundária (se houver)
	if (s.escolhaSecundaria) {
		mostrarEscolhaSecundaria(); 
	} else {
		finalizarTurno();
	}
}

function executarEscolhaSecundaria() {
	var j = jogadores[turno];
	var s = square[j.posicao];

	s.escolhaSecundaria(j);

	finalizarTurno();
}

function mostrarEscolhaSecundaria() {
	var s = square[jogadores[turno].posicao];
	var botaoEscolha = "<input type='button' value='Sim' onclick='executarEscolhaSecundaria();'>";
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

    if (j.posicao > 39) { // Corrigido: usar 39 para o último índice do array
        j.posicao -= 40;
        j.voltasCompletas++;
        j.taxaTotal += 30; 
        adicionarAlerta(j.nome + " completou uma volta no tabuleiro e ganhou 30% de taxa adicional.");
    }

    pousar();
}

function jogar() {
    turno++;
    if (turno > numeroJogadores) {
        turno -= numeroJogadores;
    }

    var j = jogadores[turno];
    jogo.resetarDados();

    document.getElementById("pname").innerHTML = j.nome;
    document.getElementById("taxaRestante").innerHTML = j.taxaTotal + "%"; 
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

    $(".money-bar-arrow").hide();
    $("#p" + turno + "arrow").show();
}

function iniciarJogo() {
    jogo = new Game();
    numeroJogadores = parseInt(document.getElementById("playernumber").value, 10);

    var arrayJogadores = new Array(numeroJogadores);
    arrayJogadores.embaralhar();

    for (var i = 1; i <= numeroJogadores; i++) {
        jogadores[arrayJogadores[i - 1]] = new Jogador(
            document.getElementById("player" + i + "name").value,
            document.getElementById("player" + i + "color").value.toLowerCase()
        );
        jogadores[arrayJogadores[i - 1]].index = arrayJogadores[i - 1];
    }

    $("#board, #moneybar").show();
    $("#setup").hide();

    if (numeroJogadores === 2) {
        document.getElementById("stats").style.width = "454px";
    } else if (numeroJogadores === 3) {
        document.getElementById("stats").style.width = "686px";
    }

    document.getElementById("stats").style.top = "0px";
    document.getElementById("stats").style.left = "0px";

	$("#nextbutton").click(jogo.proximo); 

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

function fimDeJogo() {
    var vencedor = jogadores.reduce((maior, atual) => {
        return (maior.money > atual.money) ? maior : atual;
    });

    alert("Fim de Jogo! O jogador " + vencedor.nome + " venceu com R$" + vencedor.money.toFixed(2) + " de arrecadação!");

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