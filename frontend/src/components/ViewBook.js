import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import BookContext from '../provider/BookContext';
import { useState } from 'react';
import Loader from './Loader';
import ImagePreview from './ImagePreview';
import { useBooksContext } from '../provider/BookProvider';
import { deleteBook, fetchBook } from '../features/BookFeatures';

function ViewBook() {
    const { loading, notify, setRolling } = useBooksContext();

    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [publishDate, setPublishDate] = useState();
    const [book, setBook] = useState({});

    const deleteBookHandle = () => {
        if (window.confirm("Are you sure want to delete book?")) {
            const asyncFunc = async () => {
                setRolling(true);
                const response = await deleteBook(id);
                setRolling(false);
                if (response.status === 200) {
                    navigate("/books");
                    notify("success", response.json.message);
                }
                else if (response.status === 404) {
                    navigate("/books");
                    notify("error", response.json.message);
                }
                else {
                    notify("error", `${response.json.message}! Please try again...`);
                }
            }

            asyncFunc();
        }
    }

    const convertDate = (ISODate) => {
        const data = new Date(ISODate);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const date = months[data.getMonth()] + ", " + data.getFullYear();
        setPublishDate(date);
    }

    useEffect(() => {
        let isMounted = true;
        const asyncFunction = async () => {
            const response = await fetchBook(id);

            if (response.status === 200) {
                if (isMounted) {
                    setBook(response.json);
                    setFiles(response.json.images);
                    convertDate(response.json.publishDate);
                }
            }
            else if (response.status === 404) {
                navigate("/books");
                notify("error", response.json.message);
            }
            else {
                navigate("/books");
                notify("error", `${response.json.message}! Please try again...`);
            }
        }

        asyncFunction();
        return () => {
            isMounted = false;
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h1 className="text-light text-center mt-3">View Book</h1>
            {loading && <Loader />}
            {!loading && <div className="container text-light">
                <div className="details">
                    {<ImagePreview files={files} edit={false} />}
                    <div className="box">
                        <div className="row text-primary">
                            <h2>{book.title}</h2>
                            <strong>${book.price}</strong>
                        </div>
                        <p><strong>Pages:</strong> {book.pages}</p>
                        <p><strong>Author(s):</strong> {book.authors ? book.authors.toString().replace(",", ", ") : ""}</p>
                        <p><strong>Publisher:</strong> {book.publisher}</p>
                        <p><strong>Publish Date:</strong> {publishDate}</p>
                        <p><strong>Language:</strong> {book.language}</p>
                        <p><strong>Category:</strong> {book.category}</p>
                        <p><strong>Tags:</strong> {book.tags && book.tags.map((tag, index) => <span key={index} style={{ padding: "0 0.3em 0.2em 0.3em" }} className="rounded-pill me-1 text-dark bg-light">{tag}</span>)}</p>
                        <Link className="btn btn-sm btn-primary" to={`/book/edit/${book._id}`}>Edit</Link>
                        <button onClick={deleteBookHandle} className="btn btn-sm btn-primary mx-3">Delete</button>
                    </div>
                </div>
                <h3>Description</h3>
                <p>{book.description}</p>
            </div>}
        </>
    );
}

export default ViewBook