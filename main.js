document.addEventListener('DOMContentLoaded', () => {
    const inputBook = document.getElementById('inputBook');
    const searchBook = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    const BOOKSHELF_KEY = 'bookshelf_app';
  
    const getBooksFromLocalStorage = () => {
      return JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
    };
  
    const saveBooksToLocalStorage = (books) => {
      localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(books));
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
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = 'Hapus buku';
      deleteButton.addEventListener('click', () => deleteBook(book.id));
  
      actionContainer.append(toggleButton, deleteButton);
      bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);
  
      return bookItem;
    };
  
    const renderBooks = (books) => {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
      books.forEach((book) => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookshelfList.append(bookElement);
        } else {
          incompleteBookshelfList.append(bookElement);
        }
      });
    };
  
    const addBook = (title, author, year, isComplete) => {
      const books = getBooksFromLocalStorage();
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
    };
  
    const searchBooks = (query) => {
      const books = getBooksFromLocalStorage();
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      renderBooks(filteredBooks);
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
      searchBooks(query);
    });
  
    renderBooks(getBooksFromLocalStorage());
  });
  