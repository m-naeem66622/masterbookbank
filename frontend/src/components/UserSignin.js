import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signinUser } from "../features/AuthFeatures";
import Loader from "./Loader";
import { auth } from "../firebase";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

function UserSignin() {
    document.title = "Signin | Master Book Bank";
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [params] = useSearchParams();
    const signupWith = params.get("with") || "email";
    const { notify, isUser, loading, setAccountDetail } = useBooksContext();
    const navigate = useNavigate();

    const handleSignInByEmail = (formData, json) => {
        console.log(json);
        console.log(formData);
        signInWithEmailAndPassword(auth, json.email, formData.password)
            .then((userCredential) => {
                // Signed in
                setAccountDetail(json);
                localStorage.setItem("accountDetail", JSON.stringify(json));
            })
            .catch((error) => {
                notify("error", "Something went wrong. Try Again...");
            });
    };

    function cleanPhoneNumber(value) {
        var phonePattern = /[\D]/g;
        var cleanedNumber = value.replace(phonePattern, "");
        return cleanedNumber;
    }

    const emailOrPhoneValidator = (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const isEmail = emailRegex.test(value);
        const isPhoneNumber = /^(\+\d+)?[\d\s\-]+$/.test(value);

        if (isEmail) {
            console.log("isEmail");
            return [true, "email", value];
        } else if (isPhoneNumber) {
            console.log("isPhoneNumber");
            return [true, "phoneNumber", cleanPhoneNumber(value)];
        }
        console.log("inVaild");
        return "Not valid email or phone number.";
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(errors);
        handleSubmit(async (formData) => {
            console.log(formData);
            const inputField = emailOrPhoneValidator(
                formData.emailOrPhoneNumber
            );
            // json will come from server side after successfull authentication
            const dataToSend = {
                [inputField[1]]: inputField[2],
                password: formData.password,
            };

            console.log(dataToSend);
            const { json, status } = await signinUser(dataToSend);

            if (status === 200) {
                handleSignInByEmail(formData, json.userDetails);
            } else {
                notify("error", "Wrong username or password. Try Again...");
            }
        })();
    };

    // useEffect(() => {
    //     if (!isUser && signupWith === "phone") {
    //         fetch("https://freeipapi.com/api/json", {
    //             method: "GET",
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setIpData(data);
    //             });
    //     }

    //     // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //     if (!isUser && signupWith === "phone") {
    //         fetch("https://freeipapi.com/api/json", {
    //             method: "GET",
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setIpData(data);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    //     }

    //     // eslint-disable-next-line
    // }, [signupWith]);

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
                    style={{ maxWidth: "400px" }}
                >
                    <h2 className="fw-bold fs-4 text-center">
                        Signin to your account
                    </h2>
                    <form className="mt-5" onSubmit={handleOnSubmit}>
                        <div className="mb-2" style={{ height: "95px" }}>
                            <label
                                htmlFor="userEmailOrPhoneNumber"
                                className="form-label fw-medium"
                            >
                                Email or Phone number
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.emailOrPhoneNumber
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="userEmailOrPhoneNumber"
                                {...register("emailOrPhoneNumber", {
                                    required:
                                        "Email or Phone number is required",
                                    validate: emailOrPhoneValidator,
                                })}
                            />
                            <div className="invalid-feedback">
                                {errors.emailOrPhoneNumber?.message}
                            </div>
                        </div>
                        <div className="mb-2" style={{ height: "95px" }}>
                            <label
                                htmlFor="userPassword"
                                className="form-label fw-medium"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                id="userPassword"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters",
                                    },
                                })}
                            />
                            <div className="invalid-feedback">
                                {errors.password?.message}
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        value=""
                                        id="form2Example3"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="form2Example3"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <a href="/">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="btn btn-fill-sea-green w-100"
                            >
                                Sign in
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="divider d-flex align-items-center">
                                <p className="text-center fw-medium mx-3 mb-0">
                                    Or continue with
                                </p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex flex-column">
                                {signupWith !== "email" && (
                                    <Link
                                        to={`/signin?with=email`}
                                        className="mb-2 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                    >
                                        <i className="fas fa-envelope fs-5"></i>
                                        <span className="ms-2 fs-6">Email</span>
                                    </Link>
                                )}
                                {signupWith !== "phone" && (
                                    <Link
                                        to={`/signin?with=phone`}
                                        className="mb-2 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                    >
                                        <i className="fas fa-phone fs-5"></i>
                                        <span className="ms-2 fs-6">Phone</span>
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    className="mb-2 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                >
                                    <i className="fab fa-google fs-5"></i>
                                    <span className="ms-2 fs-6">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="mb-2 btn btn-fill-sea-green btn-sm d-inline-flex justify-content-center align-items-center"
                                >
                                    <i className="fab fa-facebook fs-5"></i>
                                    <span className="ms-2 fs-6">Facebook</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="mt-5 text-center">
                        <p>
                            Not a member?{" "}
                            <Link className="fw-bold" to="/signup">
                                Signup
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserSignin;
