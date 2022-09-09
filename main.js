const books = [];
const RENDER_EVENT = "render-book";
const checkbox = document.getElementById("inputBookIsComplete");
let bookObjek = "";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  const generateID = generateId();
  if (checkbox.checked) {
    bookObjek = generateBookObjek(generateID, title, author, year, true);
  } else {
    bookObjek = generateBookObjek(generateID, title, author, year, false);
  }
  books.push(bookObjek);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  clearForm();
}

function generateId() {
  return +new Date();
}

function clearForm() {
  const author = (document.getElementById("inputBookAuthor").value = "");
  const title = (document.getElementById("inputBookTitle").value = "");
  const year = (document.getElementById("inputBookYear").value = "");
}

function generateBookObjek(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

let sub = document.querySelector("button#bookSubmit span");
checkbox.addEventListener("change", (event) => {
  if (event.currentTarget.checked) {
    sub.innerText = "Sudah selesai dibaca";
  } else {
    sub.innerText = "Belum selesai dibaca";
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted == false) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function makeBook(bookObjek) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObjek.title;
  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Penulis :" + " " + bookObjek.author;
  const bookyaear = document.createElement("p");
  bookyaear.innerText = "Tahun :" + " " + bookObjek.year;

  // const btn1 = document.createElement("button"); //tambakan Button
  // btn1.classList.add("green");
  // btn1.innerText = "Belum selesai di Baca";
  // const btn2 = document.createElement("button"); //tambakan Button
  // btn2.classList.add("red");
  // btn2.innerText = "Hapus buku";

  let action = document.createElement("div");
  // action.classList.add("action");
  // action.append(btn1, btn2);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookyaear);
  container.setAttribute("id", `book-${bookObjek.id}`);

  if (bookObjek.isCompleted) {
    action = document.createElement("div");
    action.classList.add("action");

    let btn1 = document.createElement("button"); //tambakan Button
    btn1.innerText = "Belum selesai di Baca";
    btn1.classList.add("green"); //Tambahkan class

    //Tambahkan class

    btn1.addEventListener("click", function () {
      //menambahkan fungsi Undo
      undoTaskFromCompleted(bookObjek.id);
    });

    let btn2 = document.createElement("button"); //tambakan Button
    btn2.classList.add("red");
    btn2.innerHTML = "Hapus buku";

    btn2.addEventListener("click", function () {
      //menambhkan fungsi hapus
      removeTaskFromCompleted(bookObjek.id);
    });
    action.append(btn1, btn2);
    container.append(action);
  } else {
    action = document.createElement("div");
    action.classList.add("action");
    //jika isCompleted bernilai True
    const btn1 = document.createElement("button"); //tambakan Button
    btn1.classList.add("green");
    btn1.innerText = "Sudah selesai di Baca"; //Tambahkan class
    //Tambahkan class

    btn1.addEventListener("click", function () {
      //menambahkan fungsi Undo
      addTaskToCompleted(bookObjek.id);
    });

    const btn2 = document.createElement("button"); //tambakan Button
    btn2.classList.add("red");
    btn2.innerText = "Hapus buku";

    btn2.addEventListener("click", function () {
      //menambhkan fungsi hapus
      removeTaskFromCompleted(bookObjek.id);
    });
    action.append(btn1, btn2);
    container.append(action);
  }
  return container;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findTodoIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  console.log(books);
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// checkbox.addEventListener("change", function () {
//   if (checkbox.checked=bookObjek.isCompleted) {
//     bookObjek.isCompleted = true;
//     document.dispatchEvent(new Event(RENDER_EVENT));
//   } else {
//     undoTaskFromCompleted();
//     document.dispatchEvent(new Event(RENDER_EVENT));
//   }
// });

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
  // console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
