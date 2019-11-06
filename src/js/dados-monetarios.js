async function pegaOpcoesDePesquisa() {
    let todasAsPesquisas = await pegaPesquisas();

    todasAsPesquisas.map((pesquisa) => {
        return `<option value="${pesquisa.id}">
                      ${pesquisa.titulo}
                    </option>`
    }).forEach(pesquisa => {
        document.getElementById('input-pesquisa').innerHTML += pesquisa
    });
}

function checaTipoDeDados() {
    let valorDeTipoDeDados = document.getElementById('input-tipo-dados').value;

    if (valorDeTipoDeDados == 2) {
        document.getElementById('input-recebedor').disabled = false;
    } else {
        document.getElementById('input-recebedor').disabled = true;
        document.getElementById('input-recebedor').value = "";
    }
}

function adicionarDadosMonetarios() {
    if (formEValido()) {
        let dadosMonetarios = pegaDadosMonetarios();

        if (dadosMonetarios['tipo-dados'] == 2) { // Caso de Saída Financeira
            delete dadosMonetarios['tipo-dados'];
            mandaSaidaFinanceira(dadosMonetarios);

        } else { // Caso de Entrada Financeira
            delete dadosMonetarios['tipo-dados'];
            delete dadosMonetarios.recebedor;
            mandaEntradaFinanceira(dadosMonetarios);
        }
    } else {
        alert('Preencha todos os dados');
    }
}

function formEValido() {

    // Essa função não está funcionando

    let elementosHTML = document.getElementsByClassName('form-control');

    let elementosDeInput = Array.from(elementosHTML);

    elementosDeInput = elementosDeInput.filter((elemento) => !(elemento.disabled))

    let numberOfInputs = elementosDeInput.length;

    for (let i = 0; i < numberOfInputs; i++) {
        if (elementosDeInput[i].value == '' || elementosDeInput[i].value == 0) {
            return false;
        }
    }
    return true;
}

function pegaDadosMonetarios() {
    let dadosMonetarios = {};

    document.querySelectorAll('*[id]').forEach((item) => {
        dadosMonetarios[item.id.slice(6)] = item.value;
    })

    return dadosMonetarios;
}

async function mandaEntradaFinanceira(dados) {

    try {
        let requestFuncionou = await mandaEntradaParaApi(dados);
        alert('Entrada Financeira enviada com sucesso!');
        document.location.href = '../index.html';
    } catch (e) {
        alert('Houve um erro ao enviar a pesuisa. Contate a equipe de desenvolvimento')
    }

}

async function mandaSaidaFinanceira(dados) {

    try {
        let requestFuncionou = await mandaSaidaParaAPi(dados);
        alert('Saída Financeira enviada com sucesso!');
        document.location.href = '../index.html';
    } catch (e) {
        alert('Houve um erro ao enviar a pesquisa. Contate a equipe de desenvolvimento')
    }

}

function mandaEntradaParaApi(dados) {

    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/entradafinanceira/'

        httpReq.open('POST', url, true);

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

        httpReq.send(JSON.stringify(dados));

    })
}

function mandaSaidaParaAPi(dados) {

    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/saidafinanceira/'

        httpReq.open('POST', url, true);

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
        httpReq.send(JSON.stringify(dados));

    })
}
let editarEntrada = false;
let editarSaida = false;
async function pegaDadosMonetariosDaPesquisa(editarSaidaStatus, editarEntradaStatus) {
    editarSaida=editarSaidaStatus;
    editarEntrada=editarEntradaStatus;
    let dadosMock = {
        'dados': [
            'status'= 'EM',
            'pesquisa'='1',
            'recebedor'='joão',
            'numero_nota_fiscal'='123',
            'descricao'='teste',
            'valor'='asda',
            'status'='ok'
        ]
    }
    let dadosMockEntrada = {
        'dados': [
            'status'= 'EM',
            'pesquisa'='1',
            'numero_nota_fiscal'='123',
            'descricao'='teste',
            'valor'='asda',
            'status'='ok'
        ]
    }

    idDaPesquisaSelecionada = document.getElementById('input-pesquisa').value;

    if (idDaPesquisaSelecionada != '') {
        let entradasMonetariasTotais = await pegaDadosAPI('entradafinanceira');
        let saidasMonetariasTotais = await pegaDadosAPI('saidafinanceira');


        dadosTotais = entradasMonetariasTotais.concat(saidasMonetariasTotais);

        dadosTotais = dadosTotais.filter(
            dados => dados['pesquisa']['id'] == idDaPesquisaSelecionada
        ).map(dados => {
            if (dados['status'] == 'EM') {
                dados['status'] = 'Emitida';
                return dados
            } else if (dados['status'] == 'SE') {
                dados['status'] = 'Solicitada'
                return dados
            } else {
                dados['status'] = 'Cancelada'
                return dados
            }
        }).map(
            dados => {
                if (dados['recebedor'] != undefined) {
                    if(editarSaida==true){
                    return `
                    <tr class="linha-tabela">
                    <th scope="row">Saída</th>
                    <form onsubmit="editarSaidaFinanceira(event,${dados['recebedor']})">
                    <td><input value=${dados['recebedor']}/></td>
                    <td><input value=${dados['numero_nota_fiscal']}/></td>
                    <td><input value=${dados['descricao']}/></td>
                    <td><input value=${dados['valor']}/></td>
                    <td><select selected=${dados['status']}><option value="EA">Em andamento</option> <option value="CO">Concluída</option><option value="CA">Cancelado</option></select></td>
                   
                    <td><input type="submit" value="Salvar" class="btn btn-success" />
                    </form>
                    </tr>`   
                    }
                    else{
                    return `
                    <tr class="linha-tabela">
                    <th scope="row">Saída</th>
                    <td>${dados['recebedor']}</td>
                    <td>${dados['numero_nota_fiscal']}</td>
                    <td>${dados['descricao']}</td>
                    <td>${dados['valor']}</td>
                    <td><select selected=${dados['status']}><option value="EA">Em andamento</option> <option value="CO">Concluída</option><option value="CA">Cancelado</option></select></td>
                    <td><button class="btn btn-info" onclick="editarSaida=true; pegaDadosMonetariosDaPesquisa(true,false);">Editar</button>
                    </tr>`
                }
                } else {
                    if(editarEntrada==true){
                        `  <tr class="linha-tabela">
                        <th scope="row">Entrada</th>
                        <td>-</td>
                        <form onsubmit="editarEntradaFinanceira(event,${dados['recebedor']})">
                        <td><input value=${dados['numero_nota_fiscal']}/></td>
                        <td><input value=${dados['descricao']}/></td>
                        <td><input value=${dados['valor']}/></td>
                        <td><input value=${dados['status']}/></td>
                        <td><input type="submit" value="Salvar" class="btn btn-success" />
                        </form>
                        </tr>`
                    }else{
                    return `
                    <tr class="linha-tabela">
                    <th scope="row">Entrada</th>
                    <td>-</td>
                     <td>${dados['numero_nota_fiscal']}</td>
                    <td>${dados['descricao']}</td>
                    <td>${dados['valor']}</td>
                    <td>${dados['status']}</td>
                    <td><button class="btn btn-info" onclick="editarEntrada=true; pegaDadosMonetariosDaPesquisa(false,true);">Editar</button>
                    </tr>`
                }
            }
            }
        );

        document.getElementById('corpo-tabela').innerHTML = dadosTotais;



    }


}

function editarSaidaFinanceira(event,pesquisaId) {
    const dataJson = {
        recebedor: event.target[0].value,
        numero_nota_fiscal: event.target[1].value,
        descricao: event.target[2].value,
        valor: event.target[3].value,
        status: event.target[4].value
}
    return new Promise((resolve, reject) => {


        const httpReq = new XMLHttpRequest();
        const url = `http://127.0.0.1:8000/sgcpc/saidafinanceira/${pesquisaId}`

        httpReq.open('PATCH', url, true);

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

        httpReq.send(JSON.stringify(dataJson));
    })
}

function editarEntradaFinanceira(event,pesquisaId) {
    const dataJson = {
        numero_nota_fiscal: event.target[0].value,
        descricao: event.target[1].value,
        valor: event.target[2].value,
        status: event.target[3].value
    }
    return new Promise((resolve, reject) => {


        const httpReq = new XMLHttpRequest();
        const url = `http://127.0.0.1:8000/sgcpc/entradafinanceira/${pesquisaId}`

        httpReq.open('PATCH', url, true);

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

        httpReq.send(JSON.stringify(dataJson));
    })
}

function pegaDadosAPI(urlChegada) {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = `http://127.0.0.1:8000/sgcpc/${urlChegada}/`

        httpReq.open('GET', url);

        httpReq.responseType = 'json';

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