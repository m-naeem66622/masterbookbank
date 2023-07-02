import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import { titleToKebab } from "../features/BookFeatures";
// import cartMinus from "../assets/cart-minus.svg";
// import cartXmark from "../assets/remove-cart.svg";

function BookCard(props) {
    const host = process.env.REACT_APP_SERVER_HOST;
    const { cart, dispatchCart } = useBooksContext();
    const { _id, title, authors, price, images, inStock } = props.book;

    const handleAddOrRemove = () => {
        if (cart[_id]) {
            dispatchCart({ type: "REMOVE_FROM_CART", id: _id });
        } else {
            const payload = { product: props.book, quantity: 1 };
            dispatchCart({ type: "ADD_TO_CART", payload, id: _id });
        }
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [cart]);

    return (
        <>
            <div
                className="card h-100 pt-3 text-gray"
                style={{ width: "270px", minWidth: "270px" }}
            >
                <div className="d-flex justify-content-center align-items-center">
                    <div className="position-relative">
                        <Link
                            className="link-unstyled"
                            to={"/book/view/" + _id}
                        >
                            <img
                                src={host + "/" + images[0]}
                                className="card-img-top w-auto rounded-0  border border-white border-4 shadow-disperse"
                                style={{
                                    maxHeight: "275px",
                                    maxWidth: "210px",
                                }}
                                alt={title + " Cover"}
                            />
                        </Link>
                    </div>
                </div>
                <div className="card-body d-flex flex-column justify-content-between pb-1">
                    <h5
                        className="card-title text-center"
                        style={{ height: "45px" }}
                    >
                        {title}
                    </h5>
                    <p className="card-subtitle text-truncate">
                        <strong>By: </strong>
                        {authors.map((author, index) => (
                            <Link
                                key={index}
                                title={author}
                                className="me-1"
                                to={"/books/authors/" + titleToKebab(author)}
                            >
                                {author}
                            </Link>
                        ))}
                    </p>
                    <p className="card-text">
                        <strong>Price: </strong>
                        {price}
                    </p>
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-between">
                        {inStock ? (
                            <>
                                <button
                                    onClick={handleAddOrRemove}
                                    type="button"
                                    className="btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                    style={{
                                        transition: "all 0.2s",
                                        width: "110px",
                                    }}
                                >
                                    <>
                                        {cart[_id] ? (
                                            <svg
                                                className="svg-inline--fa fs-5"
                                                viewBox="0 0 576 512"
                                            >
                                                <use xlinkHref="#cart-minus" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="svg-inline--fa fa-cart-plus fs-5"
                                                aria-hidden="true"
                                                focusable="false"
                                                viewBox="0 0 576 512"
                                            >
                                                <use xlinkHref="#cart-plus" />
                                            </svg>
                                        )}
                                    </>
                                    <span className="ms-2 fs-6">
                                        {cart[_id] ? "Remove" : "Add"}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                >
                                    <i className="fas fa-bag-shopping fs-5"></i>
                                    <span className="ms-2 fs-6">Buy Now</span>
                                </button>
                            </>
                        ) : (
                            <em className="text-danger text-center w-100 fw-bold py-1">
                                Out of Stock
                            </em>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookCard;
