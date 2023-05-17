import React, { useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../features/AuthFeatures";
import Loader from "./Loader";

function EditUserAccount() {
    const { notify, loading, accountDetail } = useBooksContext();
    const navigate = useNavigate();
    const [isPasswordWillChange, setIsPasswordWillChange] = useState(false);
    const [data, setData] = useState({
        ...accountDetail,
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    const handleOnChange = (e) => {
        if (
            ["address", "city", "postalCode", "country", "state"].includes(e.target.name)
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

        const {
            oldPassword,
            password,
            confirmPassword,
            phoneNumber,
            shippingAddress,
        } = data;
        const { json, status } = await updateUser({
            oldPassword,
            password,
            confirmPassword,
            phoneNumber,
            shippingAddress,
        });

        if (status === 200) {
            navigate("/user/account");
            notify("success", json.message);
        } else if (status === 400) {
            notify("warning", json.errors[0].msg);
        } else {
            notify("error", json.message);
        }
    };

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
                    <h1 className="mb-3 text-light">Edit Information</h1>

                    <h4 className="mb-2 text-light text-start">Basic Info</h4>
                    <div className="form-check form-switch mb-2 text-start text-light">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            checked={isPasswordWillChange}
                            onChange={(e) =>
                                setIsPasswordWillChange(!isPasswordWillChange)
                            }
                        />
                        <label
                            className="form-check-label"
                            htmlFor="flexSwitchCheckDefault"
                        >
                            Change Password
                        </label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            disabled={!isPasswordWillChange}
                            type="password"
                            className="form-control"
                            id="floatingOldPassword"
                            placeholder="Old Password"
                            value={data.oldPassword}
                            name="oldPassword"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingOldPassword">
                            Old Password
                        </label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            disabled={!isPasswordWillChange}
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={data.password}
                            name="password"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingPassword">New Password</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            disabled={!isPasswordWillChange}
                            type="password"
                            className="form-control"
                            id="floatingConfirmPassword"
                            placeholder="Confirm Password"
                            value={data.confirmPassword}
                            name="confirmPassword"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="floatingConfirmPassword">
                            Confirm New Password
                        </label>
                    </div>
                    <h3 className="mb-2 text-light text-start">
                        Details for Order
                    </h3>
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
                    <div className="row">
                        <div className="col col-7">
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
                        </div>
                        <div className="col col-5">
                            <div className="form-floating mb-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingState"
                                    placeholder="State/Province"
                                    value={data.shippingAddress.state}
                                    name="state"
                                    onChange={handleOnChange}
                                />
                                <label htmlFor="floatingState">
                                    State/Province
                                </label>
                            </div>
                        </div>
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
                        Update Info
                    </button>
                </form>
            )}
        </main>
    );
}

export default EditUserAccount;
