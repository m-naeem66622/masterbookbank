import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBooks } from "../features/BookFeatures";
import InfiniteScroll from "react-infinite-scroll-component";

function Books() {
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
            setRolling(false);

            if (data.status === 200) {
                if (data.json.length === 0) {
                    navigate("/admin/book/add");
                    notify("warning", "No books found! Try to add.");
                } else {
                    if (isMounted) {
                        setBooks(data.json.documents);
                        delete data.json.documents;
                        setResponse(data.json);
                    }
                }
            } else {
                notify("error", `${data.json.message}! Please try again...`);
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
            <h1 className="text-light mt-3 mb-4 text-center">Your Books</h1>
            {!rolling && (
                <InfiniteScroll
                    dataLength={books.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={response.totalResults !== books.length}
                    loader={<Loader />}
                    endMessage={
                        <h4 className="text-center text-light p-4">
                            This is all what we have...
                        </h4>
                    }
                    style={{ overflow: "initial" }}
                >
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: "#2c3034" }}>
                                    Title
                                </th>
                                <th style={{ backgroundColor: "#2c3034" }}>
                                    Author(s)
                                </th>
                                <th
                                    style={{ backgroundColor: "#2c3034" }}
                                    className="text-center"
                                >
                                    Price
                                </th>
                                <th style={{ backgroundColor: "#2c3034" }}>
                                    Publisher
                                </th>
                                <th
                                    style={{ backgroundColor: "#2c3034" }}
                                    className="text-center"
                                >
                                    Pages
                                </th>
                                <th style={{ backgroundColor: "#2c3034" }}>
                                    Language
                                </th>
                                <th
                                    style={{
                                        width: "1rem",
                                        backgroundColor: "#2c3034",
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
