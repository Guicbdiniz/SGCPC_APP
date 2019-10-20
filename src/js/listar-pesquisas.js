function voltarPagina() {
    document.location.href = '../index.html';
}

async function listaPesquisas() {
    let todasAsPesquisas = await pegaPesquisas();
    console.log(todasAsPesquisas);

    todasAsPesquisas.map(pesquisa => {

        let tipoDaPesquisaCompleto = pesquisa.tipo_de_pesquisa == 'CL' ?
            'Clínica' :
            'Científica';
        let statusPesquisaCompleto = '';

        if (pesquisa.status == 'EA') {
            statusPesquisaCompleto = 'Em Andamento'
        } else if (pesquisa.status == 'CO') {
            statusPesquisaCompleto = 'Concluída'
        } else {
            statusPesquisaCompleto = 'Cancelado'
        }

        return `<tr class="linha-tabela">
                    <th scope="row">${pesquisa.id}</th>
                    <td>${pesquisa.titulo}</td>
                    <td>${tipoDaPesquisaCompleto}</td>
                    <td>${statusPesquisaCompleto}</td>
                    <td><button onclick="criaModal(${pesquisa.id})" class="btn btn-dark">Exibir Detalhes</button></td>
                </tr>    
                `
    }).forEach(pesquisa => {
        document.getElementById('corpo-tabela').innerHTML += pesquisa;
    })
}

function pegaPesquisas() {

    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/'

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

function criaModal(pesquisaID) {
    console.log(`Id da pesquisa: ${pesquisaID}`);


}