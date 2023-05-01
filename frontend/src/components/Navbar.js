import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooksContext } from "../provider/BookProvider";
import cartIcon from '../assets/cart-shopping-solid.svg'
import { authenticateAdmin, authenticateUser } from "../features/AuthFeatures";

function Navbar() {
    const location = useLocation();
    const path = location.pathname
    const naviagte = useNavigate();
    const { isAdmin, setIsAdmin, isUser, setIsUser, setRolling, setAccountDetail } = useBooksContext();

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

    const authenticate = async () => {
        setRolling(true);
        const response = await authenticateUser();
        setRolling(false);
        if (response.status) {
            setIsUser(true);
            setAccountDetail(response.json)
            return true;
        }

        authenticateAgain();
    }

    const authenticateAgain = async () => {
        setRolling(true);
        const response = await authenticateAdmin();
        setRolling(false);
        if (response.status) {
            setIsAdmin(true);
            setAccountDetail(response.json)
            return true;
        }
    }

    useEffect(() => {
        authenticate();

        // eslint-disable-next-line
    }, [])

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
                            <Link to="/cart" className="me-3"><img width="30px" src={cartIcon} alt="cart-icon" /></Link>
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
