document.addEventListener('DOMContentLoaded', () => {
  const inputBook = document.getElementById('inputBook');
  const searchBook = document.getElementById('searchBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  const modal = document.getElementById('modal');
  const span = document.getElementsByClassName('close')[0];
  const modalDeleteButton = document.getElementById('modalDeleteButton');

  const BOOKSHELF_KEY = 'bookshelf_app';

  const getBooksFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
  };

  const saveBooksToLocalStorage = (books) => {
    localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(books));
  };

  const renderBooks = (books) => {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
      } else {
        incompleteBookshelfList.appendChild(bookElement);
      }
    });
  };

  const addBook = (title, author, year, isComplete) => {
    const books = getBooksFromLocalStorage();
    const isDuplicate = books.some(book =>
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase() &&
      book.year === parseInt(year, 10)
    );
    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'Buku sudah ada!',
        text: 'Buku dengan judul, penulis, dan tahun yang sama sudah ada dalam daftar.',
        timer: 5000,
        timerProgressBar: true,
        toast: true,
        position: 'top'
      });
      return; 
    }
  
    const newBook = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year, 10),
      isComplete,
    };
    books.push(newBook);
    saveBooksToLocalStorage(books);
    renderBooks(books);
    simpanBuku(); 
  };  

  const toggleBookStatus = (bookId) => {
    const books = getBooksFromLocalStorage();
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage(books);
      renderBooks(books);
    }
  };

  const deleteBook = (bookId) => {
    const books = getBooksFromLocalStorage();
    const updatedBooks = books.filter((b) => b.id !== bookId);
    saveBooksToLocalStorage(updatedBooks);
    renderBooks(updatedBooks);
    hapusBuku();
  };  

  const editBook = (bookId, newTitle, newAuthor, newYear) => {
    const books = getBooksFromLocalStorage();
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;
      saveBooksToLocalStorage(books);
      renderBooks(books);
      editBuku(); 
    }
  };

  const openDeleteConfirmation = (bookId) => {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    const modalDeleteButton = document.getElementById('modalDeleteButton');
    modalDeleteButton.onclick = function() {
      deleteBook(bookId);
      modal.style.display = 'none';
    };
  };  
  
  const openEditForm = (bookId) => {
    const books = getBooksFromLocalStorage();
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const modal = document.getElementById('modal');
      const editBookForm = document.getElementById('editBookForm');
      const editBookTitle = document.getElementById('editBookTitle');
      const editBookAuthor = document.getElementById('editBookAuthor');
      const editBookYear = document.getElementById('editBookYear');
  
      editBookTitle.value = book.title;
      editBookAuthor.value = book.author;
      editBookYear.value = book.year;
  
      modal.style.display = 'block';
  
      editBookForm.onsubmit = function(event) {
        event.preventDefault();
        const newTitle = editBookTitle.value;
        const newAuthor = editBookAuthor.value;
        const newYear = editBookYear.value;
        if (newTitle && newAuthor && newYear) {
          editBook(book.id, newTitle, newAuthor, parseInt(newYear, 10));
          modal.style.display = 'none';
        }
      };
    }
  };  

  const createBookElement = (book) => {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.dataset.id = book.id;

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = book.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${book.author}`;
    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${book.year}`;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const toggleButton = document.createElement('button');
    toggleButton.classList.add(book.isComplete ? 'green' : 'red');
    toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

    const editButton = document.createElement('button');
    editButton.classList.add('blue');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => openEditForm(book.id));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    
    actionContainer.append(toggleButton, editButton, deleteButton);
    bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

    return bookItem;
  };

  inputBook.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    addBook(title, author, year, isComplete);
    inputBook.reset();
  });

  searchBook.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    const books = getBooksFromLocalStorage();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    renderBooks(filteredBooks);
  });

  span.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  renderBooks(getBooksFromLocalStorage());
});

const swalConfig = {
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
};

function simpanBuku() {
  Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: 'Buku berhasil disimpan!'
  });
}

function hapusBuku() {
  Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: 'Buku berhasil dihapus!'
  });
}

function editBuku() {
  Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: 'Buku berhasil diedit!'
  });
}

function tambahBuku() {
  Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: 'Buku berhasil ditambahkan!'
  });
}
