import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link } from "react-router-dom";
import { fetchOrdersUser } from "../features/OrderFeatures";
import Loader from "./Loader";

function Orders() {
    document.title = "Admin Orders | Master Book Bank";
    const { loading, setLoading } = useBooksContext();
    const [orders, setOrders] = useState([]);

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchOrdersUser();
        setLoading(false);
        if (res.status === 200) {
            setOrders(res.json);
        }
    };

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading && <Loader />}
            {!loading && orders.length === 0 ? (
                <div className="text-center">
                    <h4 className="mb-4">
                        Oops! You still had nothing ordered..
                    </h4>
                    <Link
                        className="btn btn-fill-sea-green"
                        style={{ width: "250px" }}
                        to="/"
                    >
                        Shop Now
                    </Link>
                </div>
            ) : null}
            {!loading &&
                orders.length !== 0 &&
                orders.map((order) => (
                    <div key={order._id} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-cemter">
                                <p className="mb-2">
                                    <strong>Name:</strong> {order.user?.name}
                                </p>
                                <p className="mb-2">
                                    <strong>Status: </strong>
                                    <em>{order.orderStatus}</em>
                                </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-cemter">
                                <p className="mb-1">
                                    <strong>Shipping Address: </strong>
                                    {Object.values(order.shippingAddress).join(
                                        ", "
                                    )}
                                </p>
                                <Link
                                    className="btn btn-sm btn-fill-sea-green"
                                    style={{ height: "fit-content" }}
                                    to={"/order/" + order._id}
                                >
                                    Manage
                                </Link>
                            </div>
                            <p className="mb-1">
                                <strong>Products:</strong>
                            </p>
                            <table className="table table-hover">
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr
                                            className={`${
                                                index === 0 && "border-top"
                                            } ${
                                                index ===
                                                    order.items.length - 1 &&
                                                "border-bottom"
                                            }`}
                                            key={item._id}
                                        >
                                            <td>{item.product.title}</td>
                                            <td>{item.quantity} Qty</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
        </>
    );
}

export default Orders;
