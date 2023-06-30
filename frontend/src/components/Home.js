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
        const { totalResults, currentResults, limit, page, documents } =
            data.json;
        setLoading(false);

        if (data.status === 200) {
            setBooks(documents);
            setResponse({ totalResults, currentResults, limit, page });
        }
    };

    const fetchData = async () => {
        const data = await fetchBooks({ page: response.page + 1 });
        const { totalResults, currentResults, limit, page, documents } =
            data.json;

        if (data.status === 200 && data.json.currentResults !== 0) {
            setBooks((prevState) => [...prevState, ...documents]);
            setResponse({ totalResults, currentResults, limit, page });
        }
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading && <Loader />}
            {!loading && (
                <InfiniteScroll
                    dataLength={books.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={response.totalResults !== books.length}
                    loader={<Loader />}
                    endMessage={
                        <h4 className="text-center py-4">
                            This is all what we have...
                        </h4>
                    }
                    style={{ overflow: "initial" }}
                >
                    <div className="d-flex justify-content-center">
                        <div
                            className="d-grid g-cols-1 g-cols-md-2 g-cols-lg-3 g-cols-xl-4 w-fit"
                            style={{ rowGap: "1.5rem", columnGap: "0.75rem" }}
                        >
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    </div>
                </InfiniteScroll>
            )}
        </>
    );
}

export default Home;
