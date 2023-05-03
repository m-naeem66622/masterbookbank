import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../features/AuthFeatures";
import Loader from "./Loader";

function UserSignup() {
    const { notify, setIsUser, isUser, loading } = useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        shippingAddress: { address: "", city: "", postalCode: "", country: "" },
    });

    const handleOnChange = (e) => {
        if (
            ["address", "city", "postalCode", "country"].includes(e.target.name)
        ) {
            setData((prevState) => ({
                ...prevState,
                shippingAddress: {
                    ...prevState.shippingAddress,
                    [e.target.name]: e.target.value,
                },
            }));
        } else {
            setData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const { json, status } = await signupUser(data);

        if (status === 200) {
            localStorage.setItem("authToken", json.authToken);
            setIsUser(true);
            navigate("/");
            notify("success", "Account sucessfully created.");
        } else if (status === 400) {
            notify("warning", json.errors[0].msg);
        } else {
            notify("error", json.message);
        }
    };

    useEffect(() => {
        if (isUser) {
            navigate("/");
        }

        // eslint-disable-next-line
    }, [isUser]);

    return (
        <main className="form-signin w-50 m-auto">
            {loading ? (
                <>
                    <h3 className="text-center text-light mt-5">
                        Verifying User...
                    </h3>{" "}
                    <Loader />
                </>
            ) : (
                <form className="text-center my-4" onSubmit={handleOnSubmit}>
                    <h1 className="mb-3 text-light">Create an account</h1>

                    <h4 className="mb-2 text-light text-start">Basic Info</h4>
                    <div className="form-floating form-floating-sm  mb-4">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingName"
                            placeholder="John Doe"
                            value={data.name}
                            name="name"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingName">Name</label>
                    </div>
                    <div className="form-floating form-floating-sm  mb-4">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingEmail"
                            placeholder="example@abc.com"
                            value={data.email}
                            name="email"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingEmail">Email</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={data.password}
                            name="password"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingConfirmPassword"
                            placeholder="Confirm Password"
                            value={data.confirmPassword}
                            name="confirmPassword"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingConfirmPassword">
                            Confirm Password
                        </label>
                    </div>
                    <h4 className="mb-2 text-light text-start">
                        Details for Order
                    </h4>
                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingPhoneNumber"
                            placeholder="Phone Number"
                            value={data.phoneNumber}
                            name="phoneNumber"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingPhoneNumber">
                            Phone Number
                        </label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingCountry"
                            placeholder="Country"
                            value={data.shippingAddress.country}
                            name="country"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingCountry">Country</label>
                    </div>
                    <div className="row">
                        <div className="col col-4">
                            <div className="form-floating mb-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floatingPostalCode"
                                    placeholder="Postal Code"
                                    value={data.shippingAddress.postalCode}
                                    name="postalCode"
                                    onChange={handleOnChange}
                                />
                                <label htmlFor="floatingPostalCode">
                                    Postal Code
                                </label>
                            </div>
                        </div>
                        <div className="col col-8">
                            <div className="form-floating mb-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingCity"
                                    placeholder="City"
                                    value={data.shippingAddress.city}
                                    name="city"
                                    onChange={handleOnChange}
                                />
                                <label htmlFor="floatingPhoneNumber">
                                    City
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingAddress"
                            placeholder="Address"
                            value={data.shippingAddress.address}
                            name="address"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingAddress">Address</label>
                    </div>
                    <button
                        className="w-100 btn btn-lg btn-primary mb-4"
                        type="submit"
                        onChange={handleOnSubmit}
                    >
                        Sign up
                    </button>
                    <div className="text-center text-light">
                        <p>
                            Already a member? <Link to="/signin">Signin</Link>
                        </p>
                    </div>
                </form>
            )}
        </main>
    );
}

export default UserSignup;
