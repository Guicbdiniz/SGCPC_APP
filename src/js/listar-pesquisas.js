function voltarPagina() {
  document.location.href = '../index.html';
}

const pesquisa = {
  pesquisa: {
    id: '1',
    investigador: {
      nome: 'Tulao',
      email: 'tulao@gmail.com',
      telefone: 996796042
    },
    equipe_de_apoio: {
      nome_da_coordenacao: 'Aro',
      email: 'aro@gmail.com',
      telefone: 999999999
    },
    tipo_de_pesquisa: 'CI',
    titulo: 'Pesquisa do tulao',
    nome_fantasia: 'Pesquisa do tulao 2',
    numero_de_contrato: 123456,
    numero_CAAE: 123987,
    patrocinadores: 'Rodrigo e Rommel',
    setor_de_atuacao: 'Qualquer bosta',
    status: 'CA',
    vinculo_institucional: 'PT'
  }
};
async function listaPesquisas() {
  let todasAsPesquisas = pesquisa;

  Object.values(todasAsPesquisas)
    .map(pesquisa => {
      let tipoDaPesquisaCompleto =
        pesquisa.tipo_de_pesquisa == 'CL' ? 'Clínica' : 'Científica';
      let statusPesquisaCompleto = '';

      if (pesquisa.status == 'EA') {
        statusPesquisaCompleto = 'Em Andamento';
      } else if (pesquisa.status == 'CO') {
        statusPesquisaCompleto = 'Concluída';
      } else {
        statusPesquisaCompleto = 'Cancelado';
      }

      return `<tr class="linha-tabela">
                    <th scope="row">${pesquisa.id}</th>
                    <td>${pesquisa.titulo}</td>
                    <td>${tipoDaPesquisaCompleto}</td>
                    <td>${statusPesquisaCompleto}</td>
                    <td><button onclick="criaModal(${pesquisa.id})" class="btn btn-dark">Exibir Detalhes</button></td>
                </tr>    
                `;
    })
    .forEach(pesquisa => {
      document.getElementById('corpo-tabela').innerHTML += pesquisa;
    });
}

function pegaPesquisas() {
  return new Promise((resolve, reject) => {
    const httpReq = new XMLHttpRequest();
    const url = 'http://127.0.0.1:8000/sgcpc/pesquisas/';

    httpReq.responseType = 'json';

    httpReq.open('GET', url);

    httpReq.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(httpReq.response);
      } else {
        reject({
          status: this.status,
          statusText: httpReq.statusText
        });
      }
    };

    httpReq.onerror = function() {
      reject({
        status: this.status,
        statusText: httpReq.statusText
      });
    };

    httpReq.send();
  });
}
let editar = false;
async function criaModal(pesquisaID, editar) {
  const pesquisa1 = {
    pesquisa: {
      id: '1',
      investigador: {
        nome: 'Tulao',
        email: 'tulao@gmail.com',
        telefone: 996796042
      },
      equipe_de_apoio: {
        nome_da_coordenacao: 'Aro',
        email: 'aro@gmail.com',
        telefone: 999999999
      },
      tipo_de_pesquisa: 'CI',
      titulo: 'Pesquisa do tulao',
      nome_fantasia: 'Pesquisa do tulao 2',
      numero_de_contrato: 123456,
      numero_CAAE: 123987,
      patrocinadores: 'Rodrigo e Rommel',
      setor_de_atuacao: 'Qualquer bosta',
      status: 'CA',
      vinculo_institucional: 'PT'
    }
  };

  let editarPesquisa = editar;

  let todasAsPesquisas = pesquisa1;

  //let todosOsPacientes = await pegaPacientes();
  let numeroDePacientesDaPesquisa = 2;

  let pesquisa = Object.values(todasAsPesquisas).filter(
    pesquisa => pesquisa.id == pesquisaID
  )[0];

  let tipoDaPesquisaCompleto =
    pesquisa.tipo_de_pesquisa == 'CL' ? 'Clínica' : 'Científica';
  let statusPesquisaCompleto = '';
  let vinculoPesquisaCompleto = '';

  if (pesquisa.status == 'EA') {
    statusPesquisaCompleto = 'Em Andamento';
  } else if (pesquisa.status == 'CO') {
    statusPesquisaCompleto = 'Concluída';
  } else {
    statusPesquisaCompleto = 'Cancelado';
  }

  if (pesquisa.vinculo_institucional == 'PT') {
    vinculoPesquisaCompleto = 'Pesquisa de Centro Terceirizado';
  } else if (pesquisa.vinculo_institucional == 'PI') {
    vinculoPesquisaCompleto = 'Pesquisa Institucional';
  } else {
    vinculoPesquisaCompleto = 'Pesquisa Acadêmica';
  }
  let valuesf;

  let htmlDoModal = editarPesquisa
    ? `
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pesquisa ${pesquisaID}</h5>
                <button type="button" onclick="fechaModal()" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            <form onsubmit="event.preventDefault(); console.log(event); editarPesquisaAPI(event,${pesquisaID});">
            <p><span class="atributo-pesquisa">Titulo da Pesquisa:</span> <input value=${pesquisa.titulo}/> </p>
            <p><span class="atributo-pesquisa">Tipo da Pesquisa:</span> <select selected=${tipoDaPesquisaCompleto}><option value="CL">Clínica</option> <option value="CI">Científica</option></select>  </p>
            <p><span class="atributo-pesquisa">Status da Pesquisa:</span> <select selected=${statusPesquisaCompleto}><option value="EA">Em andamento</option> <option value="CO">Concluída</option><option value="CA">Cancelado</option></select> </p>
            <p><span class="atributo-pesquisa">Nome Fantasia da Pesquisa:</span> <input value=${pesquisa.nome_fantasia}/> </p>
            <p><span class="atributo-pesquisa">Setor de Atuação:</span> <input value=${pesquisa.setor_de_atuacao}/> </p>
            <p><span class="atributo-pesquisa">Numero CAAE:</span> <input value=${pesquisa.numero_CAAE}/> </p>
            <p><span class="atributo-pesquisa">Numero de Contrato:</span> <input value=${pesquisa.numero_de_contrato}/> </p>
            <p><span class="atributo-pesquisa">Vínculo Institucional:</span> <select selected=${vinculoPesquisaCompleto}><option value="PT">Pesquisa de Centro Terceirizado</option> <option value="PI">Pesquisa Institucional</option><option value="PA">Pesquisa Acadêmica</option></select> </p>
            <p><span class="atributo-pesquisa">Investigador Principal:</span> <input value=${pesquisa.investigador.nome}/>  </p>
            <p><span class="atributo-pesquisa">Número de Pacientes:</span> <a href="listar-pacientes.html?idPesquisa=${pesquisaID}"> 2</a> </p>
            <input type="submit" value="Enviar" class="btn btn-info" onclick="" />  
            <button type="button" class="btn btn-dark" onclick="editarPesquisa=true; criaModal(${pesquisaID},false)" >Voltar </button>
            </form>
            </div>
           
        </div>
    </div>
    `
    : `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Pesquisa ${pesquisaID}</h5>
                    <button type="button" onclick="fechaModal()" class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p><span class="atributo-pesquisa">Titulo da Pesquisa:</span> ${pesquisa.titulo}</p>
                    <p><span class="atributo-pesquisa">Tipo da Pesquisa:</span> ${tipoDaPesquisaCompleto}</p>
                    <p><span class="atributo-pesquisa">Status da Pesquisa:</span> ${statusPesquisaCompleto}</p>
                    <p><span class="atributo-pesquisa">Nome Fantasia da Pesquisa:</span> ${pesquisa.nome_fantasia}</p>
                    <p><span class="atributo-pesquisa">Setor de Atuação:</span> ${pesquisa.setor_de_atuacao}</p>
                    <p><span class="atributo-pesquisa">Numero CAAE:</span> ${pesquisa.numero_CAAE}</p>
                    <p><span class="atributo-pesquisa">Numero de Contrato:</span> ${pesquisa.numero_de_contrato} </p>
                    <p><span class="atributo-pesquisa">Vínculo Institucional:</span> ${vinculoPesquisaCompleto} </p>
                    <p><span class="atributo-pesquisa">Investigador Principal:</span> ${pesquisa.investigador.nome} </p>
                    <p><span class="atributo-pesquisa">Número de Pacientes:</span> <a href="listar-pacientes.html?idPesquisa=${pesquisaID}"> ${numeroDePacientesDaPesquisa}  </a> </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="editarPesquisa=true; criaModal(${pesquisaID},true)" >Editar </button>
                </div>
            </div>
        </div>
        `;

  let modalNoHtml = document.getElementById('modal-pesquisa');

  modalNoHtml.innerHTML = htmlDoModal;

  modalNoHtml.style.display = 'block';
}

function fechaModal() {
  document.getElementById('modal-pesquisa').style.display = 'none';
}

function editarPesquisaAPI(data, pesquisaID) {
  console.log(data.target[0].value);
  const dataJson = {
    titulo: data.target[0].value,
    investigador: {
      nome: data.target[8].value
    },
    tipo_de_pesquisa: data.target[1].value,
    nome_fantasia: data.target[3].value,
    numero_de_contrato: data.target[6].value,
    numero_CAAE: data.target[5].value,
    setor_de_atuacao: data.target[4].value,
    status: data.target[2].value,
    vinculo_institucional: data.target[7].value
  };
  return new Promise((resolve, reject) => {
    const httpReq = new XMLHttpRequest();
    const url = `http://127.0.0.1:8000/sgcpc/pesquisas/${pesquisaID}`;

    httpReq.open('PATCH', url, true);

    httpReq.setRequestHeader('Content-Type', 'application/json');

    httpReq.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(httpReq.response);
      } else {
        reject({
          status: this.status,
          statusText: httpReq.statusText
        });
      }
    };

    httpReq.onerror = function() {
      reject({
        status: this.status,
        statusText: httpReq.statusText
      });
    };

    httpReq.send(JSON.stringify(dataJson));
  });
}

function pegaPacientes() {
  return new Promise((resolve, reject) => {
    const httpReq = new XMLHttpRequest();
    const url = 'http://127.0.0.1:8000/sgcpc/pacientes/';

    httpReq.responseType = 'json';

    httpReq.open('GET', url);

    httpReq.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(httpReq.response);
      } else {
        reject({
          status: this.status,
          statusText: httpReq.statusText
        });
      }
    };

    httpReq.onerror = function() {
      reject({
        status: this.status,
        statusText: httpReq.statusText
      });
    };

    httpReq.send();
  });
}

function pegaNumeroDePacientesDaPesquisa(idDaPesquisa, listaDePacientes) {
  return listaDePacientes.filter(
    paciente => paciente['pesquisa'] == idDaPesquisa
  ).length;
}
