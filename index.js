const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

let imcRecords = [];

function calcularIMC(altura, peso) {
    const imc = peso / (altura * altura);
    let classificacao = '';

    if (imc < 18.5) {
        classificacao = 'Abaixo do peso';
    } else if (imc >= 18.5 && imc < 24.9) {
        classificacao = 'Peso normal';
    } else if (imc >= 25 && imc < 29.9) {
        classificacao = 'Sobrepeso';
    } else {
        classificacao = 'Obesidade';
    }

    return { imc: imc.toFixed(2), classificacao };
}

const adicionarIMC = (request, response) => {
    const { nome, altura, peso } = request.body;

    if (!nome || !altura || !peso) {
        return response.status(400).json({ error: 'Nome, altura e peso são obrigatórios' });
    }

    const { imc, classificacao } = calcularIMC(altura, peso);

    const resultado = {
        nome,
        altura,
        peso,
        imc,
        classificacao,
    };

    imcRecords.push(resultado);

    response.json(resultado);
};

const getIMC = (request, response) => {
    response.status(200).json(imcRecords);
};

const getIMCIndice = (request, response) => {
    const index = parseInt(request.params.index);
    const imc = imcRecords[index];
    if (imc != null) {
        return response.status(200).json(imc);
    } else {
        return response.status(404).json("IMC não encontrado");
    }
};

const removerIMCIndice = (request, response) => {
    const index = parseInt(request.params.index);
    const imc = imcRecords[index];
    if (imc != null) {
        imcRecords.splice(index);
        return response.status(200).json(imc);
    } else {
        return response.status(404).json("Dado não encontrado");
    }
};

app.route('/calcularIMC')
    .post(adicionarIMC);

app.route('/getIMC')
    .get(getIMC);

app.route('/removerIMC/:index')
    .get(getIMCIndice)
    .delete(removerIMCIndice);

app.listen(3002, () => {
    console.log("Servidor rodando na porta 3002");
});
