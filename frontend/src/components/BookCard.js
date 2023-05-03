import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import addCartIcon from "../assets/add-cart.svg";
import removeCartIcon from "../assets/remove-cart.svg";
import buyIcon from "../assets/bag-shopping-regular.svg";
import { useBooksContext } from "../provider/BookProvider";

function BookCard(props) {
    const host = process.env.REACT_APP_SERVER_HOST;
    const { cart, setCart } = useBooksContext();
    const { _id, title, authors, price, images } = props.book;

    const handleAddOrRemove = () => {
        if (cart[_id]) {
            setCart((prevState) => {
                const newState = { ...prevState };
                delete newState[_id];
                return newState;
            });
        } else {
            setCart((prevState) => ({
                ...prevState,
                [_id]: { product: props.book, quantity: 1 },
            }));
        }
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [cart]);

    return (
        <div className="col col-lg-4 col-xl-3 col-md-6 col-sm-12 d-flex">
            <div
                className="card h-100 pt-3"
                style={{ width: "270px", minWidth: "270px" }}
            >
                <Link className="link-unstyled" to={"/view/" + _id}>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="position-relative">
                            <img
                                src={`${host}/${images[0]}`}
                                className="card-img-top w-auto rounded-0  border border-white border-4"
                                style={{
                                    maxHeight: "275px",
                                    maxWidth: "210px",
                                    filter: "drop-shadow(0px 10px 10px rgba(0,0,0,.6))",
                                }}
                                alt="Book Cover"
                            />
                            <span
                                className="position-absolute badge rounded-circle bg-danger d-flex justify-content-center align-items-center flex-column fs-normal"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    right: "-10px",
                                    top: "-10px",
                                }}
                            >
                                <span>70%</span>
                                <span>Off</span>
                            </span>
                        </div>
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between pb-1">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-subtitle">
                            <strong>By: </strong>
                            {authors}
                        </p>
                        <p className="card-text">
                            <strong>Price: </strong>
                            {price}
                        </p>
                    </div>
                </Link>
                <div className="card-footer">
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center"
                            style={{
                                transition: "all 0.2s",
                                width: cart[_id] ? "110px" : "85px",
                            }}
                            onClick={handleAddOrRemove}
                        >
                            <img
                                width="28px"
                                src={cart[_id] ? removeCartIcon : addCartIcon}
                                alt="cart-icon"
                            />
                            <span className="ms-2 fs-6">
                                {cart[_id] ? "Remove" : "Add"}
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center"
                        >
                            <img width="20px" src={buyIcon} alt="buy-icon" />
                            <span className="ms-2 fs-6">Buy Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookCard;
