function voltarPagina() {
    document.location.href = 'listar-dados-monetarios.html'
}

function pegaIdDoDadoMonetario() {
    return window.location.search.substring(1).slice(11);
}

async function preencheDadosDaEntrada() {
    let idDaEntrada = pegaIdDoDadoMonetario();

    let dadosDaEntrada = await pegaDadosDaEntrada(idDaEntrada);

    document.getElementById('input-numero_nota_fiscal').value = dadosDaEntrada['numero_nota_fiscal'];
    document.getElementById('input-valor').value = dadosDaEntrada['valor'];
    document.getElementById('input-descricao').value = dadosDaEntrada['descricao'];
    document.getElementById('input-status').value = dadosDaEntrada['status'];

}

async function preencheDadosDaSaida() {
    let idDaSaida = pegaIdDoDadoMonetario();

    let dadosDaSaida = await pegaDadosDaSaida(idDaSaida);

    document.getElementById('input-numero_nota_fiscal').value = dadosDaSaida['numero_nota_fiscal'];
    document.getElementById('input-valor').value = dadosDaSaida['valor'];
    document.getElementById('input-descricao').value = dadosDaSaida['descricao'];
    document.getElementById('input-status').value = dadosDaSaida['status'];
    document.getElementById('input-recebedor').value = dadosDaSaida['recebedor'];

}

function pegaDadosDaEntrada(idDaEntrada) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/entradafinanceira/' + idDaEntrada + "/";

        httpReq.responseType = 'json';

        httpReq.open('GET', url);

        httpReq.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(httpReq.response);
            } else {
                reject({
                    status: this.status,
                    statusText: httpReq.statusText
                });
            }
        }

        httpReq.onerror = function () {
            reject({
                status: this.status,
                statusText: httpReq.statusText
            })
        }

        httpReq.send();
    })
}

function pegaDadosDaSaida(idDaSaida) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/saidafinanceira/' + idDaSaida + "/";

        httpReq.responseType = 'json';

        httpReq.open('GET', url);

        httpReq.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(httpReq.response);
            } else {
                reject({
                    status: this.status,
                    statusText: httpReq.statusText
                });
            }
        }

        httpReq.onerror = function () {
            reject({
                status: this.status,
                statusText: httpReq.statusText
            })
        }

        httpReq.send();
    })
}

function trataClickEnvioSaida() {
    if (formEValido()) {

        try {
            let dadosMonetariosForm = pegaDadosMonetariosForm();
            trataEnvioSaidaFinanceira(dadosMonetariosForm);
            alert('Saida editada com sucesso!');
            //document.location.href = 'listar-dados-monetarios.html';
        } catch (e) {
            alert('Houve um erro ao enviar a pesquisa. Contate Equipe de desenvolvimento')
        }

    } else {
        alert('Preencha todos os dados');
    }
}

function trataClickEnvioEntrada() {
    if (formEValido()) {

        try {
            let dadosMonetariosForm = pegaDadosMonetariosForm();
            trataEnvioEntradaFinanceira(dadosMonetariosForm);
            alert('Entrada editada com sucesso!');
            //document.location.href = 'listar-dados-monetarios.html';
        } catch (e) {
            alert('Houve um erro ao enviar a pesquisa. Contate Equipe de desenvolvimento')
        }

    } else {
        alert('Preencha todos os dados');
    }
}

function formEValido() {

    let elementosHTML = document.getElementsByClassName('form-control');

    let elementosDeInput = Array.from(elementosHTML);

    let numberOfInputs = elementosDeInput.length;

    for (let i = 0; i < numberOfInputs; i++) {
        if (elementosDeInput[i].value == '' || elementosDeInput[i].value == 0) {
            return false;
        }
    }
    return true;
}

function pegaDadosMonetariosForm() {
    let dadosMonetarios = {};

    document.querySelectorAll('*[id]').forEach((item) => {
        dadosMonetarios[item.id.slice(6)] = item.value;
    })

    return dadosMonetarios;
}

async function trataEnvioEntradaFinanceira(dadosMonetariosForm) {
    let idDaEntrada = pegaIdDoDadoMonetario();

    let dadosDaEntradaOriginal = await pegaDadosDaEntrada(idDaEntrada);

    let dadosEnviados = {};

    Object.keys(dadosDaEntradaOriginal).forEach((key) => {

        if (!key.startsWith('id')) {

            if (dadosDaEntradaOriginal[key] != dadosMonetariosForm[key]) {
                dadosEnviados[key] = dadosMonetariosForm[key];
            }
        }
    })

    await enviaEntradaEditada(idDaEntrada, dadosEnviados);
}

function enviaEntradaEditada(idDaEntrada, dadosEnviados) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/entradafinanceira/' + idDaEntrada + "/";

        httpReq.responseType = 'json';

        httpReq.open('PATCH', url);

        httpReq.setRequestHeader("Content-Type", "application/json");

        httpReq.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(httpReq.response);
            } else {
                reject({
                    status: this.status,
                    statusText: httpReq.statusText
                });
            }
        }

        httpReq.onerror = function () {
            reject({
                status: this.status,
                statusText: httpReq.statusText
            })
        }

        httpReq.send(JSON.stringify(dadosEnviados));
    })
}

async function trataEnvioSaidaFinanceira(dadosMonetariosForm) {
    let idDaSaida = pegaIdDoDadoMonetario();

    let dadosDaSaidaOriginal = await pegaDadosDaSaida(idDaSaida);

    let dadosEnviados = {};

    Object.keys(dadosDaSaidaOriginal).forEach((key) => {

        if (!key.startsWith('id')) {

            if (dadosDaSaidaOriginal[key] != dadosMonetariosForm[key]) {
                dadosEnviados[key] = dadosMonetariosForm[key];
            }
        }
    })

    await enviaSaidaEditada(idDaSaida, dadosEnviados);

}

function enviaSaidaEditada(idDaSaida, dadosEnviados) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/saidafinanceira/' + idDaSaida + "/";

        httpReq.responseType = 'json';

        httpReq.open('PATCH', url);

        httpReq.setRequestHeader("Content-Type", "application/json");

        httpReq.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(httpReq.response);
            } else {
                reject({
                    status: this.status,
                    statusText: httpReq.statusText
                });
            }
        }

        httpReq.onerror = function () {
            reject({
                status: this.status,
                statusText: httpReq.statusText
            })
        }

        httpReq.send(JSON.stringify(dadosEnviados));
    })
}