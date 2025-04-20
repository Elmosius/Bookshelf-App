document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKS";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser ini tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function loadDataFromStorage() {
    if (isStorageExist()) {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(serializedData);

      if (data !== null) {
        books = data;
      }

      renderBookList();
    }
  }

  let books = [];

  function generateId() {
    return Number(new Date());
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const id = generateId();
    const bookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(bookObject);

    saveData();
    renderBookList();
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  }

  function findBook(bookId) {
    for (const book of books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (let index = 0; index < books.length; index++) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function moveBookToComplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    saveData();
    renderBookList();
  }

  function moveBookToIncomplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    saveData();
    renderBookList();
  }

  function deleteBook(bookId) {
    const bookTargetIndex = findBookIndex(bookId);

    if (bookTargetIndex === -1) return;

    books.splice(bookTargetIndex, 1);
    saveData();
    renderBookList();
  }

  function createBookElement(bookObject) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", bookObject.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.classList.add("rounded-md", "outline-1", "p-4");

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = bookObject.title;
    title.classList.add("text-xl", "font-semibold", "mb-2");

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = "Penulis: " + bookObject.author;
    author.classList.add("text-gray-600", "mb-1");

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = "Tahun: " + bookObject.year;
    year.classList.add("text-gray-600", "mb-2");

    const actionDiv = document.createElement("div");

    const isCompleteButton = document.createElement("button");
    isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    isCompleteButton.innerText = bookObject.isComplete ? "Belum selesai " : "Selesai dibaca";
    isCompleteButton.classList.add("bg-[#7D5A50]", "hover:bg-[#B4846C]", "text-white", "font-semibold", "py-2", "px-4", "rounded", "focus:outline-none", "focus:shadow-outline", "mr-2");
    isCompleteButton.addEventListener("click", () => {
      if (bookObject.isComplete) {
        moveBookToIncomplete(bookObject.id);
      } else {
        moveBookToComplete(bookObject.id);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerHTML = '<i class="mdi mdi-trash-can"></i>';
    deleteButton.classList.add("bg-red-700", "hover:bg-red-600", "text-white", "font-semibold", "py-2", "px-3", "rounded", "focus:outline-none", "focus:shadow-outline");
    deleteButton.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerHTML = '<i class="mdi mdi-pencil "></i>';
    editButton.classList.add("bg-yellow-600", "hover:bg-yellow-500", "text-white", "font-semibold", "py-2", "px-3", "rounded", "focus:outline-none", "focus:shadow-outline", "mr-2");
    editButton.addEventListener("click", () => {
      showEditForm(bookObject);
    });

    actionDiv.append(isCompleteButton, editButton, deleteButton);
    bookItem.append(title, author, year, actionDiv);

    return bookItem;
  }

  function renderBookList(filteredBooks = books) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of filteredBooks) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }

  function showEditForm(book) {
    const editBookSection = document.getElementById("editBookSection");
    const editBookFormTitle = document.getElementById("editBookFormTitle");
    const editBookFormAuthor = document.getElementById("editBookFormAuthor");
    const editBookFormYear = document.getElementById("editBookFormYear");
    const editBookFormIsCompleteEdit = document.getElementById("editBookFormIsCompleteEdit");
    const editBookId = document.getElementById("editBookId");

    editBookFormTitle.value = book.title;
    editBookFormAuthor.value = book.author;
    editBookFormYear.value = book.year;
    editBookFormIsCompleteEdit.checked = book.isComplete;
    editBookId.value = book.id;

    editBookSection.classList.remove("hidden");
  }

  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    alert("Buku berhasil ditambahkan! ");
  });

  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    let filteredBooks = [];
    if (searchTitle) {
      filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
    } else {
      filteredBooks = books;
    }

    renderBookList(filteredBooks);
  });

  const editBookForm = document.getElementById("editBookForm");
  const editBookSection = document.getElementById("editBookSection");

  editBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const bookId = parseInt(document.getElementById("editBookId").value);
    const newTitle = document.getElementById("editBookFormTitle").value;
    const newAuthor = document.getElementById("editBookFormAuthor").value;
    const newYear = parseInt(document.getElementById("editBookFormYear").value);
    const newIsComplete = document.getElementById("editBookFormIsCompleteEdit").checked;

    const bookIndex = findBookIndex(bookId);

    if (bookIndex !== -1) {
      books[bookIndex] = {
        id: bookId,
        title: newTitle,
        author: newAuthor,
        year: newYear,
        isComplete: newIsComplete,
      };

      saveData();
      renderBookList();
      editBookSection.classList.add("hidden");
    }
  });

  const cancelEditButton = document.getElementById("cancelEditButton");

  cancelEditButton.addEventListener("click", () => {
    const editBookSection = document.getElementById("editBookSection");
    editBookSection.classList.add("hidden");
  });

  loadDataFromStorage();
});
