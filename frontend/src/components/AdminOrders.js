import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link } from "react-router-dom";
import { fetchOrdersAdmin } from "../features/OrderFeatures";
import Loader from "./Loader";

function AdminOrders() {
    document.title = "Admin Orders | Master Book Bank";
    const { loading, setLoading } = useBooksContext();
    const [orders, setOrders] = useState([]);

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchOrdersAdmin();
        setLoading(false);
        if (res.status === 200) {
            setOrders(
                res.json.filter((order) => order.orderStatus !== "Delivered")
            );
        }
    };

    useEffect(() => {
        asyncFunc();
    }, []);

    return (
        <>
            <h1 className="text-light mt-3 mb-4 text-center">Orders</h1>
            {loading && <Loader />}
            {!loading && orders.length === 0 ? (
                <h4 className="text-light text-center">
                    There is nothing to do here. You are free to go...
                </h4>
            ) : null}
            {!loading &&
                orders.length !== 0 &&
                orders.map((order) => (
                    <div
                        key={order._id}
                        className="card border-light text-white bg-dark mb-3"
                    >
                        <div className="card-body">
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
                                <p className="mb-1">
                                    <strong>Shipping Address: </strong>
                                    {Object.values(order.shippingAddress).join(
                                        ", "
                                    )}
                                </p>
                                <Link
                                    className="btn btn-sm btn-primary"
                                    style={{ height: "fit-content" }}
                                    to={"/admin/order/" + order._id}
                                >
                                    Manage
                                </Link>
                            </div>
                            <p className="mb-1">
                                <strong>Products:</strong>
                            </p>
                            <table className="table table-dark table-hover">
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr
                                            className={`text-light ${
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

export default AdminOrders;
