import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader";
import ImagePreview from "./ImagePreview";
import { useBooksContext } from "../provider/BookProvider";
import { deleteBook, fetchBook, titleToKebab } from "../features/BookFeatures";
import { Review } from "./ViewBook";
import Page404 from "./Page404";

function AdminViewBook() {
    document.title = "Admin Book Details | Master Book Bank";
    const { loading, notify, setRolling, setLoading } = useBooksContext();

    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();
    const [response, setResponse] = useState({});

    const deleteBookHandle = () => {
        if (window.confirm("Are you sure want to delete book?")) {
            const asyncFunc = async () => {
                setRolling(true);
                const response = await deleteBook(id);
                setRolling(false);
                if (response.status === 200) {
                    navigate("/admin/books");
                    notify("success", response.json.message);
                } else if (response.status === 404) {
                    navigate("/admin/books");
                    notify("error", response.json.message);
                } else {
                    notify(
                        "error",
                        `${response.json.message}! Please try again...`
                    );
                }
            };

            asyncFunc();
        }
    };

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchBook(id);

        if (res.status === 200) {
            res.json.publishDate = new Date(
                res.json.publishDate
            ).toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            setResponse(res);
            setLoading(false);
        } else if (res.status === 404) {
            setLoading(false);
            navigate("/admin/books");
            notify("error", res.json.message);
        } else {
            setLoading(false);
            navigate("/admin/books");
            notify("error", `${res.json.message}! Please try again...`);
        }
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

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
                                    <h6 className="d-flex flex-wrap">
                                        <span className="me-2">Tag</span>
                                        {response.json.tags &&
                                            response.json.tags.map(
                                                (tag, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            padding:
                                                                "0.1rem 0.5rem 0.2rem",
                                                        }}
                                                        className="rounded-pill me-1 text-light bg-gray fs-7"
                                                    >
                                                        {tag}
                                                    </span>
                                                )
                                            )}
                                    </h6>
                                    <div className="mt-4">
                                        <Link
                                            className="btn btn-fill-sea-green"
                                            to={`/admin/book/edit/${response.json._id}`}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={deleteBookHandle}
                                            className="btn btn-fill-sea-green mx-3"
                                        >
                                            Delete
                                        </button>
                                    </div>
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
                                                {reviews.length !==
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

export default AdminViewBook;
