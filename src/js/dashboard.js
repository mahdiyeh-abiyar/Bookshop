const CLASSES = {
    NAME: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900',
    TD: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
};

const SELECTORS = {
    ADDBTN: '#addBtn',
    ADDFORM: '#addForm',
    CANCELBTN: '#cancelBtn',
    BACKDROP: '#backdrop',
    BOOKNAME: '#book-name',
    AUTHERNAME: '#author-name',
    SUMMARY: '#summary',
    PRICE: '#price',
    QUANTITY: '#quantity',
    ADDBOOK: '#addbook',
    BOOKTABLE: '#bookTable'
};

// DOM elements
const elements = {
    addBtn: document.querySelector(SELECTORS.ADDBTN),
    addForm: document.querySelector(SELECTORS.ADDFORM),
    cancelBtn: document.querySelector(SELECTORS.CANCELBTN),
    backdrop: document.querySelector(SELECTORS.BACKDROP),
    bookNameInput: document.querySelector(SELECTORS.BOOKNAME),
    authorNameInput: document.querySelector(SELECTORS.AUTHERNAME),
    summaryInput: document.querySelector(SELECTORS.SUMMARY),
    priceInput: document.querySelector(SELECTORS.PRICE),
    quantityInput: document.querySelector(SELECTORS.QUANTITY),
    addBookBtn: document.querySelector(SELECTORS.ADDBOOK),
    bookTable: document.querySelector(SELECTORS.BOOKTABLE)
};

// Event listeners
elements.addBtn.addEventListener('click', toggleForm);
elements.cancelBtn.addEventListener('click', toggleForm);
elements.backdrop.addEventListener('click', toggleForm);
elements.addBookBtn.addEventListener('click', addBook);

// Toggle form visibility
function toggleForm(e) {
    if (e) e.preventDefault();
    elements.addForm.classList.toggle('hidden');
}

// Add new book
async function addBook(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please login first');
        window.location.href = '/src/LoginForm.html';
        return;
    }

    // Validate required fields
    if (!elements.bookNameInput.value || !elements.authorNameInput.value || 
        !elements.priceInput.value || !elements.quantityInput.value) {
        alert('Please fill required fields');
        return;
    }

    const bookData = {
        title: elements.bookNameInput.value,
        author: elements.authorNameInput.value,
        summary: elements.summaryInput.value || '',
        price: elements.priceInput.value,
        quantity: elements.quantityInput.value
    };

    try {
        const response = await fetch('http://localhost:3000/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/src/LoginForm.html';
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || 'Error adding book');
        }
        
        saveBookToLocalStorage(data);
        addBookToTable(data);
        resetForm();
        toggleForm();
        alert('Book added successfully');
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Server error');
    }
}

// Add book to table UI
function addBookToTable(book) {
    const tableBody = elements.bookTable;
    const tr = document.createElement('tr');

    // Create table cells
    const tdName = document.createElement('td');
    tdName.textContent = book.title;
    tdName.className = CLASSES.NAME;

    const tdQuantity = document.createElement('td');
    tdQuantity.textContent = book.quantity;
    tdQuantity.className = CLASSES.TD;

    const tdPrice = document.createElement('td');
    tdPrice.textContent = book.price;
    tdPrice.className = CLASSES.TD;

    const tdId = document.createElement('td');
    tdId.textContent = book.id || '---';
    tdId.className = CLASSES.TD;

    // Action buttons
    const tdActions = document.createElement('td');
    tdActions.className = 'px-6 py-4 whitespace-nowrap flex';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<img src="assets/edit.svg" alt="Edit">';
    editBtn.className = 'mx-4 bg-transparent border-none';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<img src="assets/trash.svg" alt="Delete">';
    deleteBtn.className = 'bg-transparent border-none';

    tdActions.append(editBtn, deleteBtn);
    
    // Append cells to row
    tr.append(
        tdName,
        tdQuantity,
        tdPrice,
        tdId,
        tdActions
    );

    tableBody.appendChild(tr);
}

// Reset form fields
function resetForm() {
    elements.bookNameInput.value = '';
    elements.authorNameInput.value = '';
    elements.summaryInput.value = '';
    elements.priceInput.value = '';
    elements.quantityInput.value = '';
}

// Save book to localStorage
function saveBookToLocalStorage(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}