import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBooks } from "../features/BookFeatures";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";

function Home() {
    document.title = "Home | Master Book Bank";
    const { books, setBooks, loading, setLoading } = useBooksContext();
    const [response, setResponse] = useState({ totalResults: 0, page: 0 });

    const asyncFunc = async () => {
        setLoading(true);
        const data = await fetchBooks();
        setLoading(false);

        if (data.status === 200) {
            setBooks(data.json.documents);
            delete data.json.documents;
            setResponse(data.json);
        }
    };

    const fetchData = async () => {
        const data = await fetchBooks({ page: response.page + 1 });
        if (data.status === 200) {
            setBooks((prevState) => [...prevState, ...data.json.documents]);
            delete data.json.documents;
            setResponse(data.json);
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
                {/* {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))} */}
                {!loading && (
                    <InfiniteScroll
                        dataLength={books.length} //This is important field to render the next data
                        next={fetchData}
                        hasMore={response.totalResults !== books.length}
                        loader={<Loader />}
                        endMessage={
                            <h4 className="text-center text-light">
                                This is all what we have...
                            </h4>
                        }
                        style={{ overflow: "initial" }}
                    >
                        <div className="row g-4 mb-5">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
}

export default Home;
