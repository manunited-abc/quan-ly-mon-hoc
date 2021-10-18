var api = "http://localhost:8080/subjects";
let stt = 1;
function start() {
  createSubject();
  handleReset();
  getData();
}
start();
// createSubject();

//Xoa  tung hang
function deleteRow(r, id) {
  var i = r.parentNode.parentNode.rowIndex;
  document.querySelector(".table-container >table").deleteRow(i);
  handleDelete(id);
}
//Lay du lieu tu API
function getData() {
  fetch(api, {})
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      stt = 1;
      var tables = document.querySelector(".table-container >table");
      var tableLength = document.querySelectorAll(".table-container >table td");
      var stts = data.length;
      for (var i = 0; i < data.length; i++) {
        var row = tables.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = stt++;
        var cell1 = row.insertCell(1);
        cell1.innerHTML = `${data[i].idSubject}`;
        var cell = row.insertCell(2);
        cell.innerHTML = `${data[i].nameSubject}`;
        var cell = row.insertCell(3);
        cell.innerHTML = `${data[i].numberOfCredits}`;
        var cell = row.insertCell(4);
        cell.innerHTML = `<span class="icon-edit" onclick= "handleUpdate(${i})" title="Sửa"><i class="material-icons">mode_edit</i></span>
                      <span class="icon-delete" onclick = "deleteRow(this,${data[i].idSubject})" title="Xóa"><i class="material-icons">delete</i></span>  
                                  
                      `;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//Xoa hang
function handleDelete(id) {
  var urlencoded = new URLSearchParams();
  urlencoded.append("idSubject", id);
  fetch(api + "/" + id, {
    method: "DELETE",
    body: urlencoded,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {});
}

function removeChildTable() {
  var node = document.querySelector(".table-container >table");
  var tableHeaderRowCount = 1;
  var rowCount = node.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    node.deleteRow(tableHeaderRowCount);
  }
}
function createSubject() {
  var btnAdd = document.querySelector("#btn-add");
  btnAdd.onclick = function () {
    fetch(api, {})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var idSubject = document.querySelector("#id-subject").value;
        var nameSubject = document.querySelector("#name-subject").value;
        var numberOfCredits = document.querySelector("#credits").value;
        var message = data.some(function (sub) {
          return sub.idSubject === idSubject;
        });
        if (message == true) {
          alert("Mã môn học đã tồn tại!");
        } else {
          if (idSubject != "") {
            stt++;
            var subject = {
              idSubject: idSubject,
              nameSubject: nameSubject,
              numberOfCredits: numberOfCredits,
            };
            handleCreate(subject);
            removeChildTable();
            getData();
          } else {
            alert("Bạn chưa nhập mã môn học !");
          }
        }
      });
  };
}
function checkID(id) {}
//Them mon hoc
function handleCreate(data) {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function () {});
}
function getDataFormInput() {
  return subject;
}

function handleReset() {
  document.querySelector("#btn-reset").onclick = function () {
    document.querySelector("#id-subject").value = "";
    document.querySelector("#name-subject").value = "";
    document.querySelector("#credits").value = null;
  };
}
//Updat mon hoc

function handleUpdate(index) {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var ids = document.querySelector("#id-subject")
      var nameS = document.querySelector("#name-subject")
      var creditsS = document.querySelector("#credits")

      ids.value =  data[index].idSubject;
      nameS.value = data[index].nameSubject;
      creditsS.value = data[index].numberOfCredits;

      btnAdd = document.querySelector("#btn-add");
      btnUpdate = document.querySelector(".btn-updates");

      btnAdd.setAttribute("style", "display: none");
      btnUpdate.setAttribute("style", "display: inline-block");
      document.querySelector("#id-subject").disabled = true;

      btnUpdate.onclick = function(){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        var raw = JSON.stringify({
          idSubject: data[index].idSubject,
          nameSubject: nameS.value,
          numberOfCredits: creditsS.value,
        });
  
        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
        };
  
        fetch(api + "/" + data[index].idSubject, requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
          location.reload();
      }
     
    });
}
