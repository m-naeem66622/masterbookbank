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
    const [oldParams, setOldParams] = useState({
        param1: param1,
        param2: param2,
    });
    const { books, setBooks, loading, setLoading } = useBooksContext();
    const [response, setResponse] = useState({ totalResults: 0, page: 0 });

    const asyncFunc = async () => {
        setLoading(true);
        const data = await fetchBooks({ [param1]: kebabToTitle(param2) });
        const { totalResults, currentResults, limit, page, documents } =
            data.json;
        setLoading(false);
        setOldParams({ param1, param2 });
        if (data.status === 200) {
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
            setBooks((prevState) => [...prevState, ...documents]);
            setResponse({ totalResults, currentResults, limit, page });
        }
    };

    useEffect(() => {
        if (oldParams.param1 !== param1 || oldParams.param2 !== param2) {
            asyncFunc();
            window.scrollTo(0, 0);
        }

        // eslint-disable-next-line
    }, [params]);

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            {/* <h2 className="mt-3 mb-4 text-center">
                {param1 === "authors" && "Books of " + kebabToTitle(param2)}
                {param1 === "language" && kebabToTitle(param2) + " Books"}
            </h2> */}
            {loading && <Loader />}
            {!loading && books.length !== 0 ? (
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
            ) : (
                <h4 className="text-center text light">No Books Found :)</h4>
            )}
        </>
    );
}

export default BooksByX;
