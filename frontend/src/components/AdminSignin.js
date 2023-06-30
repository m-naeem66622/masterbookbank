import React, { useEffect, useState } from "react";
import { useBooksContext } from "../provider/BookProvider";
import { useNavigate } from "react-router-dom";
import { authenticateAdmin, signinAdmin } from "../features/AuthFeatures";
import Loader from "./Loader";

function AdminSignin() {
    document.title = "Admin Signin | Master Book Bank";
    const { notify, isAdmin, setIsAdmin, loading, setAccountDetail } =
        useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({ username: "", password: "" });

    const handleOnChange = (e) => {
        setData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const response = await signinAdmin(data);

        if (response) {
            setIsAdmin(true);
            const data = await authenticateAdmin();
            setAccountDetail(data.json);
            navigate("/admin/book/add");
        } else {
            notify("error", "Wrong username or password. Try Again...");
        }
    };

    useEffect(() => {
        if (isAdmin) {
            navigate("/admin/book/add");
        }

        // eslint-disable-next-line
    }, [isAdmin]);

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
                                htmlFor="adminUsername"
                                className="form-label fw-medium"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="adminUsername"
                                value={data.username}
                                name="username"
                                onChange={handleOnChange}
                            />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="adminPassword"
                                className="form-label fw-medium"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="adminPassword"
                                value={data.password}
                                name="password"
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="btn btn-fill-sea-green w-100"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default AdminSignin;
