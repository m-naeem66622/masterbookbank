import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderAdmin, updateOrderAdmin } from "../features/OrderFeatures";
import Loader from "./Loader";
import { useBooksContext } from "../provider/BookProvider";

function AdminOrder() {
    document.title = "Admin Order Details | Master Book Bank";
    const host = process.env.REACT_APP_SERVER_HOST;
    const { loading, setLoading, notify } = useBooksContext();
    const params = useParams();
    const { id } = params;
    const [order, setOrder] = useState({});
    const [orderStatus, setOrderStatus] = useState("");

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchOrderAdmin(id);
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
            setOrderStatus(res.json.orderStatus);
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const res = await updateOrderAdmin(id, orderStatus);

        if (res.status === 200) {
            notify("success", res.json.message);
            setOrder((prevState) => ({ ...prevState, orderStatus }));
        } else if (res.status === 400) {
            notify("warning", res.json.errors[0].msg);
        } else {
            notify("error", res.json.message);
        }
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     console.log(order);
    // }, [order]);

    return (
        <>
            <h1 className="text-light mt-3 mb-4 text-center">Manage Order</h1>
            {!loading && Object.values(order).length !== 0 ? (
                <div className="row d-flex justify-content-center pb-4 text-light">
                    <div className="row justify-space-between">
                        <p className="col-md-6 col-lg-4">
                            <strong>Name: </strong>
                            {order.user.name}
                        </p>
                        <p className="col-md-6 col-lg-4">
                            <strong>Email: </strong>
                            {order.user.email}
                        </p>
                        <p className="col-md-12 col-lg-4">
                            <strong>Phone Number: </strong>
                            {order.phoneNumber}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            <strong>Shipping Address: </strong>
                            {Object.values(order.shippingAddress).join(", ")}
                        </p>
                    </div>
                    <form className="row mb-4" onSubmit={handleSaveChanges}>
                        <label
                            htmlFor="orderStatus"
                            className="col-6 col-sm-2 col-form-label pe-0 mb-2"
                            style={{ width: "fit-content" }}
                        >
                            Order Status:
                        </label>
                        <div
                            className="col-6 col-sm-3 mb-2"
                            style={{ width: "190px" }}
                        >
                            <select
                                onChange={(e) => setOrderStatus(e.target.value)}
                                className="form-select"
                                name="orderStatus"
                                id="orderStatus"
                                defaultValue={order.orderStatus}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-primary col-12 col-sm-3"
                            type="submit"
                            disabled={orderStatus === order.orderStatus}
                            style={{
                                width: "fit-content",
                                height: "fit-content",
                            }}
                        >
                            Save Changes
                        </button>
                    </form>
                    <hr className="mb-4 mt-0" />
                    <div className="col-md-7">
                        {order.items.map((item) => (
                            <div className="row mb-2 mx-2" key={item._id}>
                                <div className="rounded p-2 d-flex flex-wrap bg-light text-dark">
                                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                                        {/* <!-- Image --> */}
                                        <Link
                                            to={
                                                "/book/view/" + item.product._id
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
                                            {item.product.authors.join(", ")}
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
                                            <strong>PKR {item.price}</strong>
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
                                <h5 className="mb-0 text-dark">Summary</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Products
                                        <span>{order.totalPrice}</span>
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
            ) : (
                <Loader />
            )}
        </>
    );
}

export default AdminOrder;
