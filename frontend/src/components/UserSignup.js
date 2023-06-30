import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser, signupUser } from "../features/AuthFeatures";
import Loader from "./Loader";

function UserSignup() {
    document.title = "Signup | Master Book Bank";
    const { notify, setIsUser, isUser, loading, setAccountDetail } =
        useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        shippingAddress: {
            address: "",
            city: "",
            postalCode: "",
            country: "",
            state: "",
        },
    });

    const handleOnChange = (e) => {
        if (
            ["address", "city", "postalCode", "country", "state"].includes(
                e.target.name
            )
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
            const response = await authenticateUser();
            setAccountDetail(response.json.data);
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
        <>
            {loading ? (
                <Loader />
            ) : (
                <div
                    className="text-gray mx-auto"
                    style={{ maxWidth: "500px" }}
                >
                    <h2 className="fw-bold fs-4 text-center">
                        Create your free account
                    </h2>
                    <form className="mt-4" onSubmit={handleOnSubmit}>
                        <div className="mb-4">
                            <div className="divider d-flex align-items-center">
                                <p className="text-center fw-medium mx-3 mb-0">
                                    Continue with
                                </p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="w-50 me-1 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                >
                                    <i className="fab fa-google fs-5"></i>
                                    <span className="ms-2 fs-6">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-50 ms-1 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                >
                                    <i className="fab fa-facebook fs-5"></i>
                                    <span className="ms-2 fs-6">Facebook</span>
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="divider d-flex align-items-center">
                                <p className="text-center fw-medium mx-3 mb-0">
                                    Or
                                </p>
                            </div>
                        </div>
                        <h3 className="fw-bold fs-5">General Info</h3>
                        <em>
                            Note: Name and email once entered cannot be changed.
                        </em>
                        <div className="mb-4">
                            <label
                                htmlFor="userName"
                                className="form-label fw-medium"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                value={data.name}
                                name="name"
                                onChange={handleOnChange}
                                required
                            />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userEmail"
                                className="form-label fw-medium"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="userEmail"
                                value={data.email}
                                name="email"
                                onChange={handleOnChange}
                                required
                            />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userPassword"
                                className="form-label fw-medium"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="userPassword"
                                value={data.password}
                                name="password"
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userConfirmPassword"
                                className="form-label fw-medium"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="userConfirmPassword"
                                value={data.confirmPassword}
                                name="confirmPassword"
                                onChange={handleOnChange}
                            />
                        </div>
                        <h3 className="fw-bold fs-5">Order Info</h3>
                        <div className="row">
                            <div className="mb-4 col col-12">
                                <label
                                    htmlFor="userPhoneNumber"
                                    className="form-label fw-medium"
                                >
                                    Phone Number
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="userPhoneNumber"
                                    value={data.phoneNumber}
                                    name="phoneNumber"
                                    onChange={handleOnChange}
                                    required
                                />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-4 col col-12 col-sm-6">
                                <label
                                    htmlFor="userCountry"
                                    className="form-label fw-medium"
                                >
                                    Country
                                </label>
                                <input
                                    className="form-control"
                                    list="datalistCountryOptions"
                                    id="userCountry"
                                    value={data.shippingAddress.country}
                                    name="country"
                                    onChange={handleOnChange}
                                    placeholder="Type to search..."
                                />
                                <datalist id="datalistCountryOptions">
                                    <option value="Pakistan" />
                                    <option value="India" />
                                    <option value="Afghanistan" />
                                    <option value="United States of America" />
                                    <option value="Canada" />
                                </datalist>
                            </div>
                            <div className="mb-4 col col-12 col-sm-6">
                                <label
                                    htmlFor="userState"
                                    className="form-label fw-medium"
                                >
                                    State/Province
                                </label>
                                <input
                                    className="form-control"
                                    list="datalistStateOptions"
                                    id="userState"
                                    value={data.shippingAddress.state}
                                    name="state"
                                    onChange={handleOnChange}
                                    placeholder="Type to search..."
                                />
                                <datalist id="datalistStateOptions">
                                    <option value="Punjab" />
                                    <option value="Sindh" />
                                    <option value="Balochistan" />
                                    <option value="Khyber Pakhtun Khawa" />
                                    <option value="Jammu & Kashmir" />
                                </datalist>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-4 col col-12 col-sm-8">
                                <label
                                    htmlFor="userCity"
                                    className="form-label fw-medium"
                                >
                                    City
                                </label>
                                <input
                                    className="form-control"
                                    list="datalistCityOptions"
                                    id="userCity"
                                    value={data.shippingAddress.city}
                                    name="city"
                                    onChange={handleOnChange}
                                    placeholder="Type to search..."
                                />
                                <datalist id="datalistCityOptions">
                                    <option value="San Francisco" />
                                    <option value="New York" />
                                    <option value="Seattle" />
                                    <option value="Los Angeles" />
                                    <option value="Chicago" />
                                </datalist>
                            </div>
                            <div className="mb-4 col col-12 col-sm-4">
                                <label
                                    htmlFor="userPostalCode"
                                    className="form-label fw-medium"
                                >
                                    Postal/Zip Code
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="userPostalCode"
                                    value={data.shippingAddress.postalCode}
                                    name="postalCode"
                                    onChange={handleOnChange}
                                    required
                                />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label fw-medium"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput1"
                                value={data.shippingAddress.address}
                                name="address"
                                onChange={handleOnChange}
                                required
                            />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="btn btn-fill-sea-green w-100"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                    <div className="mt-5 text-center">
                        <p>
                            Already a member?{" "}
                            <Link className="fw-bold" to="/signin">
                                Signin
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserSignup;
