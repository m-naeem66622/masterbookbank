import React, { useEffect } from "react";
import minusIcon from "../assets/minus-solid.svg";
import plusIcon from "../assets/plus-solid.svg";
import trashIcon from "../assets/trash-solid.svg";
import { Link } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";

function CartItem(props) {
    const { cart, dispatchCart } = useBooksContext();
    const host = process.env.REACT_APP_SERVER_HOST;
    const { _id, title, authors, price, images, publisher, inStock } =
        props.book.product;

    const handleMinusQty = (id) => {
        dispatchCart({ type: "DECREMENT_QUANTITY", id });
    };

    const handlePlusQty = (id) => {
        dispatchCart({ type: "INCREMENT_QUANTITY", id });
    };

    const handleRemoveItem = (id) => {
        if (cart[id]) {
            dispatchCart({ type: "REMOVE_FROM_CART", id });
        }
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [cart]);

    return (
        <div className="row">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                {/* <!-- Image --> */}
                <Link to={"/book/view/" + _id}>
                    <img
                        src={`${host}/${images[0]}`}
                        className="w-100"
                        alt={title}
                    />
                </Link>
                {/* <!-- Image --> */}
            </div>

            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                {/* <!-- Data --> */}
                <p>
                    <strong>{title}</strong>
                </p>
                <p>Author(s): {authors.toString().replace(",", " ")}</p>
                <p>Publisher: {publisher}</p>
                <button
                    type="button"
                    className="btn btn-primary btn-sm me-1 mb-2"
                    data-mdb-toggle="tooltip"
                    title="Remove item"
                    onClick={() => handleRemoveItem(_id)}
                >
                    <img width="15px" src={trashIcon} alt="trash-icon" />
                </button>
                {/* <button
                    type="button"
                    className="btn btn-danger btn-sm mb-2"
                    data-mdb-toggle="tooltip"
                    title="Move to the wish list"
                >
                    <img src={} alt="" />
                </button> */}
                {/* <!-- Data --> */}
            </div>

            <div className="col-lg-4 col-md-6 mb-lg-0">
                {/* <!-- Quantity --> */}
                <div className="mb-4" style={{ maxWidth: "160px" }}>
                    <label className="form-label">Quantity</label>
                    <div className="d-flex">
                        <button
                            className="btn btn-primary px-3 me-2"
                            onClick={() => handleMinusQty(_id)}
                        >
                            <img
                                width="10px"
                                src={minusIcon}
                                alt="minus-icon"
                            />
                        </button>
                        <input
                            readOnly
                            min="1"
                            max={inStock}
                            name="quantity"
                            value={cart[_id].quantity}
                            type="number"
                            className="form-control"
                        />
                        <button
                            className="btn btn-primary px-3 ms-2"
                            onClick={() => handlePlusQty(_id)}
                        >
                            <img width="10px" src={plusIcon} alt="plus-icon" />
                        </button>
                    </div>
                </div>
                {/* <!-- Quantity --> */}

                {/* <!-- Price --> */}
                <p className="text-start text-md-center mb-0">
                    <strong>
                        PKR {(cart[_id].quantity * price).toFixed(2)}
                    </strong>
                </p>
                {/* <!-- Price --> */}
            </div>
        </div>
    );
}

export default CartItem;
