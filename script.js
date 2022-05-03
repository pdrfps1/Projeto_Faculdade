"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

// Interação com Layout
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const saveViagem = () => {
  if (isValidFields()) {
    const viagem = {
      destino: document.getElementById("destino").value,
      data: document.getElementById("data").value,
      distancia: document.getElementById("distancia").value,
      despesas: document.getElementById("despesas").value,
    };
    const index = document.getElementById('destino').dataset.index
    if (index == 'new') {
      createViagem(viagem)
      clearFields()
      closeModal()
    } else {
      updateViagem(index, viagem)
      updateTable()
      closeModal()
    }
  };

  const createRow = (viagem, index) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `                    
    <td>${viagem.destino}</td>
    <td>${viagem.data}</td>
    <td>${viagem.distancia}KM</td>
    <td>R$${viagem.despesas}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>`;
    document.querySelector("#tableViagem>tbody").appendChild(newRow);
  };

  const clearTable = () => {
    const rows = document.querySelectorAll("#tableViagem>tbody tr");
    rows.forEach((row) => row.parentNode.removeChild(row));
  };

  const updateTable = () => {
    const dbViagem = readViagem();
    clearTable();
    dbViagem.forEach(createRow);
  };
  updateTable();

  //Editar Viagem
  const editViagem = (index) => {
    const viagem = readViagem();[index]
    viagem.index = index;
    fillFields(viagem)
    openModal()
  }

  const fillFields = (viagem) => {
    document.getElementById('destino').value = viagem.destino
    document.getElementById('data').value = viagem.data
    document.getElementById('distancia').value = viagem.distancia
    document.getElementById('despesas').value = viagem.despesas
    document.getElementById('destino').dataset.index = viagem.index
  }

  // Funcionamento do botao Editar e Delete
  const editDelete = (event) => {
    if (event.target.type == "button") {
      const [action, index] = event.target.id.split("-");

      if (action == "edit") {
        editViagem(index);
      } else {
        const response = confirm('Tem certeza que deseja excluir a viagem?')
        if(responde)
        console.log("Deletando Viagem")
        deleteViagem(index)
        updateTable()
      }
    }
  };

  // Eventos
  document.getElementById("cadastrarViagem").addEventListener("click", openModal);

  document.getElementById("modalClose").addEventListener("click", closeModal);

  document.getElementById("salvar").addEventListener("click", saveViagem);

  document.getElementById("delete").addEventListener("click", deleteViagem);

  document.querySelector("#tableViagem>tbody").addeventListener("click", editDelete);

  const getLocalStorage = () =>
    JSON.parse(localStorage.getItem("dbViagem")) ?? [];
  const setLocalStorage = () =>
    localStorage.setItem(
      "dbViagem",
      JSON.parse(localStorage.getItem("dbViagem"))
    );

  // CRUD Delete
  const deleteViagem = (index) => {
    const dbViagem = readViagem;
    dbViagem.splice(index, 1);
    setLocalStorage(dbViagem);
  };

  // CRUD Read
  const readViagem = () => getLocalStorage(); {
    const isValidFields = () => {
      return document.getElementById("form").reportValidity();
    }
  }
  // CRUD Update
  const updateViagem = (index, viagem) => {
    const dbViagem = readViagem();
    dbViagem[index] = viagem;
    setLocalStorage(dbViagem);
  }
};

// CRUD Create
const createViagem = (viagem) => {
  const dbViagem = getLocalStorage()
  dbViagem.push(viagem)
  setLocalStorage(dbViagem)
}
