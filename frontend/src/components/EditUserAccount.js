import React, { useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../features/AuthFeatures";
import Loader from "./Loader";

function EditUserAccount() {
    document.title = "Edit Account Details | Master Book Bank";
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
        <>
            {loading ? (
                <Loader />
            ) : (
                <div
                    className="text-gray mx-auto"
                    style={{ maxWidth: "500px" }}
                >
                    <h2 className="fw-bold fs-4 text-center">
                        Edit Account Info
                    </h2>
                    <form className="" onSubmit={handleOnSubmit}>
                        <h3 className="fw-bold fs-5">General Info</h3>
                        <div className="form-check form-switch mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="userChangePasswordSwitch"
                                checked={isPasswordWillChange}
                                onChange={(e) =>
                                    setIsPasswordWillChange(
                                        !isPasswordWillChange
                                    )
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor="userChangePasswordSwitch"
                            >
                                Change Password
                            </label>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userOldPassword"
                                className="form-label fw-medium"
                            >
                                Old Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="userOldPassword"
                                value={data.oldPassword}
                                name="oldPassword"
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userNewPassword"
                                className="form-label fw-medium"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="userNewPassword"
                                value={data.password}
                                name="password"
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="userConfirmNewPassword"
                                className="form-label fw-medium"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="userConfirmNewPassword"
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
                        <button
                            className="w-100 btn btn-fill-sea-green mb-4"
                            type="submit"
                            onChange={handleOnSubmit}
                        >
                            Update Info
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default EditUserAccount;
