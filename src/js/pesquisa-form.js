function adicionaPesquisa() {
    /*if (formEValido()) {
        let dadosPesquisa = pegaDadosPesquisa();
    } else {
        alert('Preencha todos os dados');
    }*/

    let dadosPesquisa = pegaDadosPesquisa();

    let requestFuncionou = mandaPesquisaParaApi(dadosPesquisa);

    if (requestFuncionou) {
        alert('Pesquisada enviada com sucesso!');
        document.location.href = '../index.html';
    } else {
        alert('Houve um erro ao enviar a pesquisa. Contate Equipe de desenvolvimento');
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
    const httpReq = new XMLHttpRequest();
    const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/'

    httpReq.open('POST', url, true);

    httpReq.setRequestHeader("Content-Type", "application/json");

    httpReq.onload = function () {
        // do something to response
    };

    httpReq.send(JSON.stringify(pesquisa));

    if (httpReq.status == 200 || httpReq.status == 201) {
        return true;
    } else {
        return false;
    }

}