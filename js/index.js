const baseUrl = `http://localhost:3000/books`






document.addEventListener("DOMContentLoaded", function() {

    const list = document.querySelector("#list")
    const show = document.querySelector("#show-panel")

    function showBook(e) {
        getBook(e).then(book => {
            const container = `<div>
                <img src="${book.img_url}">
                <h1>${book.title}</h1>
                <h2>${book.author}</h2>
                <p>${book.description}</p>
                <ul>
                ${book.users.map(user => `<li>${user.username}</li>`).join('')}
                </ul>
                
            </div>`
            const button = document.createElement('button')
            button.innerText = 'LIKE'
            if(book.users[book.users.length - 1].id === 1){
                button.innerText = 'UNLIKE'
            }
            button.dataset.bookId = book.id
            show.innerHTML = container
            show.appendChild(button)
        })
    }

    function getBook(e) {
        return fetch(baseUrl + `/${e.target.dataset.bookId}`)
                .then(res => res.json())
    }
    
    function listBooks(books) {
        books.forEach(book => {
            const item = document.createElement('li')
            item.dataset.bookId = book.id
            item.textContent = book.title
            item.addEventListener("click", showBook)
            list.appendChild(item)
        })
    }

    function getBooks() {
        fetch(baseUrl)
        .then(res => res.json())
        .then(books => listBooks(books))
    }

    function changeLikes(e, id, body) {
        fetch(baseUrl + `/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(() => showBook(e))
    }

    getBooks()

    function handleClick(e) {
        if(e.target.tagName === "BUTTON"){
            console.log(e.target)
            const id = e.target.dataset.bookId
            if(e.target.innerText === "LIKE"){
                getBook(e).then(book => {
                    const users = book.users
                    const body = { users: [...users, { "id": 1, "username": "pouros"}]}
                    changeLikes(e, id, body)
                })
                
            } else{
                console.log('UNLIKE THE BOOK')
                getBook(e).then(book => {
                    book.users.pop()
                    const body = { users: [...book.users]}
                    changeLikes(e, id, body)
                })

            }
        }
    }

    show.addEventListener("click", handleClick)











});
