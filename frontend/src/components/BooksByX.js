import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "./BookCard";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBooks, kebabToTitle } from "../features/BookFeatures";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";

function BooksByX() {
    const params = useParams();
    const { param1, param2 } = params;
    const { books, setBooks, loading, setLoading } = useBooksContext();
    const [response, setResponse] = useState({ totalResults: 0, page: 0 });

    const asyncFunc = async () => {
        setLoading(true);
        const data = await fetchBooks({ [param1]: kebabToTitle(param2) });
        const { totalResults, currentResults, limit, page, documents } =
            data.json;
        setLoading(false);

        if (data.status === 200) {
            console.log(data);
            setBooks(documents);
            setResponse({ totalResults, currentResults, limit, page });
        }
    };

    const fetchData = async () => {
        const data = await fetchBooks({
            page: response.page + 1,
            [param1]: param2,
        });
        const { totalResults, currentResults, limit, page, documents } =
            data.json;

        if (data.status === 200 && data.json.currentResults !== 0) {
            console.log(data);
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
            <h2 className="text-light mt-3 mb-4 text-center">
                {param1 === "authors" && "Books of " + kebabToTitle(param2)}
                {param1 === "language" && kebabToTitle(param2) + " Books"}
            </h2>
            <div className="py-4">
                {!loading && books.length !== 0 ? (
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
                ) : (
                    <h4 className="text-center text light">
                        No Books Found :)
                    </h4>
                )}
            </div>
        </>
    );
}

export default BooksByX;
