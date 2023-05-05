import React, { useEffect, useState } from "react";
import ImagePreview from "./ImagePreview";
import { useBooksContext } from "../provider/BookProvider";
import { fetchBook } from "../features/BookFeatures";
import { Link, useParams } from "react-router-dom";
import addCartIcon from "../assets/add-cart.svg";
import removeCartIcon from "../assets/remove-cart.svg";
import updateCartIcon from "../assets/remove-cart.svg";
import minusIcon from "../assets/minus-solid.svg";
import plusIcon from "../assets/plus-solid.svg";
import buyIcon from "../assets/bag-shopping-regular.svg";
import Page404 from "./Page404";
import Loader from "./Loader";

function ViewBook() {
    const { loading, setLoading, cart, setCart } = useBooksContext();
    const [res, setRes] = useState({});
    const [quantity, setQuantity] = useState(1);

    const params = useParams();
    const { id } = params;

    const asyncFunc = async () => {
        setLoading(true);
        const res = await fetchBook(id);
        setLoading(false);
        if (res.status === 200) {
            res.json.publishDate = new Date(
                res.json.publishDate
            ).toLocaleString("default", { month: "long", year: "numeric" });
            setRes(res);
        }
    };

    const handleMinusQty = () => {
        setQuantity((prevState) => {
            let updatedState = prevState;
            if (updatedState > 1) {
                // Decrement quantity by 1 only if it is greater than 1
                updatedState -= 1;
            }
            return updatedState;
        });
    };

    const handlePlusQty = () => {
        setQuantity((prevState) => {
            let updatedState = prevState;
            if (updatedState < res.json.inStock) {
                // Increment quantity by 1 only if it is less than inStock value
                updatedState += 1;
            }
            return updatedState;
        });
    };

    const handleAddOrRemove = () => {
        if (cart[id]) {
            if (cart[id].quantity !== quantity && quantity !== 1) {
                setCart((prevState) => ({
                    ...prevState,
                    [id]: { product: res.json, quantity },
                }));
            } else {
                setCart((prevState) => {
                    const newState = { ...prevState };
                    delete newState[id];
                    return newState;
                });
            }
        } else {
            setCart((prevState) => ({
                ...prevState,
                [id]: { product: res.json, quantity },
            }));
        }
    };

    useEffect(() => {
        console.log(cart);
        if (Object.keys(cart).length) {
            localStorage.setItem("cartItems", JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        asyncFunc();

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h1 className="text-light text-center mt-3">View Book</h1>
            {loading && <Loader />}
            {!loading && res.status === 200 ? (
                <div className="container text-light">
                    <div className="details">
                        {<ImagePreview files={res.json.images} edit={false} />}
                        <div className="box">
                            <div className="row text-primary">
                                <h2>{res.json.title}</h2>
                                <strong>PKR {res.json.price}</strong>
                            </div>
                            <p>
                                <strong>Pages:</strong> {res.json.pages}
                            </p>
                            <p>
                                <strong>Author(s):</strong>{" "}
                                {res.json.authors.map((author, index) => (
                                    <Link className="me-2" key={index}>
                                        {author}
                                    </Link>
                                ))}
                            </p>
                            <p>
                                <strong>Publisher:</strong>{" "}
                                <Link>{res.json.publisher}</Link>
                            </p>
                            <p>
                                <strong>Publish Date:</strong>{" "}
                                {res.json.publishDate}
                            </p>
                            <p>
                                <strong>Language:</strong>{" "}
                                <Link>{res.json.language}</Link>
                            </p>
                            <p>
                                <strong>Category:</strong>{" "}
                                {res.json.categories.map((category, index) => (
                                    <Link className="me-2" key={index}>
                                        {category}
                                    </Link>
                                ))}
                            </p>
                            <div className="mb-4 mt-2">
                                {/* <!-- Quantity --> */}
                                <div className="d-flex align-items-center">
                                    <label className="form-label mb-0">
                                        <strong>Quantity:</strong>
                                    </label>
                                    <div className="ms-2 d-flex">
                                        <button
                                            className="btn btn-primary px-3 me-2"
                                            onClick={() => handleMinusQty()}
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
                                            max={res.json.inStock}
                                            name="quantity"
                                            value={quantity}
                                            type="number"
                                            className="form-control"
                                        />
                                        <button
                                            className="btn btn-primary px-3 ms-2"
                                            onClick={() => handlePlusQty()}
                                        >
                                            <img
                                                width="10px"
                                                src={plusIcon}
                                                alt="plus-icon"
                                            />
                                        </button>
                                    </div>
                                </div>
                                {/* <!-- Quantity --> */}

                                {/* <!-- Price --> */}
                                {quantity > 1 && (
                                    <p className="text-start m-0 fs-5">
                                        <strong>Total: </strong>
                                        {(quantity * res.json.price).toFixed(2)}
                                    </p>
                                )}
                                {/* <!-- Price --> */}
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center me-2"
                                style={{
                                    transition: "all 0.2s",
                                    width: cart[id] ? "110px" : "85px",
                                }}
                                onClick={handleAddOrRemove}
                            >
                                <img
                                    width="28px"
                                    src={
                                        cart[id]
                                            ? cart[id].quantity !== quantity &&
                                              quantity !== 1
                                                ? updateCartIcon
                                                : removeCartIcon
                                            : addCartIcon
                                    }
                                    alt="cart-icon"
                                />
                                <span className="ms-2 fs-6">
                                    {cart[id]
                                        ? cart[id].quantity !== quantity &&
                                          quantity !== 1
                                            ? "Update"
                                            : "Remove"
                                        : "Add"}
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center"
                            >
                                <img
                                    width="20px"
                                    src={buyIcon}
                                    alt="buy-icon"
                                />
                                <span className="ms-2 fs-6">Buy Now</span>
                            </button>
                        </div>
                    </div>
                    <h3>Description</h3>
                    <p>{res.json.description}</p>
                </div>
            ) : (
                <Page404 />
            )}
        </>
    );
}

export default ViewBook;
