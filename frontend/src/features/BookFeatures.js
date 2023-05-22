const host = process.env.REACT_APP_SERVER_HOST;

// Fetch All Books
export const fetchBooks = async (params = {}) => {
    const url = `${host}/api/book/fetchAll?`;
    const options = { method: "GET" };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(function (k) {
            return esc(k) + "=" + esc(params[k]);
        })
        .join("&");

    const response = await fetch(url + query, options);
    const json = await response.json();

    const obj = {
        status: response.status,
        json,
    };
    return obj;
};

// Fetch Book
export const fetchBook = async (bookID) => {
    const url = `${host}/api/book/fetch/${bookID}`;
    const options = {
        method: "GET",
    };
    const response = await fetch(url, options);
    const json = await response.json();

    const obj = {
        status: response.status,
        json,
    };
    return obj;
};

// Prepare Form to send
const prepareForm = (book, files) => {
    // Validating Fields
    book.authors = book.authors.toString();
    book.tags = book.tags.toString();
    book.categories = book.categories.toString();

    book.authors = book.authors
        .split(/[,]/)
        .map((word) =>
            word
                .replace(/[^a-zA-Z0-9-\s]+/g, "")
                .trim()
                .replace(/\s*-\s*/g, "-")
        )
        .filter(Boolean);
    book.tags = book.tags.split(/[^\w']+/).filter(Boolean);
    book.categories = book.categories
        .split(/[,]/)
        .map((word) =>
            word
                .replace(/[^a-zA-Z0-9-\s]+/g, "")
                .trim()
                .replace(/\s*-\s*/g, "-")
        )
        .filter(Boolean);

    // Creating Form
    let formData = new FormData();

    // Appending book details to the form
    for (const key in book) {
        if (Object.hasOwnProperty.call(book, key)) {
            if (Array.isArray(book[key])) {
                for (let i = 0; i < book[key].length; i++) {
                    formData.append(`${key}[${i}]`, book[key][i]);
                }
            } else {
                formData.append(key, book[key]);
            }
        }
    }

    // Appending book images to the form
    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }
    return formData;
};

// Add Book
export const addBook = async (book, blob) => {
    const url = `${host}/api/book/create`;
    const options = {
        method: "POST",
        body: prepareForm(book, blob),
        headers: {
            authToken: localStorage.getItem("authToken"),
        },
    };
    const response = await fetch(url, options);
    const json = await response.json();

    const obj = {
        status: response.status,
        json,
    };
    return obj;
};

// Update Book
export const updateBook = async (book, blob, files) => {
    const url = `${host}/api/book/update/${book._id}`;
    const options = {
        method: "PUT",
        body: prepareForm(book, blob),
        headers: {
            authToken: localStorage.getItem("authToken"),
        },
    };
    const response = await fetch(url, options);
    const json = await response.json();

    const obj = {
        status: response.status,
        json,
    };
    return obj;
};

// Delete Book
export const deleteBook = async (bookID) => {
    const url = `${host}/api/book/delete/${bookID}`;
    const options = {
        method: "DELETE",
        headers: {
            authToken: localStorage.getItem("authToken"),
        },
    };
    const response = await fetch(url, options);
    const json = await response.json();

    const obj = {
        status: response.status,
        json,
    };
    return obj;
};

export const titleToKebab = (string) => {
    return string.toLowerCase().split(" ").join("-");
};

export const kebabToTitle = (string) => {
    return string
        .toLowerCase()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
