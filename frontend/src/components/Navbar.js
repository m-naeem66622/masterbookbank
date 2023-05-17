import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";

function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    const naviagte = useNavigate();
    const { isAdmin, setIsAdmin, isUser, setIsUser, cart } = useBooksContext();

    const handleLogoutOnClick = () => {
        localStorage.removeItem("authToken");
        if (isAdmin) {
            setIsAdmin(false);
            naviagte("/admin/signin");
        } else if (isUser) {
            setIsUser(false);
            naviagte("/");
        }
    };

    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark border-bottom border-white">
            <div className="container">
                <Link
                    className="navbar-brand"
                    to={isAdmin ? "/admin/book/add" : "/"}
                >
                    <img
                        className="logo-img"
                        src="/static/media/logo.faf2e34ad1c3dd9521ea.png"
                        alt="logo"
                    />
                    Master Book Bank
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse justify-content-between"
                    id="navbarNavDropdown"
                >
                    <ul className="navbar-nav">
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${
                                            path === "/admin/book/add"
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/admin/book/add"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${
                                            path === "/admin/books"
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/admin/books"
                                    >
                                        Books
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${
                                            path === "/admin/orders"
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/admin/orders"
                                    >
                                        Orders
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div>
                        <div>
                            {!isAdmin && (
                                <Link
                                    to="/cart"
                                    className="me-3 position-relative"
                                >
                                    <svg
                                        id="shopping_cart"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                        className="bi flex-shrink-0 text-light"
                                        role="img"
                                    >
                                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    </svg>
                                    {Object.keys(cart).length > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger d-flex justify-content-center align-items-center"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                            }}
                                        >
                                            {Object.keys(cart).length}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {isAdmin || isUser ? (
                                <>
                                    <Link
                                        to={`/${
                                            isAdmin ? "admin" : "user"
                                        }/account`}
                                        className="btn btn-primary me-2"
                                    >
                                        Account
                                    </Link>
                                    <button
                                        onClick={handleLogoutOnClick}
                                        className="btn btn-primary"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {path !== "/signin" && (
                                        <Link
                                            to="/signin"
                                            className="btn btn-primary"
                                        >
                                            Signin
                                        </Link>
                                    )}
                                    {path !== "/signup" && (
                                        <Link
                                            to="/signup"
                                            className="btn btn-primary ms-2"
                                        >
                                            Signup
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
