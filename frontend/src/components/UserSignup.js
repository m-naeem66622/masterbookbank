import React, { useEffect } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";

function UserSignup() {
    document.title = "Signup | Master Book Bank";
    const { isUser, loading } = useBooksContext();
    const navigate = useNavigate();

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
                    <div className="mt-4 mx-auto" style={{ width: "250px" }}>
                            <Link
                                to="/signup/form?with=email"
                            type="button"
                            className="w-100 mb-4 btn btn-fill-sea-green btn-sm d-flex justify-content-center align-items-center"
                        >
                            <i className="fa-solid fa-envelope fs-5"></i>
                            <span className="ms-2 fs-6">Email</span>
                        </Link>
                            <Link
                                to="/signup/form?with=phone"
                            type="button"
                            className="w-100 mb-4 btn btn-fill-sea-green btn-sm d-flex justify-content-center align-items-center"
                        >
                            <i className="fa-solid fa-phone fs-5"></i>
                            <span className="ms-2 fs-6">Phone</span>
                        </Link>
                            <Link
                                to="/signup/form?with=google"
                            type="button"
                            className="w-100 mb-4 btn btn-fill-sea-green btn-sm d-flex justify-content-center align-items-center"
                        >
                            <i className="fab fa-google fs-5"></i>
                            <span className="ms-2 fs-6">Google</span>
                        </Link>
                            <Link
                                to="/signup/form?with=facebook"
                            type="button"
                            className="w-100 btn btn-fill-sea-green btn-sm d-flex justify-content-center align-items-center"
                        >
                            <i className="fab fa-facebook fs-5"></i>
                            <span className="ms-2 fs-6">Facebook</span>
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
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
