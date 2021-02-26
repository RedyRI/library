let myLibrary = [];


if(localStorage.length != 0) {
    let storedBooks = JSON.parse(JSON.stringify(localStorage));
    console.log(storedBooks);
    for (let key in storedBooks) {
        console.log(key);
        if (key == 'lastid') {
            console.log(storedBooks[key]);
        } else {
            myLibrary.push(JSON.parse(storedBooks[key]));
            
        }
    }
} else {
    localStorage.setItem('lastid', 0);
}

myLibrary.forEach(item => item.showing = false)

const bookIdGenerator = (function() {
    let x = +localStorage.getItem('lastid');
    return function() {
        return x += 1;
    }
})();

let main = document.querySelector('.main');
let addForm = document.querySelector('.form-place');
let addButton = document.querySelector('.add-book');
let save = document.querySelector('.save');
let closeBtn = document.querySelector('.close')

addButton.addEventListener('click', e => {
    document.querySelectorAll('input[type=text]').forEach(item => {
        item.value = '';
    })
    document.querySelector('input[type=number]').value = '';

    document.querySelector('select').value = 'not selected'
    //addForm.style.top = `${window.pageYOffset}px`;
    addForm.classList.toggle('hide');
    addButton.classList.toggle('animate');
});

// save the new book
save.addEventListener('click', e => {
    e.preventDefault();
    let newBook = createBook(addForm);

    if (newBook) {
        myLibrary.push(newBook);
        addForm.classList.toggle('hide');
        addButton.classList.toggle('animate');
        showLibrary();
    }
    // /////
    // /////
});

// a function to cancel te adding a  book form
closeBtn.addEventListener('click', e => {
    addForm.classList.toggle('hide');
    addButton.classList.toggle('animate');
})

// close if click is made in the modal
window.addEventListener('click', e =>{
    if(e.target == addForm) {
    addForm.classList.toggle('hide');
    addButton.classList.toggle('animate');
    }
})

window.addEventListener('click', e =>{
    if(e.target == editForm) {
    editForm.style.display = 'none';
    }
})


function createBook(field, id) {
    console.log(field);
    let bookId;
    if (id) {
        bookId = id;
    } else {
        bookId = bookIdGenerator();
    }
    let readed;
    let book;
    let info = field.querySelectorAll('input[type=text]');
    let pages = field.querySelector('input[type=number]');
    let read = field.querySelector('.read-value');
    let title = info[0].value;
    let author = info[1].value;
    let page = pages.value;
    if(read.value == "yes") {
        readed = true;
    } else {
        readed = false;
    }

    if(validate('title', title)) {
        if(validate('author', author)) {
            if(validate('pages', page)) {
                if(validate('read', read.value)) {
                    alert('have you read the book?')
                } else {
                    let book = new Book(title, author, page, readed, false, bookId);
                    localStorage.setItem(bookId, JSON.stringify(book));
                    localStorage.setItem('lastid', bookId)
                    return book;
                }
            } else {
                alert('enter a valid number for pages')
            }
        }else {
            alert('Enter a valid author')
        }
    } else {
        alert('Enter a valid title')
    }
}


function createCard(book) {

    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-id', book.id)

    let cardHeader = document.createElement('div'); // added
    cardHeader.classList.add('card-header'); // added
    let editImg = document.createElement('div'); // added
    editImg.classList.add('edit-img') // added
    let cardTitle = createAndAddContent('h3', book.title);
    cardTitle.classList.add('title')
    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(editImg);

    let cardAuthor = createAndAddContent('p', `-Written by ${book.author}`)
    cardAuthor.classList.add('author')
    let cardPages = createAndAddContent('p', `-Contains ${book.pages} pages`)
    cardPages.classList.add('pages');
    let deleteBtn = createAndAddContent('button', 'delete');
    deleteBtn.classList.add('delete');
    let readBtn = document.createElement('button');
    readBtn.classList.add('read');

    if(book.read) {
        readBtn.textContent = 'read';
    } else {
        readBtn.textContent = 'not read yet';
        readBtn.classList.toggle('not-read')
    }

    readBtn.addEventListener('click', e => {
        e.target.classList.toggle('not-read');
        let index = myLibrary.findIndex(item => item.id == book.id);
        if (e.target.classList.contains('not-read')) {
            e.target.textContent = 'not read yet';
            myLibrary[index].read = false;
            localStorage.setItem(book.id, JSON.stringify(myLibrary[index]))
        } else {
            e.target.textContent = 'read';
            myLibrary[index].read = true;
            localStorage.setItem(book.id, JSON.stringify(myLibrary[index]))
        }
    })

    let btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    btnContainer.appendChild(readBtn)
    btnContainer.appendChild(deleteBtn)
    let infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');
    infoContainer.appendChild(cardAuthor)
    infoContainer.appendChild(cardPages)

    // card.appendChild(cardTitle);
    card.appendChild(cardHeader); // added
    card.appendChild(infoContainer);
    card.appendChild(btnContainer);
    main.appendChild(card);
}

//function to create an element and add text content
function createAndAddContent(elem, content) {
    let element = document.createElement(elem);
    element.textContent = content;
    return element;
}

// form validation
function validate (field, str) {
    regex = {
        title: /^[:0-9a-z ]{2,}$/i,
        author: /^[a-z ]{4,}$/i,
        pages:/^[0-9]+/,
        read: /not selected/,
    }
    return regex[field].test(str)
}

function showLibrary () {
    console.log('showing libreary');
    myLibrary.forEach(item => {
         console.log('item showed');
         if(item.showing == false) {
             createCard(item)
             item.showing = true;
        }
    })
}



let filter = document.querySelector('#filter');
let filterInput = document.querySelector('.filter-char')

filterInput.addEventListener('keyup', e => {
    // get the value to compare with
    let filterType = filter.value;
    let filterChar = new RegExp(filterInput.value, 'i');
    // get all the cards creaated
    let cards = document.querySelectorAll('.card');
    cards.forEach(item => {

        if(filterType == 'title' || filterType == 'author') {
            let elem = item.querySelector(`.${filterType}`);
            if(filterChar.test(elem.textContent)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    })
})

filter.addEventListener('change', e => {
    let cards = document.querySelectorAll('.card');
    filterInput.value = '';
    cards.forEach(item => {
    if(filter.value == 'read') {
        document.querySelector('.select-section > input').style.display = 'none';
        let a = item.querySelector('.read').textContent;
        if (a == 'read') {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    } else if(filter.value == 'not-read') {
        console.log('not-read');
        document.querySelector('.select-section > input').style.display = 'none';
        let a = item.querySelector('.read').textContent;
        if (a == 'not read yet') {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    } else {
        item.style.display = 'flex';
        document.querySelector('.select-section > input').style.display = 'block';
    }

    })
})


let editForm = document.querySelector('.edit-form');
let cardToBeEdited = 0;
console.log(cardToBeEdited);

// show the edition section
main.addEventListener('click', e => {
    if (e.target.classList.contains('edit-img')) {
        editForm.style.display = 'block';
        let targ = e.target.parentNode.parentNode;
        let t = targ.querySelector('.title').textContent;
        let a = targ.querySelector('.author').textContent;
        let p = targ.querySelector('.pages').textContent;
        let r = targ.querySelector('.read').textContent; 
        console.log(t,a,p,r);
        
        let info = editForm.querySelectorAll('input[type=text]');
        let pages = editForm.querySelector('input[type=number]');
        let read = editForm.querySelector('#edit-read');
        info[0].value = t;
        info[1].value = a.slice(12,);
        pages.value = parseInt(p.slice(10,));
        if(r == "read") {
            read.value = 'yes';
        } else {
            read.value = 'no';
        }
        cardToBeEdited = targ.getAttribute('data-id');
        console.log(cardToBeEdited);

    }
});

let saveEdited = editForm.querySelector('.save-edited');
saveEdited.addEventListener('click', e => {
    e.preventDefault();
    let book = createBook(editForm, cardToBeEdited);
    localStorage.setItem(book.id, JSON.stringify(book));
    if(book) {
        editForm.style.display = 'none';
        let index = myLibrary.findIndex(item => item.id == cardToBeEdited);
        myLibrary.splice(index, 1, book);
        function replaceBook(cb) {
            main.querySelectorAll('.card').forEach(item => {
                main.removeChild(item);
            })
            
            myLibrary.forEach(item => {
                item.showing = false;
            });

            cb(main);
        }

        replaceBook((elem) => {
            let allNotShowing = myLibrary.every(item => (item.showing == false))
            if(elem.querySelectorAll('.card').length == 0 && allNotShowing) {
                showLibrary();
            } else {
                console.log('something went wrong');
            }
        })

    }

})

// close the form that edits the content
editForm.addEventListener('click', e => {
    if (e.target.classList.contains('close')) {
        console.log('close');
        editForm.style.display = 'none';
    }
})

// define the array that holds all the entries (books)

// define the book constructor
function Book(title, author, pages, read, showing, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.showing = showing;
    this.id = id;
    this.info = () => {
        let r;
        if(this.read) {
            r = 'Already read';
        } else {
            r = 'not read yet';
        }

        return `${this.title} by ${this.author}, ${this.pages}, ${r}`
    }
}

// function to remove a card asynchronous way
main.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        if(confirm('Are you sure?')) {
            function printOnScreen(cb) {
                let elem = e.target.parentNode.parentNode
                let dataId = elem.getAttribute('data-id');
                localStorage.removeItem(dataId);
                let index = myLibrary.findIndex(item => item.id == dataId);
                myLibrary.splice(index, 1);
                main.querySelectorAll('.card').forEach(item => {
                    main.removeChild(item);
                });
                myLibrary.forEach(item => {
                    item.showing = false;
                })
                cb(main);
            }

            printOnScreen((elem) => {
                let allNotShowing = myLibrary.every(item => (item.showing == false));
                if(elem.querySelectorAll('.card').length == 0 && allNotShowing) {
                    showLibrary();
                } else {
                    console.log('something went wrong');
                }
            })
        }
    }
})

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
    console.log('available and ready to use');
}

showLibrary();

window.addEventListener('unload', e => {
    myLibrary.forEach(item => item.showing == false)
})