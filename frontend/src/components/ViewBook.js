import React, { useEffect, useState } from "react";
import ImagePreview from "./ImagePreview";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBook, fetchBooks, titleToKebab } from "../features/BookFeatures";
import { Link, useParams } from "react-router-dom";
import Page404 from "./Page404";
import Loader from "./Loader";
import BookCard from "./BookCard";

function ViewBook() {
    const { loading, setLoading, cart, dispatchCart } = useBooksContext();
    const [response, setResponse] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [relatedBooks, setRelatedBooks] = useState([]);

    const params = useParams();
    const { id } = params;

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchBook(id);
        if (res.status === 200) {
            res.json.publishDate = new Date(
                res.json.publishDate
            ).toLocaleString("default", { month: "long", year: "numeric" });
            setResponse(res);
            document.title = res.json.title + " | Master Book Bank";
        }
        setLoading(false);
    };

    const fetchRelated = async () => {
        const res = await fetchBooks({
            limit: 4,
            categories: response.json.categories,
        });
        if (res.status === 200) {
            setRelatedBooks(
                // filter the opened document
                res.json.documents.filter((document) => document._id !== id)
            );
        }
    };

    const handleMinusQty = () => {
        setQuantity((prevState) => {
            let updatedState = prevState;
            if (updatedState > 1) {
                // Decrement quantity by 1 only if it is greater than 1
                updatedState -= 1;
            }
            return updatedState;
        });
    };

    const handlePlusQty = () => {
        setQuantity((prevState) => {
            let updatedState = prevState;
            if (updatedState < response.json.inStock) {
                // Increment quantity by 1 only if it is less than inStock value
                updatedState += 1;
            }
            return updatedState;
        });
    };

    const handleAddOrRemove = () => {
        if (cart[id]) {
            if (cart[id].quantity !== quantity && quantity !== 1) {
                const payload = { product: response.json, quantity };
                dispatchCart({ type: "ADD_TO_CART", payload, id });
            } else {
                dispatchCart({ type: "REMOVE_FROM_CART", id });
            }
        } else {
            const payload = { product: response.json, quantity };
            dispatchCart({ type: "ADD_TO_CART", payload, id });
        }
    };

    useEffect(() => {
        if (Object.keys(cart).length) {
            localStorage.setItem("cartItems", JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        asyncFunc();
        window.scrollTo(0, 0);

        // eslint-disable-next-line
    }, [params]);

    useEffect(() => {
        if (response.status === 200) {
            fetchRelated();
        }

        // eslint-disable-next-line
    }, [response]);

    const reviews = [
        { name: "Muhammad Naeem", rating: 2.3 },
        { name: "Sajjad Ali", rating: 3.5 },
        { name: "Malik Ahsan", rating: 4.6 },
    ];

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
            {!loading ? (
                response.status === 200 ? (
                    <>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="product-images-container position-relative">
                                    <div className="product-label rounded-circle position-absolute center text-bg-sea-green">
                                        <span>-29%</span>
                                    </div>
                                    <div className="product-image-wrap">
                                        <ImagePreview
                                            files={response.json.images}
                                            edit={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mt-4 mt-md-0">
                                <div className="product-summary-wrap text-gray">
                                    <h1>{response.json.title}</h1>
                                    <h4>
                                        By{" "}
                                        {response.json.authors.map(
                                            (author, index) => (
                                                <Link
                                                    key={index}
                                                    to={
                                                        "/books/authors/" +
                                                        titleToKebab(author)
                                                    }
                                                    className="me-2"
                                                >
                                                    {author}
                                                </Link>
                                            )
                                        )}
                                    </h4>
                                    <hr className="my-2" />
                                    <p className="h5 text-success">
                                        <span
                                            className={`badge bg-${
                                                response.json.inStock
                                                    ? "success"
                                                    : "danger"
                                            }`}
                                        >
                                            {response.json.inStock
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>
                                    </p>
                                    <p className="price fs-4 fw-semibold">
                                        <del
                                            aria-hidden="true"
                                            className="text-gray-light me-2"
                                        >
                                            ₨{response.json.price}
                                        </del>
                                        <ins className="text-sea-green">
                                            ₨
                                            {(
                                                response.json.price *
                                                (1 - 29 / 100)
                                            ).toFixed(2)}
                                        </ins>
                                    </p>
                                    <h6 className="">
                                        Publisher:{" "}
                                        <Link
                                            to={
                                                "/books/publisher/" +
                                                titleToKebab(
                                                    response.json.publisher
                                                )
                                            }
                                        >
                                            {response.json.publisher}
                                        </Link>
                                    </h6>
                                    <h6 className="">
                                        Language:{" "}
                                        <Link
                                            to={
                                                "/books/language/" +
                                                titleToKebab(
                                                    response.json.language
                                                )
                                            }
                                        >
                                            {response.json.language}
                                        </Link>
                                    </h6>
                                    <h6 className="">
                                        No. of Pages: {response.json.pages}
                                    </h6>
                                    <h6 className="">
                                        Categories:{" "}
                                        {response.json.categories.map(
                                            (category, index) => (
                                                <Link
                                                    key={index}
                                                    className="me-2"
                                                    to={
                                                        "/books/categories/" +
                                                        titleToKebab(category)
                                                    }
                                                >
                                                    {category}
                                                </Link>
                                            )
                                        )}
                                    </h6>
                                    <h6 className="">
                                        Publish Date:{" "}
                                        {response.json.publishDate}
                                    </h6>
                                    <hr className="mt-2 mb-3" />
                                    <label className="h6 mb-0">Quantity:</label>
                                    <span className="d-flex flex-wrap">
                                        <button
                                            disabled={response.json.inStock < 1}
                                            onClick={handleMinusQty}
                                            className="btn btn-fill-sea-green px-3 me-2 center mt-2"
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <input
                                            disabled={response.json.inStock < 1}
                                            readOnly
                                            min="1"
                                            max="6"
                                            name="quantity"
                                            type="number"
                                            className="form-control w-auto mt-2"
                                            value={quantity}
                                        />
                                        <button
                                            disabled={response.json.inStock < 1}
                                            onClick={handlePlusQty}
                                            className="btn btn-fill-sea-green px-3 ms-2 me-3 mt-2"
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                        <button
                                            disabled={response.json.inStock < 1}
                                            onClick={handleAddOrRemove}
                                            className="btn btn-fill-sea-green mt-2"
                                        >
                                            {response.json.inStock > 0
                                                ? cart[id]
                                                    ? cart[id].quantity !==
                                                          quantity &&
                                                      quantity !== 1
                                                        ? "Update Cart"
                                                        : "Remove from Cart"
                                                    : "Add to Cart"
                                                : "Add to Cart"}
                                        </button>
                                    </span>
                                    {/* <!-- Price --> */}
                                    {quantity > 1 && (
                                        <p className="h5 fw-semibold mt-2">
                                            Total:{" "}
                                            {(
                                                quantity *
                                                (response.json.price *
                                                    (1 - 29 / 100))
                                            ).toFixed(2)}
                                        </p>
                                    )}
                                    {/* <!-- Price --> */}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <ul
                                className="nav nav-tabs justify-content-center"
                                id="descriptionAndReview"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active"
                                        id="description"
                                        data-bs-toggle="tab"
                                        data-bs-target="#description-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="description-pane"
                                        aria-selected="true"
                                    >
                                        Description
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        id="reviews"
                                        data-bs-toggle="tab"
                                        data-bs-target="#reviews-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="reviews-pane"
                                        aria-selected="false"
                                    >
                                        Reviews ({reviews.length})
                                    </button>
                                </li>
                            </ul>
                            <div
                                className="tab-content mt-4"
                                id="descriptionAndReviewContent"
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="description-pane"
                                    role="tabpanel"
                                    aria-labelledby="description"
                                >
                                    <p className="text-justify">
                                        Lorem, ipsum dolor sit amet consectetur
                                        adipisicing elit. Inventore facilis quod
                                        esse dignissimos, consectetur, molestiae
                                        corrupti ab eaque sapiente, repellat
                                        totam molestias omnis hic incidunt est
                                        provident! Eligendi ex inventore modi
                                        provident, exercitationem voluptatum
                                        corrupti asperiores recusandae saepe
                                        assumenda et maxime, a reiciendis magni
                                        ipsa incidunt, laborum quis totam
                                        molestiae excepturi sit adipisci. Veniam
                                        nostrum obcaecati ab saepe quaerat
                                        possimus asperiores tenetur
                                        exercitationem adipisci similique
                                        reprehenderit, ratione ut animi, quam
                                        iusto voluptatibus eligendi earum quidem
                                        modi. Dolore sequi repudiandae enim
                                        cupiditate culpa velit facere
                                        perspiciatis quod id a eius voluptatem
                                        ex ipsum autem recusandae, earum
                                        quibusdam maiores minima quae nam!
                                    </p>
                                </div>
                                <div
                                    className="tab-pane fade mx-2 mx-sm-3 mx-md-5"
                                    id="reviews-pane"
                                    role="tabpanel"
                                    aria-labelledby="reviews"
                                    tabIndex="0"
                                >
                                    {reviews.length ? (
                                        reviews.map((review, index) => (
                                            <div key={index}>
                                                <Review data={review} />
                                                {review.length !==
                                                    index + 1 && (
                                                    <hr className="my-2" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <h4 className="mt-3 mb-5 text-center">
                                            This book has no reviews yet...
                                        </h4>
                                    )}
                                </div>
                            </div>
                        </div>
                        <h2 className="py-2 border-top border-bottom mb-4 text-gray fw-bold text-center">
                            You may also like
                        </h2>
                        <div className="d-flex justify-content-center">
                            <div
                                className="d-grid g-cols-1 g-cols-md-2 g-cols-lg-3 g-cols-xl-4 w-fit"
                                style={{
                                    rowGap: "1.5rem",
                                    columnGap: "0.75rem",
                                }}
                            >
                                {relatedBooks.map((book) => (
                                    <BookCard key={book._id} book={book} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : response.status === 404 ? (
                    <Page404 />
                ) : null
            ) : (
                <Loader />
            )}
        </>
    );
}

export function Review(props) {
    const { name, rating } = props.data;
    return (
        <div className="my-3 text-gray">
            <div className="d-flex align-items-center">
                <img
                    className="rounded-circle"
                    style={{
                        width: "3rem",
                        height: "3rem",
                    }}
                    src="https://www.gravatar.com/avatar/?d=mp&f=y"
                    alt={name}
                />
                <div className="ms-3">
                    <p className="fw-bold mb-0">{name}</p>
                    <div className="d-flex align-items-center mt-1">
                        {Array.from({ length: 5 }, (_, index) => {
                            if (index < Math.round(rating)) {
                                // Render rated stars
                                return (
                                    <i
                                        key={index}
                                        style={{ color: "#facc15" }}
                                        className="fas fa-star"
                                    ></i>
                                );
                            } else {
                                // Render unrated stars
                                return (
                                    <i
                                        key={index}
                                        className="fas fa-star text-gray-light"
                                    ></i>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="fst-italic mt-2">
                <p>
                    This is the bag of my dreams. I took it on my last vacation
                    and was able to fit an absurd amount of snacks for the many
                    long and hungry flights.
                </p>
            </div>
        </div>
    );
}

export default ViewBook;
