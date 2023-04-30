import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";

function Navbar() {
    const location = useLocation();
    const path = location.pathname
    const naviagte = useNavigate();
    const { isAdmin, setIsAdmin, isUser, setIsUser } = useBooksContext();

    const handleLogoutOnClick = () => {
        localStorage.removeItem("authToken");
        if (isAdmin) {
            setIsAdmin(false);
            naviagte("/admin/signin");
        } else if (isUser) {
            setIsUser(false);
            naviagte("/");
        }
    }

    // const handleSigninOnClick = () => {
    //     if (isAdmin) {
    //         naviagte("/admin/signin");
    //     } else {
    //         naviagte("/signin");
    //     }
    // }

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark border-bottom border-white">
            <div className="container-fluid">
                <Link className="navbar-brand" to={isAdmin ? '/admin/signin' : '/'}>Master Book Bank</Link>
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
                <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        {isAdmin && <>
                            <li className="nav-item">
                                <Link className={`nav-link ${path === "/admin/book/add" ? "active" : ""}`} to="/admin/book/add"> Home </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${path === "/admin/books" ? "active" : ""}`} to="/admin/books"> Books </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${path === "/orders" ? "active" : ""}`} to="/orders"> Orders </Link>
                            </li>
                        </>}
                    </ul>
                    {isAdmin || isUser ?
                        <div>
                            <Link to="/user/account" className="btn btn-primary me-2">Account</Link>
                            <button onClick={handleLogoutOnClick} className="btn btn-primary">Logout</button>
                        </div> :
                        <div>
                            {path !== "/signin" && <Link to="/signin" className="btn btn-primary">Signin</Link>}
                            {path !== "/signup" && <Link to="/signup" className="btn btn-primary ms-2">Signup</Link>}
                        </div>
                    }
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
