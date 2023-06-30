import React from "react";
import { Link } from "react-router-dom";

function CheckoutItem(props) {
    const host = process.env.REACT_APP_SERVER_HOST;
    const { id, title, authors, images, price, quantity } = props.product;

    return (
        <div className="row">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                {/* <!-- Image --> */}
                <Link to={"/book/view/" + id}>
                    <img
                        src={`${host}/${images}`}
                        alt={title}
                        style={{ height: "150px" }}
                    />
                </Link>
                {/* <!-- Image --> */}
            </div>

            <div className="col-lg-6 col-md-6 mb-lg-0">
                {/* <!-- Data --> */}
                <p className="mb-1">
                    <strong>{title}</strong>
                </p>
                <p>By: {authors.join(", ")}</p>
                <button
                    type="button"
                    className="btn btn-fill-sea-green btn-sm me-1 mb-2 center py-1"
                    data-mdb-toggle="tooltip"
                    title="Remove item"
                    onClick={() => props.handleRemoveItem(id)}
                >
                    <i className="fa-solid fa-trash fs-5"></i>
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

            <div className="col-lg-3 col-md-6 mb-lg-0">
                {/* <!-- Quantity --> */}
                <p className="text-start text-md-center mb-1">
                    Quantity: {quantity}
                </p>
                {/* <!-- Quantity --> */}

                {/* <!-- Price --> */}
                <p className="text-start text-md-center mb-0">
                    <strong>PKR {(quantity * price).toFixed(2)}</strong>
                </p>
                {/* <!-- Price --> */}
            </div>
        </div>
    );
}

export default CheckoutItem;
