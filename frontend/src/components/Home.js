import React, { useEffect } from "react";
import BookCard from "./BookCard";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBooks } from "../features/BookFeatures";

function Home() {
    const { setBooks, books } = useBooksContext();

    const asyncFunc = async () => {
        const data = await fetchBooks();

        if (data.status === 200) {
            setBooks(data.json);
        }
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h1 className="text-light text-center mt-3">Products</h1>

            <div className="py-4">
                <div className="row g-4 mb-5">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
