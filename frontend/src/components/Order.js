import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderUser } from "../features/OrderFeatures";
import Loader from "./Loader";
import { useBooksContext } from "../provider/BookProvider";
import { kebabToTitle } from "../features/BookFeatures";

function Order() {
    document.title = "Admin Order Details | Master Book Bank";
    const host = process.env.REACT_APP_SERVER_HOST;
    const { loading, setLoading } = useBooksContext();
    const params = useParams();
    const { id } = params;
    const [order, setOrder] = useState({});

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchOrderUser(id);
        setLoading(false);

        if (res.status === 200) {
            if (res.json.discount.type === "flat") {
                res.json.discountedPrice = res.json.discount.value;
            } else if (res.json.discount.type === "percent") {
                res.json.discountedPrice = (
                    res.json.totalPrice *
                    (res.json.discount.value / 100)
                ).toFixed(2);
            } else {
                res.json.discountedPrice = 0;
            }
            setOrder(res.json);
        }
    };

    const timelineUtility = () => {
        const orderStatuses = ["pending", "processing", "shipped", "delivered"];
        let timelineStatuses = new Array(4).fill("");
        for (let i = 0; i < orderStatuses.length; i++) {
            timelineStatuses[i] = "active";
            if (orderStatuses[i] === order.orderStatus) {
                break;
            }
        }

        return { orderStatuses, timelineStatuses };
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            {!loading && Object.values(order).length !== 0 ? (
                <>
                    <div className="row d-flex justify-content-center">
                        <div className="row justify-space-between">
                            <p className="col-md-6 col-lg-4">
                                <strong>Name: </strong>
                                {order.user?.name}
                            </p>
                            <p className="col-md-6 col-lg-4">
                                <strong>Email: </strong>
                                {order.user?.email}
                            </p>
                            <p className="col-md-12 col-lg-4">
                                <strong>Phone Number: </strong>
                                {order.phoneNumber}
                            </p>
                        </div>
                        <div className="row">
                            <p>
                                <strong>Shipping Address: </strong>
                                {Object.values(order.shippingAddress).join(
                                    ", "
                                )}
                            </p>
                        </div>
                        <div className="row">
                            <p className="col-12 col-md-6">
                                <strong className="me-2">Placed On:</strong>
                                {new Date(order.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }
                                )}
                            </p>
                            {order.orderStatus === "delivered" && (
                                <p className="col-12 col-md-6">
                                    <strong className="me-2">
                                        Delivered On:
                                    </strong>
                                    {new Date(order.deliveredAt).toLocaleString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                                </p>
                            )}
                            <div className="w-100 d-flex justify-content-center">
                                <ul
                                    className="progress-timeline d-flex p-0 list-unstyled"
                                    style={{
                                        width: "500px",
                                        maxWidth: "500px",
                                    }}
                                >
                                    {timelineUtility().orderStatuses.map(
                                        (status, index) => (
                                            <li
                                                className={`position-relative text-center flex-fill ${
                                                    timelineUtility()
                                                        .timelineStatuses[index]
                                                }`}
                                                key={index}
                                            >
                                                <span className="stamp bg-light d-block text-center border border-gray border-2 m-auto rounded-circle"></span>
                                                <span className="label fs-7 fs-sm-6">
                                                    {kebabToTitle(status)}
                                                </span>
                                            </li>
                                        )
                                    )}

                                    {/* <li className="position-relative text-center flex-fill">
                                        <span className="stamp bg-light d-block text-center border border-gray border-2 m-auto rounded-circle"></span>
                                        <span className="label fs-7 fs-sm-6">
                                            Pending
                                        </span>
                                    </li>
                                    <li className="position-relative text-center flex-fill">
                                        <span className="stamp bg-light d-block text-center border border-gray border-2 m-auto rounded-circle"></span>
                                        <span className="label fs-7 fs-sm-6">
                                            Shipped
                                        </span>
                                    </li>
                                    <li className="position-relative text-center flex-fill">
                                        <span className="stamp bg-light d-block text-center border border-gray border-2 m-auto rounded-circle"></span>
                                        <span className="label fs-7 fs-sm-6">
                                            Delivered
                                        </span>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                        {/*  */}
                        <hr className="mb-4 mt-0" />
                        <div className="col-md-7">
                            {order.items.map((item) => (
                                <div className="row mb-2 mx-2" key={item._id}>
                                    <div className="rounded p-2 d-flex flex-wrap">
                                        <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                                            {/* <!-- Image --> */}
                                            <Link
                                                to={
                                                    "/book/view/" +
                                                    item.product._id
                                                }
                                            >
                                                <img
                                                    src={`${host}/${item.product.images[0]}`}
                                                    alt={item.product.title}
                                                    style={{ height: "150px" }}
                                                />
                                            </Link>
                                            {/* <!-- Image --> */}
                                        </div>

                                        <div className="col-lg-6 col-md-6 mb-lg-0">
                                            {/* <!-- Data --> */}
                                            <p className="mb-1">
                                                <strong>
                                                    {item.product.title}
                                                </strong>
                                            </p>
                                            <p>
                                                By:{" "}
                                                {item.product.authors.join(
                                                    ", "
                                                )}
                                            </p>
                                        </div>

                                        <div className="col-lg-3 col-md-6 mb-lg-0">
                                            {/* <!-- Quantity --> */}
                                            <p className="text-start text-md-center mb-1">
                                                Quantity: {item.quantity}
                                            </p>
                                            {/* <!-- Quantity --> */}

                                            {/* <!-- Price --> */}
                                            <p className="text-start text-md-center mb-0">
                                                <strong>
                                                    PKR {item.price}
                                                </strong>
                                            </p>
                                            {/* <!-- Price --> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                                {Number(
                                                    order.totalPrice
                                                ).toFixed(2)}
                                            </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                            Discount
                                            <span>{order.discountedPrice}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                                            Shipping
                                            <span>Free</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0 mb-3">
                                            <div>
                                                <strong>Total amount</strong>
                                            </div>
                                            <span>
                                                <strong>
                                                    {(
                                                        order.totalPrice -
                                                        order.discountedPrice
                                                    ).toFixed(2)}
                                                </strong>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Loader />
            )}
            {/*  */}
        </>
    );
}

export default Order;
