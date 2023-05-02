import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import cartIcon from '../assets/cart-shopping-solid.svg'

function Navbar() {
    const location = useLocation();
    const path = location.pathname
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
    }

    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark border-bottom border-white">
            <div className="container-fluid">
                <Link className="navbar-brand" to={isAdmin ? '/admin/book/add' : '/'}>Master Book Bank</Link>
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
                    <div>
                        <div>
                            {!isAdmin && <Link to="/cart" className="me-3 position-relative">
                                <img width="28px" src={cartIcon} alt="cart-icon" />
                                {Object.keys(cart).length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger d-flex justify-content-center align-items-center" style={{ width: "20px", height: "20px" }}>{Object.keys(cart).length}</span>}
                            </Link>}
                            {isAdmin || isUser ?
                                <>
                                    <Link to="/user/account" className="btn btn-primary me-2">Account</Link>
                                    <button onClick={handleLogoutOnClick} className="btn btn-primary">Logout</button>
                                </> :
                                <>
                                    {path !== "/signin" && <Link to="/signin" className="btn btn-primary">Signin</Link>}
                                    {path !== "/signup" && <Link to="/signup" className="btn btn-primary ms-2">Signup</Link>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
