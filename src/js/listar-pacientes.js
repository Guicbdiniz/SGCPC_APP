function voltarPagina() {
    document.location.href = 'listar-pesquisas.html';
}

async function listaPacientes() {
    let idDaPesquisa = pegaIdDaPesquisa();

    if (idDaPesquisa) {
        document.getElementById('titulo-tabela').innerHTML = `Listagem de Pacientes da Pesquisa ${idDaPesquisa}`;
    }
    let todosOsPacientes = await pegaPacientes();

    todosOsPacientes.filter(paciente => paciente['pesquisa'] == idDaPesquisa).map(paciente => {

        return `<tr class="linha-tabela">
                    <th scope="row">${paciente.id}</th>
                    <td>${paciente.nome}</td>
                    <td>${paciente.cpf}</td>
                    <td>${paciente.telefone}</td>
                </tr>    
                `
    }).forEach(paciente => {
        document.getElementById('corpo-tabela').innerHTML += paciente;
    })
}

function pegaPacientes() {

    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/pacientes/'

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

function pegaIdDaPesquisa() {
    return window.location.search.substring(1).slice(11);
}