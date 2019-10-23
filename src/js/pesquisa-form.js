async function adicionaPesquisa() {
    if (formEValido()) {
        let dadosPesquisa = pegaDadosPesquisa();

        try {
            let requestFuncionou = await mandaPesquisaParaApi(dadosPesquisa);
            alert('Pesquisa enviada com sucesso!');
            document.location.href = '../index.html';
        } catch (e) {
            alert('Houve um erro ao enviar a pesquisa. Contate Equipe de desenvolvimento')
        }
    } else {
        alert('Preencha todos os dados');
    }
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

function pegaDadosPesquisa() {
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

function mandaPesquisaParaApi(pesquisa) {

    return new Promise((resolve, reject) => {


        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/'

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

        httpReq.send(JSON.stringify(pesquisa));
    })
}