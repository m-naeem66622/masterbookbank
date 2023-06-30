import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBooks } from "../features/BookFeatures";
import InfiniteScroll from "react-infinite-scroll-component";

function Books() {
    document.title = "Books | Master Book Bank";
    const navigate = useNavigate();
    const { rolling, setRolling, notify } = useBooksContext();
    const [books, setBooks] = useState([]);
    const [response, setResponse] = useState({ totalResults: 0, page: 0 });

    const fetchData = async () => {
        const data = await fetchBooks({ page: response.page + 1 });
        if (data.status === 200) {
            setBooks((prevState) => [...prevState, ...data.json.documents]);
            delete data.json.documents;
            setResponse(data.json);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const asyncFunction = async () => {
            setRolling(true);
            const data = await fetchBooks();

            if (data.status === 200) {
                if (data.json.length === 0) {
                    setRolling(false);
                    navigate("/admin/book/add");
                    notify("warning", "No books found! Try to add.");
                } else {
                    if (isMounted) {
                        setBooks(data.json.documents);
                        delete data.json.documents;
                        setResponse(data.json);
                    }
                    setRolling(false);
                }
            }
        };

        asyncFunction();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {rolling && <Loader />}
            {!rolling && (
                <InfiniteScroll
                    dataLength={books.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={response.totalResults !== books.length}
                    loader={<Loader />}
                    endMessage={
                        books.length > 0 && (
                            <h4 className="text-center py-4">
                                This is all what we have...
                            </h4>
                        )
                    }
                    style={{ overflow: "initial" }}
                >
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="bg-sea-green text-light">
                                    Title
                                </th>
                                <th className="bg-sea-green text-light">
                                    Author(s)
                                </th>
                                <th className="bg-sea-green text-light text-center">
                                    Price
                                </th>
                                <th className="bg-sea-green text-light">
                                    Publisher
                                </th>
                                <th className="bg-sea-green text-light text-center">
                                    Pages
                                </th>
                                <th className="bg-sea-green text-light">
                                    Language
                                </th>
                                <th
                                    className="bg-sea-green text-light"
                                    style={{
                                        width: "1rem",
                                    }}
                                ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => {
                                return (
                                    <tr key={book._id}>
                                        <td>{book.title}</td>
                                        <td>
                                            {book.authors
                                                ? book.authors.toString()
                                                : "Not available"}
                                        </td>
                                        <td className="text-center">
                                            {book.price}
                                        </td>
                                        <td>{book.publisher}</td>
                                        <td className="text-center">
                                            {book.pages}
                                        </td>
                                        <td>{book.language}</td>
                                        <td>
                                            <Link
                                                to={`/admin/book/view/${book._id}`}
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </InfiniteScroll>
            )}
        </>
    );
}

export default Books;
