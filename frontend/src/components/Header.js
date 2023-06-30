import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import { kebabToTitle } from "../features/BookFeatures";

function Header() {
    // const location = useLocation();
    // const path = location.pathname;
    const navigate = useNavigate();
    const { isAdmin, setIsAdmin, isUser, setIsUser, cart, accountDetail } =
        useBooksContext();
    const [searchData, setSearchData] = useState({
        option: "title",
        value: "",
    });

    const handleLogoutOnClick = () => {
        localStorage.removeItem("authToken");
        if (isAdmin) {
            setIsAdmin(false);
            navigate("/admin/signin");
        } else if (isUser) {
            setIsUser(false);
            navigate("/");
        }
    };

    const handleSubmitSearch = () => {
        if (searchData.value.trim()) {
            navigate(`/books/${searchData.option}/${searchData.value}`);
        }
    };

    return (
        <>
            <div
                className="navbar-top py-1"
                style={{ backgroundColor: "#1c2331" }}
            >
                <ul className="navbar-nav text-light flex-row align-items-center justify-content-end px-2">
                    {!(isUser || isAdmin) && (
                        <>
                            <li className="nav-item fw-medium me-3 fs-7">
                                <Link className="nav-link" to="/signin">
                                    Signin
                                </Link>
                            </li>
                            <li className="nav-item fw-medium fs-7">
                                <Link className="nav-link" to="/signup">
                                    Create Account
                                </Link>
                            </li>
                        </>
                    )}
                    {(isUser || isAdmin) && (
                        <>
                            <label>Hello! {accountDetail.name}</label>
                            <span
                                className="mx-3"
                                style={{
                                    width: "1px",
                                    height: "1.25rem",
                                    backgroundColor: "var(--bs-gray-400)",
                                }}
                            ></span>
                            <li
                                className="nav-item dropdown position-relative"
                                title="Account Options"
                            >
                                <Link
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    to="/"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa-solid fa-user fs-6"></i>
                                </Link>
                                <ul
                                    className="dropdown-menu dropdown-menu-end position-absolute"
                                    style={{ zIndex: "2000" }}
                                    aria-labelledby="navbarDropdownMenuLink"
                                >
                                    {isUser && (
                                        <>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/user/account"
                                                >
                                                    Account Info
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/orders"
                                                >
                                                    My Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/"
                                                >
                                                    My Reviews
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/cart"
                                                >
                                                    My Cart
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={
                                                        handleLogoutOnClick
                                                    }
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/admin/account"
                                                >
                                                    Account Info
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/admin/orders"
                                                >
                                                    Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/"
                                                >
                                                    Reviews
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={
                                                        handleLogoutOnClick
                                                    }
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <header className="sticky-top shadow-lg">
                <nav
                    className="navbar navbar-expand-lg navbar-light bg-light"
                    aria-label="Offcanvas navbar large"
                >
                    <div className="container-fluid">
                        <Link className="navbar-brand fw-bold fs-5" to="/">
                            Master Book Bank
                        </Link>
                        <div
                            className="offcanvas offcanvas-start text-bg-light"
                            tabIndex="-1"
                            id="offcanvasNavbar2"
                            aria-labelledby="offcanvasNavbar2Label"
                        >
                            <div className="offcanvas-header">
                                <h5
                                    className="offcanvas-title"
                                    id="offcanvasNavbar2Label"
                                >
                                    Menu
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-dark"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                                    {!isAdmin && (
                                        <>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/books/categories/novel"
                                                >
                                                    Novel
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/books/categories/academic"
                                                >
                                                    Academic Books
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/books/categories/ppsc"
                                                >
                                                    PPSC
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/books/categories/fiction"
                                                >
                                                    Fiction
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {isAdmin && (
                                        <>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/admin/book/add"
                                                >
                                                    Add Book
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/admin/books"
                                                >
                                                    Books
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/admin/orders"
                                                >
                                                    Orders
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/"
                                                >
                                                    Discounts
                                                </Link>
                                            </li>
                                            <li className="nav-item fw-medium">
                                                <Link
                                                    className="nav-link"
                                                    to="/"
                                                >
                                                    Coupons
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <div className="d-lg-none d-flex">
                                        {isUser || isAdmin ? (
                                            <button
                                                className="btn btn-fill-sea-green fw-medium me-3"
                                                onClick={handleLogoutOnClick}
                                            >
                                                Logout
                                            </button>
                                        ) : (
                                            <>
                                                <li className="nav-item btn btn-fill-sea-green fw-medium me-3 px-3 py-0">
                                                    <Link
                                                        className="nav-link"
                                                        to="/signup"
                                                    >
                                                        Signup
                                                    </Link>
                                                </li>
                                                <li className="nav-item btn btn-fill-sea-green fw-medium px-3 py-0">
                                                    <Link
                                                        className="nav-link"
                                                        to="/signin"
                                                    >
                                                        Signin
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </div>
                                </ul>
                            </div>
                        </div>
                        <div className="d-flex align-items-center list-unstyled">
                            <ul className="navbar-nav flex-row">
                                <li className="nav-item fw-medium">
                                    <Link
                                        to="#searchToggle"
                                        className="nav-link"
                                        data-bs-toggle="offcanvas"
                                        role="button"
                                        aria-controls="searchToggle"
                                    >
                                        <i className="fas fa-magnifying-glass fs-5"></i>
                                    </Link>
                                </li>
                                <li className="nav-item fw-medium ps-2">
                                    <Link
                                        to="/cart"
                                        className="nav-link position-relative"
                                    >
                                        <i className="fas fa-bag-shopping fs-5"></i>
                                        {Object.keys(cart).length > 0 && (
                                            <span
                                                className="center position-absolute top-0 start-100 translate-middle-x bg-sea-green rounded-circle"
                                                style={{
                                                    fontSize: "12px",
                                                    minWidth: "20px",
                                                    minHeight: "20px",
                                                }}
                                            >
                                                <span>
                                                    {Object.keys(cart).length}
                                                </span>
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            </ul>
                            <button
                                className="navbar-toggler pe-0"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasNavbar2"
                                aria-controls="offcanvasNavbar2"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </div>
                </nav>
                <div
                    className="offcanvas offcanvas-center bg-transparent w-100 px-2 align-items-center"
                    id="searchToggle"
                >
                    <div
                        className="input-group w-100"
                        style={{ maxWidth: "500px" }}
                    >
                        <input
                            type="text"
                            className="form-control search-wrap "
                            style={{ padding: "0.75rem" }}
                            placeholder={`Search By Book ${kebabToTitle(
                                searchData.option
                            )}`}
                            aria-label=""
                            onChange={(e) =>
                                setSearchData({
                                    ...searchData,
                                    value: e.target.value,
                                })
                            }
                        />
                        <select
                            name="search-options"
                            id=""
                            className="form-select"
                            style={{ maxWidth: "130px" }}
                            value={searchData.option}
                            onChange={(e) =>
                                setSearchData({
                                    ...searchData,
                                    option: e.target.value,
                                })
                            }
                        >
                            <option value="title">Title</option>
                            <option value="authors">Author</option>
                            <option value="categories">Category</option>
                            <option value="publisher">Publisher</option>
                        </select>
                        <div
                            data-bs-dismiss="offcanvas"
                            data-bs-target="#searchToggle"
                            aria-label="Close"
                            onClick={handleSubmitSearch}
                            className="btn btn-light center px-3 border"
                        >
                            <i className="fas fa-magnifying-glass fs-5 text-gray"></i>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
