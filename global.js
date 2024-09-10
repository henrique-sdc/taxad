var jogadores = [];
var turno = 0;
var valorObjetivo = 50000;

// Propriedades de taxa das lojas
var taxas = {
    "AliExpress": {
        min: 5,
        max: 50,
        ganhoPorcento: 1,
        ganhoValor: 2000,
        quedaAcima: 40,
        quedaPorcento: 25
    },
    "Shopee": {
        min: 10,
        max: 40,
        ganhoPorcento: 5,
        ganhoValor: 3000,
        multaAcima: 30,
        multaPorcento: 10
    },
    "Shein": {
        min: 15,
        max: 50,
        ganhoPorcento: 1,
        ganhoValor: 1000,
        quedaAcima: 35,
        quedaPorcento: 20
    },
    "Pix": {
        min: 10,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 5000,
        quedaAcima: 30,
        quedaPorcento: 20
    },
    "Mercado Livre": {
        min: 5,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 2500,
        quedaAcima: 30,
        quedaPorcento: 15
    },
    "Amazon": {
        min: 5,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 4000,
        quedaAcima: 35,
        quedaPorcento: 20
    },
    "Americanas": {
        min: 10,
        max: 50,
        ganhoPorcento: 1,
        ganhoValor: 1500,
        quedaAcima: 40,
        quedaPorcento: 30
    },
    "Netshoes": {
        min: 10,
        max: 40,
        ganhoPorcento: 5,
        ganhoValor: 3000,
        quedaAcima: 25,
        quedaPorcento: 15
    },
    "iFood": {
        min: 15,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 4000,
        quedaAcima: 30,
        quedaPorcento: 10
    },
    "eBay": {
        min: 10,
        max: 40,
        ganhoPorcento: 5,
        ganhoValor: 2500,
        quedaAcima: 30,
        quedaPorcento: 20
    },
    "Growth": {
        min: 5,
        max: 35,
        ganhoPorcento: 1,
        ganhoValor: 1000,
        quedaAcima: 25,
        quedaPorcento: 20
    },
    "Netflix": {
        min: 10,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 4000,
        quedaAcima: 30,
        quedaPorcento: 15
    },
    "Disney+": {
        min: 15,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 3500,
        quedaAcima: 40,
        quedaPorcento: 20
    },
    "TikTok": {
        min: 5,
        max: 40,
        ganhoPorcento: 1,
        ganhoValor: 3000,
        quedaAcima: 30,
        quedaPorcento: 15
    },
    "Kwai": {
        min: 10,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 3500,
        quedaAcima: 30,
        quedaPorcento: 20
    },
    "Uber": {
        min: 10,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 3000,
        quedaAcima: 35,
        quedaPorcento: 25
    },
    "Casas Bahia": {
        min: 10,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 2000,
        quedaAcima: 35,
        quedaPorcento: 20
    },
    "Zara": {
        min: 15,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 3500,
        quedaAcima: 40,
        quedaPorcento: 25
    },
    "WebMotors": {
        min: 5,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 3000,
        quedaAcima: 30,
        quedaPorcento: 20
    },
    "LG": {
        min: 10,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 4000,
        quedaAcima: 35,
        quedaPorcento: 25
    },
    "Samsung": {
        min: 10,
    max: 50,
    ganhoPorcento: 5,
    ganhoValor: 3500,
    quedaAcima: 30,
    quedaPorcento: 15
    },
    "Natura": {
        min: 5,
    max: 40,
    ganhoPorcento: 1,
    ganhoValor: 2000,
    quedaAcima: 25,
    quedaPorcento: 15
    },
    "Avon": {
        min: 10,
        max: 45,
        ganhoPorcento: 5,
        ganhoValor: 2500,
        quedaAcima: 30,
        quedaPorcento: 10 
    },
    "O'Boticário": {
        min: 5,
    max: 40,
    ganhoPorcento: 1,
    ganhoValor: 1500,
    quedaAcima: 20,
    quedaPorcento: 10
    },
    "Renner": {
        min: 10,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 3000,
        quedaAcima: 40,
        quedaPorcento: 20 
    },
    "AirBnB": {
        min: 5,
        max: 40,
        ganhoPorcento: 1,
        ganhoValor: 2000,
        quedaAcima: 30,
        quedaPorcento: 15
    },
    "C&A": {
        min: 15,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 2500,
        quedaAcima: 35,
        quedaPorcento: 15
    },
    "Kabum": {
        min: 10,
        max: 50,
        ganhoPorcento: 5,
        ganhoValor: 3500,
        quedaAcima: 40,
        quedaPorcento: 15
    }
}