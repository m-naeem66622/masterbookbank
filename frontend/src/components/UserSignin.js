import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link, useNavigate } from "react-router-dom";
import { signinUser } from "../features/AuthFeatures";
import Loader from "./Loader";
import { auth } from "../firebase";
import { signInWithCustomToken } from "firebase/auth";

function UserSignin() {
    document.title = "Signin | Master Book Bank";
    const { notify, isUser, loading } =
        useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" });

    const handleOnChange = (e) => {
        setData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const { json, status } = await signinUser(data);

        if (status === 200) {
            signInWithCustomToken(auth, json.customToken)
                .then((userCredential) => {
                    // Signed in
                    navigate("/");
                })
                .catch((error) => {
                    notify("error", "Something went wrong! Try again.");
                });
        } else {
            notify("error", "Wrong username or password. Try Again...");
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
                    style={{ maxWidth: "400px" }}
                >
                    <h2 className="fw-bold fs-4 text-center">
                        Signin to your account
                    </h2>
                    <form className="mt-5" onSubmit={handleOnSubmit}>
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
                                placeholder="example@abc.com"
                                value={data.email}
                                name="email"
                                onChange={handleOnChange}
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
                                placeholder="Password"
                                value={data.password}
                                name="password"
                                onChange={handleOnChange}
                            />
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
