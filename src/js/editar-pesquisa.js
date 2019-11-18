function voltarPagina() {
    document.location.href = 'listar-pesquisas.html';
}

function pegaIdDaPesquisa() {
    return window.location.search.substring(1).slice(11);
}

async function preencheDadosDaPesquisa() {
    let idDaPesquisa = pegaIdDaPesquisa();

    let dadosDaPesquisa = await pegaDadosDaPesquisa(idDaPesquisa);

    document.getElementById('input-investigador-nome').value = dadosDaPesquisa['investigador'].nome;
    document.getElementById('input-investigador-email').value = dadosDaPesquisa['investigador'].email;
    document.getElementById('input-investigador-telefone').value = dadosDaPesquisa['investigador'].telefone;

    document.getElementById('input-equipe-apoio-email').value = dadosDaPesquisa['equipe_de_apoio']['email'];
    document.getElementById('input-equipe-apoio-nome_da_coordenacao').value = dadosDaPesquisa['equipe_de_apoio']['nome_da_coordenacao'];
    document.getElementById('input-equipe-apoio-telefone').value = dadosDaPesquisa['equipe_de_apoio']['telefone'];

    Object.keys(dadosDaPesquisa).forEach((key) => {
        if (!key.startsWith('data') && !key.startsWith('invest') && !key.startsWith('equipe')
            && !key.startsWith('id')) {
            document.getElementById('input-' + key).value = dadosDaPesquisa[key];
        }
    });

}

async function trataClickBotaoDeEnvio() {
    if (formEValido()) {
        let dadosPesquisa = pegaDadosFormPesquisa();

        try {
            await trataEnvioDePesquisa(dadosPesquisa);
            alert('Pesquisa editada com sucesso!');
            document.location.href = 'listar-pesquisas.html';
        } catch (e) {
            alert('Houve um erro ao enviar a pesquisa. Contate Equipe de desenvolvimento')
        }
    } else {
        alert('Preencha todos os dados');
    }
}

function pegaDadosFormPesquisa() {
    let dadosPesquisa = {};
    dadosPesquisa['investigador'] = {};
    dadosPesquisa['equipe_de_apoio'] = {};

    document.querySelectorAll('*[id]').forEach(
        (item) => {
            if (!item.id.includes('investigador') && !item.id.includes('equipe-apoio')) {

                dadosPesquisa[item.id.slice(6)] = document.getElementById(item.id).value;
            }

            else if (item.id.includes('investigador')) {

                dadosPesquisa['investigador'][item.id.slice(19)] =
                    document.getElementById(item.id).value;
            }

            else if (item.id.includes('equipe-apoio')) {

                dadosPesquisa['equipe_de_apoio'][item.id.slice(19)] =
                    document.getElementById(item.id).value;
            }
        }
    )

    return dadosPesquisa;

}

function formEValido() {

    let numberOfInputs = document.getElementsByClassName('form-control').length;

    for (let i = 0; i < numberOfInputs; i++) {
        if (document.getElementsByClassName('form-control')[i].value == '') {
            return false;
        }
    }

    return true;
}

function pegaDadosDaPesquisa(idDaPesquisa) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/' + idDaPesquisa + "/";

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


async function trataEnvioDePesquisa(dadosDaPesquisaEnviada) {
    let idDaPesquisa = pegaIdDaPesquisa();

    let dadosDaPesquisaOriginal = await pegaDadosDaPesquisa(idDaPesquisa);

    let dadosEnviados = {};

    Object.keys(dadosDaPesquisaOriginal).forEach((key) => {

        if (!key.startsWith('invest') && !key.startsWith('equipe') &&
            !key.startsWith('data') && !key.startsWith('id')) {

            if (dadosDaPesquisaOriginal[key] != dadosDaPesquisaEnviada[key]) {
                dadosEnviados[key] = dadosDaPesquisaEnviada[key];
            }
        }
    })

    await enviaPesquisaEditada(idDaPesquisa, dadosEnviados);

    let idInvestigadorEditado = dadosDaPesquisaOriginal['investigador']['id'];
    await enviaInvestigadorEditado(idInvestigadorEditado, dadosDaPesquisaEnviada['investigador']);

    let idEquipeDeApoioEditada = dadosDaPesquisaOriginal['equipe_de_apoio']['id'];
    await enviaEquipeDeApoioEditada(idEquipeDeApoioEditada, dadosDaPesquisaEnviada['equipe_de_apoio']);

}

function enviaPesquisaEditada(idDaPesquisa, dadosDaPesquisaEnviada) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/' + idDaPesquisa + "/";

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

        httpReq.send(JSON.stringify(dadosDaPesquisaEnviada));
    })
}

function enviaInvestigadorEditado(idInvestigadorEditado, dadosDoInvestigadorEditado) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/investigadores/' + idInvestigadorEditado + "/";

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

        httpReq.send(JSON.stringify(dadosDoInvestigadorEditado));
    })
}

function enviaEquipeDeApoioEditada(idEquipeEditada, dadosDaEquipeEditada) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/equipesdeapoio/' + idEquipeEditada + "/";

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

        httpReq.send(JSON.stringify(dadosDaEquipeEditada));
    })
}