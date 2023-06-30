import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import CheckoutItem from "./CheckoutItem";
import { applyCoupon } from "../features/CouponFeatures";
import { placeOrder } from "../features/OrderFeatures";
import Page404 from "../components/Page404";
import easypaisaIcon from "../assets/easypaisa.svg";
import jazzcashIcon from "../assets/jazzcash.png";
import mastercardIcon from "../assets/mastercard.svg";

function Checkout() {
    document.title = "Checkout | Master Book Bank";
    const { accountDetail, notify, dispatchCart } = useBooksContext();
    const couponRef = useRef();
    const navigate = useNavigate();
    const { shippingAddress, name } = accountDetail;
    const [checkout, setCheckout] = useState({
        products: [],
        discount: 0,
        code: "",
        shippingPrice: 0,
        paymentMethod: "",
    });

    const handleRemoveItem = (id) => {
        const updatedProducts = checkout.products.filter(
            (product) => product.id !== id
        );

        updateState({ ...checkout, products: updatedProducts });
    };

    const handlePlaceOrder = async () => {
        const { code, shippingPrice, paymentMethod } = checkout;
        const items = checkout.products.map((product) => {
            return { product: product.id, quantity: product.quantity };
        });

        if (!code && !paymentMethod && !items.length) {
            return;
        }

        const res = await placeOrder({
            code,
            items,
            shippingPrice,
            paymentMethod,
        });

        if (res.status === 201) {
            notify("success", res.json.message);
            localStorage.setItem(
                "checkoutItems",
                JSON.stringify({
                    products: [],
                    discount: 0,
                    code: "",
                    shippingPrice: 0,
                    paymentMethod: "",
                })
            );
            dispatchCart({ type: "EMPTY_CART" });
            navigate("/");
        } else if (res.status === 400) {
            notify("warning", res.json.errors[0].msg);
        } else {
            notify("error", res.json.message);
        }
    };

    const handleApplyCoupon = async () => {
        const code = couponRef.current.value.trim();
        const items = checkout.products.map((product) => {
            return { product: product.id, quantity: product.quantity };
        });

        if (code === checkout.code) {
            notify("success", "You already got this discount");
            return;
        }

        if (code) {
            const res = await applyCoupon({ code, items });
            if (res.status === 200) {
                notify("success", "You got your discount. Great!");
                updateState({ ...checkout, discount: res.json.discount, code });
            } else if (res.status === 404) {
                notify("error", res.json.message);
            }
        }
    };

    const handlePaymentMethod = (paymentMethod) => {
        updateState({ ...checkout, paymentMethod });
    };

    const updateState = (obj) => {
        setCheckout(obj);
        localStorage.setItem("checkoutItems", JSON.stringify(obj));
    };

    useEffect(() => {
        let mount = true;
        const checkoutItems = localStorage.getItem("checkoutItems");
        if (checkoutItems) {
            const parseData = JSON.parse(checkoutItems);
            if (typeof parseData === "object" && checkoutItems.length) {
                if (mount) {
                    setCheckout(parseData);
                }
            }
        }

        return () => {
            mount = false;
        };
    }, []);

    return (
        <>
            {checkout.products && checkout.products.length ? (
                <div className="row d-flex justify-content-center my-4">
                    <div className="col-md-7">
                        <div className="card mb-4">
                            <div className="card-header py-3">
                                <h5 className="mb-0">
                                    Checkout - {checkout.products.length}{" "}
                                    {checkout.products.length > 1
                                        ? "items"
                                        : "item"}
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <p className="mb-0">
                                        <strong>Deliver To: </strong>
                                        {name}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Address: </strong>
                                        {shippingAddress &&
                                            Object.values(shippingAddress).join(
                                                ", "
                                            )}
                                    </p>
                                    <Link to="/user/account/edit">
                                        Want to change Address
                                    </Link>
                                </div>
                                <hr className="my-4" />
                                {checkout.products.map((product, index) => (
                                    <div key={product.id}>
                                        <CheckoutItem
                                            handleRemoveItem={handleRemoveItem}
                                            product={product}
                                        />
                                        {checkout.products.length !==
                                        index + 1 ? (
                                            <hr className="my-4" />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card mb-4 mb-lg-0">
                            <div className="card-body">
                                <p>
                                    <strong>Select Payment Method</strong>
                                </p>
                                <button
                                    className={`border-${
                                        checkout.paymentMethod === "EASYPAISA"
                                            ? "sea-green"
                                            : "white"
                                    } border-1 me-2 rounded`}
                                    type="button"
                                    style={{
                                        height: "68px",
                                        borderStyle: "solid",
                                    }}
                                    onClick={() =>
                                        handlePaymentMethod("EASYPAISA")
                                    }
                                >
                                    <img
                                        width="100px"
                                        className="px-2"
                                        src={easypaisaIcon}
                                        alt="EasyPaisa"
                                    />
                                </button>
                                <button
                                    className={`border-${
                                        checkout.paymentMethod === "JAZZCASH"
                                            ? "sea-green"
                                            : "white"
                                    } border-1 me-2 rounded`}
                                    type="button"
                                    style={{
                                        height: "68px",
                                        borderStyle: "solid",
                                    }}
                                    onClick={() =>
                                        handlePaymentMethod("JAZZCASH")
                                    }
                                >
                                    <img
                                        width="100px"
                                        src={jazzcashIcon}
                                        alt="JazzCash"
                                    />
                                </button>
                                <button
                                    className={`border-${
                                        checkout.paymentMethod === "MASTERCARD"
                                            ? "sea-green"
                                            : "white"
                                    } border-1 me-2 rounded`}
                                    type="button"
                                    style={{
                                        height: "68px",
                                        borderStyle: "solid",
                                    }}
                                    onClick={() =>
                                        handlePaymentMethod("MASTERCARD")
                                    }
                                >
                                    <img
                                        width="100px"
                                        src={mastercardIcon}
                                        alt="MASTERCARD"
                                    />
                                </button>
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
                                            {Object.values(checkout.products)
                                                .length !== 0
                                                ? Object.values(
                                                      checkout.products
                                                  )
                                                      .reduce(
                                                          (acc, curr) =>
                                                              acc +
                                                              curr.price *
                                                                  curr.quantity,
                                                          0
                                                      )
                                                      .toFixed(2)
                                                : 0}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Discount
                                        <span>-{checkout.discount}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                        Shipping
                                        <span>Free</span>
                                    </li>
                                    <li className="row">
                                        <div className="col-8 pe-1">
                                            <label
                                                htmlFor="inputCoupon"
                                                className="visually-hidden"
                                            >
                                                Coupon
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputCoupon"
                                                placeholder="Enter Coupon Code"
                                                style={{ boxShadow: "none" }}
                                                ref={couponRef}
                                            />
                                        </div>
                                        <div className="col-4 ps-1">
                                            <button
                                                type="button"
                                                className="btn btn-fill-sea-green w-100"
                                                onClick={handleApplyCoupon}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <strong>Total amount</strong>
                                        </div>
                                        <span>
                                            <strong>
                                                {Object.values(
                                                    checkout.products
                                                ).length !== 0
                                                    ? (
                                                          Object.values(
                                                              checkout.products
                                                          ).reduce(
                                                              (acc, curr) =>
                                                                  acc +
                                                                  curr.price *
                                                                      curr.quantity,
                                                              0
                                                          ) - checkout.discount
                                                      ).toFixed(2)
                                                    : 0}
                                            </strong>
                                        </span>
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    className="btn btn-fill-sea-green btn-block"
                                    onClick={handlePlaceOrder}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Page404 />
            )}
        </>
    );
}

export default Checkout;
