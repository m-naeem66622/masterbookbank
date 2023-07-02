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
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                <symbol id="cart-minus">
                    <path
                        fill="currentColor"
                        d="M16.2 1.9C6.2 5.4.7 13.2.6 24s5.9 19.2 16.3 22.8C19.2 47.6 29 48 46 48c23.5 0 26 .2 28 1.8 2.5 2 1.3-3.9 26.1 125.7 32.7 170.7 30.8 162.1 38 174.1 7.2 11.9 20.2 23.5 32 28.8 13.4 5.8 5.9 5.6 171.1 5.6l155.1-1.4c9.8-3.5 15.2-11.7 15.2-22.6-.1-10-5-17.6-14-21.7-3.8-1.7-12.2-1.8-154.5-2.3l-150.5-.5-4.8-2.8c-5.8-3.4-10.2-9.8-11.7-17.1-2.2-10.4-4.8-26.1-4.3-26.9.2-.4 67.1-.7 148.7-.7l156.2-2c20-5.1 37.3-18.5 46.3-36 5.1-9.9 4.1-6.6 27.3-92.5 19.8-73.6 20.2-75.2 20.2-85.1.1-9.9 0-10.3-3.9-18-4.6-9-12-15.8-21.5-19.7l-6.43-1.06L329.9 32.2 120.3 32l-4.2-6.5C108.7 14.1 98 6.3 84.3 2.3 79.6 1 73 .6 50 .3 24.2 0 21 .2 16.2 1.9zM400 134.4c5.9 3.1 9 6.7 10.6 12.3 2.6 8.9-.8 17.5-8.6 22.1l-4.5 2.7-59.3.3c-40.3.2-60.5-.1-63.3-.8-9.4-2.6-16.4-13.9-14-22.8 2.2-7.8 7.8-13.4 15.4-15.3 1.8-.4 29.5-.7 61.7-.6 55 .2 58.7.3 62 2.1zM167.5 417c-11.3 2.5-19.9 7.3-27.3 15.5-12.9 14.1-15.7 34.2-7.3 52.9 4.5 10.2 16.4 20.3 28.4 24.1 26.5 8.5 54.3-6.5 61.2-33 2.8-10.8 1.3-25-3.5-34.5-4.9-9.6-18.2-20.5-28.7-23.5-6.9-2-17.4-2.7-22.8-1.5zm285.3.5c-8.5 2.1-14.4 5.3-20.7 11.1-16.3 15.1-20.5 37.9-10.6 57.3 12 23.6 40.6 32.9 65 21.1 5.5-2.7 15.1-11.9 18.7-18 11.5-19.8 7.9-44.3-8.9-60-7.6-7.1-10.1-8.5-20-11.1-8.8-2.2-15.4-2.3-23.5-.4z"
                    />
                </symbol>
                <symbol id="cart-plus">
                    <path
                        fill="currentColor"
                        d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"
                    />
                </symbol>
            </svg>
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
