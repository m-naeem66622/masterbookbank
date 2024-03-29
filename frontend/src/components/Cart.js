import React from "react";
import CartItem from "./CartItem";
import { useBooksContext } from "../provider/BookProvider";
import { useNavigate } from "react-router-dom";

function Cart() {
    document.title = "Cart | Master Book Bank";
    const { cart, isUser } = useBooksContext();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (isUser) {
            const discount = 0;
            const products = Object.values(cart).map((item) => {
                return {
                    id: item.product._id,
                    title: item.product.title,
                    authors: item.product.authors,
                    images: item.product.images[0],
                    quantity: item.quantity,
                    price: item.product.price,
                };
            });

            const checkout = {
                products,
                discount,
                code: "",
                shippingPrice: 0,
                paymentMethod: "",
            };
            localStorage.setItem("checkoutItems", JSON.stringify(checkout));
            navigate("/checkout");
        } else {
            navigate("/signin");
        }
    };

    return (
        <>
            {Object.keys(cart).length !== 0 ? (
                <div
                    id="cartContainer"
                    className="row d-flex justify-content-center"
                >
                    <div className="col-md-7">
                        <div className="card mb-4">
                            <div className="card-header py-3">
                                <h5 className="mb-0">
                                    Cart - {Object.keys(cart).length}{" "}
                                    {Object.keys(cart).length > 1
                                        ? "items"
                                        : "item"}
                                </h5>
                            </div>
                            <div className="card-body">
                                {Object.values(cart).map((book, index) => (
                                    <div key={book.product._id}>
                                        <CartItem book={book} />
                                        {Object.keys(cart).length !==
                                        index + 1 ? (
                                            <hr className="my-4" />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div
                            className="card mb-4 position-sticky"
                            style={{ top: "65px" }}
                        >
                            <div className="card-header py-3">
                                <h5 className="mb-0">Summary</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Products
                                        <span>
                                            {Object.values(cart).length !== 0
                                                ? Object.values(cart)
                                                      .reduce(
                                                          (acc, curr) =>
                                                              acc +
                                                              curr.product
                                                                  .price *
                                                                  curr.quantity,
                                                          0
                                                      )
                                                      .toFixed(2)
                                                : 0}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Discount
                                        <span>0</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        Shipping
                                        <span>Free</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                        <div>
                                            <strong>Total amount</strong>
                                        </div>
                                        <span>
                                            <strong>
                                                {Object.values(cart).length !==
                                                0
                                                    ? Object.values(cart)
                                                          .reduce(
                                                              (acc, curr) =>
                                                                  acc +
                                                                  curr.product
                                                                      .price *
                                                                      curr.quantity,
                                                              0
                                                          )
                                                          .toFixed(2)
                                                    : 0}
                                            </strong>
                                        </span>
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    className="btn btn-fill-sea-green btn-block"
                                    onClick={handleCheckout}
                                    disabled={Object.keys(cart).length === 0}
                                >
                                    {isUser ? "Go to checkout" : "Signin"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h2 className="fw-bold fs-4 text-center">
                    Your cart is empty.
                </h2>
            )}
        </>
    );
}

export default Cart;
