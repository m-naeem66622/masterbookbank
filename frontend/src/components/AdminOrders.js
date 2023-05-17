import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link } from "react-router-dom";
import { fetchOrdersAdmin } from "../features/OrderFeatures";
import Loader from "./Loader";

function AdminOrders() {
    const { loading } = useBooksContext();
    const [orders, setOrders] = useState([]);

    const asyncFunc = async () => {
        const res = await fetchOrdersAdmin();
        if (res.status === 200) {
            setOrders(res.json);
        }
    };

    useEffect(() => {
        asyncFunc();
    }, []);

    return (
        <>
            <h1 className="text-light mt-3 mb-4 text-center">Orders</h1>
            {!loading &&
                orders.length !== 0 &&
                orders
                    .filter((order) => order.orderStatus !== "Delivered")
                    .map((order) => (
                        <div
                            key={order._id}
                            class="card border-light text-white bg-dark mb-3"
                        >
                            <div class="card-body">
                                <div className="d-flex justify-content-between align-items-cemter">
                                    <p className="mb-2">
                                        <strong>Name:</strong> {order.user.name}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Status: </strong>
                                        <em>{order.orderStatus}</em>
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-cemter">
                                    <p>
                                        <strong>Shipping Address: </strong>
                                        {Object.values(order.shippingAddress)
                                            .toString()
                                            .replace(",", ", ")}
                                    </p>
                                    <Link
                                        className="btn btn-sm btn-primary"
                                        style={{ height: "fit-content" }}
                                        to={"/admin/order/" + order._id}
                                    >
                                        Manage
                                    </Link>
                                </div>
                                <p>
                                    <strong>Products: </strong>
                                    <ul className="list-group list-group-flush">
                                        {order.items.map((item, index) => (
                                            <li
                                                key={item._id}
                                                style={{
                                                    backgroundColor:
                                                        "rgb(44, 48, 52)",
                                                }}
                                                className={`list-group-item text-light ${
                                                    index === 0 && "border-top"
                                                } ${
                                                    index ===
                                                        order.items.length -
                                                            1 && "border-bottom"
                                                }`}
                                            >
                                                <span>{item.product}</span>
                                                <span className="ms-5">
                                                    {item.quantity} Qty
                                                </span>
                                                <span className="ms-5">
                                                    {item.price} PKR
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </p>
                            </div>
                        </div>
                    ))}
        </>
    );
}

export default AdminOrders;
