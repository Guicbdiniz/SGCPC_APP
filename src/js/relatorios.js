async function pegaRelatorioTeste() {
    e = await pegaRelatorio();
    console.log(e);
}

function abreNovaAba() {
    var aba = window.open('http://127.0.0.1:8000/download/relatorio/', '_blank');
    aba.focus();
}

function pegaRelatorio() {
    return new Promise((resolve, reject) => {

        const httpReq = new XMLHttpRequest();
        const url = 'http://127.0.0.1:8000/download/relatorio/'

        httpReq.open('GET', url);

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

        httpReq.send();

    })
}