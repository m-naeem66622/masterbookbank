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
