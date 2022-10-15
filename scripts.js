class Book {
  constructor(id, title, author, year, isComplete) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.isComplete = isComplete;
  }
}

const addForm = document.querySelector(".form__add--book");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const year = document.querySelector("#year");
const readed = document.querySelector("#readed");
const buttonAdd = document.querySelector(".btn_add--book");
let finishReadedBookShelf = document.querySelector("#finishReaded");
let notFinishReadedBookShelf = document.querySelector("#notFinishReaded");
const searchInp = document.querySelector("#search");
const searchForm = document.querySelector(".form__search--book");

let finishReaded = JSON.parse(localStorage.getItem("finish")) || [];
let notFinisReaded = JSON.parse(localStorage.getItem("unFinish")) || [];

document.addEventListener("DOMContentLoaded", function () {
  if (finishReaded.length) {
    updateView(finishReadedBookShelf, finishReaded);
  }
  if (notFinisReaded.length) {
    updateView(notFinishReadedBookShelf, notFinisReaded);
  }
});

buttonAdd.addEventListener("click", function (e) {
  e.preventDefault();

  if (!title.value || !author.value || !year.value) {
    alert("please fill all fields");
    return;
  }
  const addBook = new Book(
    Date.now(),
    title.value,
    author.value,
    year.value,
    readed.checked
  );

  if (readed.checked) {
    localStorage.setItem("finish", JSON.stringify([...finishReaded, addBook]));
    finishReaded = JSON.parse(localStorage.getItem("finish"));
    updateView(finishReadedBookShelf, finishReaded);
  }
  if (!readed.checked) {
    localStorage.setItem(
      "unFinish",
      JSON.stringify([...notFinisReaded, addBook])
    );
    notFinisReaded = JSON.parse(localStorage.getItem("unFinish"));
    updateView(notFinishReadedBookShelf, notFinisReaded);
  }

  clearInput();
});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!searchInp.value) {
    return updateState();
  }
  let matchFinished = finishReaded.filter((e) =>
    e.title.match(searchInp.value)
  );
  let matchnotFinished = notFinisReaded.filter((e) =>
    e.title.match(searchInp.value)
  );

  updateView(finishReadedBookShelf, matchFinished);
  updateView(notFinishReadedBookShelf, matchnotFinished);
});

function renderBook(books) {
  return books
    .map((e) => {
      return `<div class="book">
    <h5>${e.title}</h5>
    <p>Penulis : <span>${e.author}</span></p>
    <p>Tahun : <span>${e.year}</span></p>
    <div class="">
      <button class="doneReaded" onClick=moveShelf(${JSON.stringify({
        id: e.id,
        isComplete: e.isComplete,
      })})>${e.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca"}</button>
      <button class="deleteButton" onClick=deleteBook(${JSON.stringify({
        id: e.id,
        isComplete: e.isComplete,
      })})>Hapus Buku</button>
      <button class="editButton" onClick=editBook(${JSON.stringify({
        id: e.id,
        isComplete: e.isComplete,
      })})>Edit Buku</button>
    </div>
  </div>`;
    })
    .join("");
}

function deleteBook(e) {
  if (e.isComplete) {
    localStorage.setItem(
      "finish",
      JSON.stringify(finishReaded.filter((book) => book.id !== e.id))
    );
    finishReaded = refreshData("finish");
    return updateView(finishReadedBookShelf, finishReaded);
  }
  if (!e.isComplete) {
    localStorage.setItem(
      "unFinish",
      JSON.stringify(notFinisReaded.filter((book) => book.id !== e.id))
    );
    notFinisReaded = refreshData("unFinish");
    return updateView(notFinishReadedBookShelf, notFinisReaded);
  }
}

function refreshData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function updateView(shelf, books) {
  return (shelf.innerHTML = renderBook(books));
}

function moveShelf(e) {
  let moveBook;
  if (!e.isComplete) {
    moveBook = JSON.parse(localStorage.getItem("unFinish")).filter(
      (book) => book.id == e.id
    )[0];
    moveBook.isComplete = true;
    localStorage.setItem(
      "unFinish",
      JSON.stringify(notFinisReaded.filter((book) => book.id !== e.id))
    );
    localStorage.setItem("finish", JSON.stringify([...finishReaded, moveBook]));
  }
  if (e.isComplete) {
    moveBook = JSON.parse(localStorage.getItem("finish")).filter(
      (book) => book.id == e.id
    )[0];
    moveBook.isComplete = false;
    localStorage.setItem(
      "finish",
      JSON.stringify(finishReaded.filter((book) => book.id !== e.id))
    );
    localStorage.setItem(
      "unFinish",
      JSON.stringify([...notFinisReaded, moveBook])
    );
  }
  updateState();
}

function clearInput() {
  title.value = "";
  year.value = "";
  author.value = "";
  readed.checked = false;
}

function editBook(e) {
  buttonAdd.remove();
  const buttonsEdit = document.querySelectorAll(".editButton");
  for (const buttonEdit of buttonsEdit) {
    buttonEdit.remove();
  }
  let editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.setAttribute("class", "btn_edit--book ");
  addForm.appendChild(editButton);
  let match;
  if (e.isComplete) {
    match = finishReaded.filter((book) => book.id == e.id)[0];
  }
  if (!e.isComplete) {
    match = notFinisReaded.filter((book) => book.id == e.id)[0];
  }

  title.value = match.title;
  author.value = match.author;
  year.value = match.year;
  readed.checked = match.isComplete;

  editButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!title.value || !author.value || !year.value) {
      alert("please fill all the fields");
    }

    const addBook = new Book(
      match.id,
      title.value,
      author.value,
      year.value,
      readed.checked
    );

    localStorage.setItem(
      "finish",
      JSON.stringify(finishReaded.filter((book) => book.id !== match.id))
    );
    localStorage.setItem(
      "unFinish",
      JSON.stringify(notFinisReaded.filter((book) => book.id !== match.id))
    );

    finishReaded = JSON.parse(localStorage.getItem("finish"));
    notFinisReaded = JSON.parse(localStorage.getItem("unFinish"));

    if (readed.checked) {
      localStorage.setItem(
        "finish",
        JSON.stringify([...finishReaded, addBook])
      );
    }
    if (!readed.checked) {
      localStorage.setItem(
        "unFinish",
        JSON.stringify([...notFinisReaded, addBook])
      );
    }
    updateState();
    location.reload();
  });
}

function updateState() {
  finishReaded = JSON.parse(localStorage.getItem("finish"));
  notFinisReaded = JSON.parse(localStorage.getItem("unFinish"));
  updateView(notFinishReadedBookShelf, notFinisReaded);
  updateView(finishReadedBookShelf, finishReaded);
}
