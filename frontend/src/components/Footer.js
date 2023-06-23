import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <>
            {/* <!-- Footer --> */}
            <footer
                className="text-center text-lg-start text-white"
                style={{ backgroundColor: "#1c2331" }}
            >
                {/* <!-- Section: Social media --> */}
                <section className="center px-4 py-3 text-bg-sea-green flex-column flex-sm-row">
                    {/* <!-- Left --> */}
                    <div className="me-sm-5">
                        <span>Get connected with us on social networks:</span>
                    </div>
                    {/* <!-- Left --> */}

                    {/* <!-- Right --> */}
                    <div className="social-links">
                        <a
                            href="https://www.facebook.com/masterbookbank"
                            target="_blank"
                            rel="noreferrer"
                            className="me-4 fs-5 text-decoration-none"
                        >
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a
                            href="https://www.twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="me-4 fs-5 text-decoration-none"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a
                            href="https://api.whatsapp.com/send?phone=%2B923420464626"
                            target="_blank"
                            rel="noreferrer"
                            className="me-4 fs-4 text-decoration-none"
                        >
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <a
                            href="https://www.instagram.com/masterbookbank/"
                            target="_blank"
                            rel="noreferrer"
                            className="me-4 fs-4 text-decoration-none"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                    {/* <!-- Right --> */}
                </section>
                {/* <!-- Section: Social media --> */}

                {/* <!-- Section: Links  --> */}
                <section className="links">
                    <div className="container text-center text-md-start mt-5">
                        {/* <!-- Grid row --> */}
                        <div className="row mt-3">
                            {/* <!-- Grid column --> */}
                            <div className="d-flex flex-column align-items-center col-md-4 col-xl-4 mx-auto mb-4">
                                {/* <!-- Content --> */}
                                <h6 className="text-uppercase fw-bold w-fit">
                                    Master Book Bank
                                </h6>
                                {/* <!-- <hr className="mb-4 mt-0 d-inline-block mx-auto"
                                style={{width: "60px", backgroundColor: "#7c4dff", height: "2px"}} /> --> */}
                                <p>
                                    Here you can use rows and columns to
                                    organize your footer content. Lorem ipsum
                                    dolor sit amet, consectetur adipisicing
                                    elit.
                                </p>
                            </div>
                            {/* <!-- Grid column --> */}

                            {/* <!-- Grid column --> */}
                            <div className="d-flex flex-column align-items-center col-md-3 col-xl-3 mx-auto mb-4">
                                {/* <!-- Links --> */}
                                <h6 className="text-uppercase fw-bold w-fit">
                                    Useful links
                                </h6>
                                <p>
                                    <Link to="/">Your Account</Link>
                                </p>
                                <p>
                                    <Link to="/">Become an Affiliate</Link>
                                </p>
                                <p>
                                    <Link to="/">Shipping Rates</Link>
                                </p>
                                <p>
                                    <Link to="/">Help</Link>
                                </p>
                            </div>
                            {/* <!-- Grid column --> */}

                            {/* <!-- Grid column --> */}
                            <div className="d-flex flex-column align-items-center col-md-5 col-xl-4 mx-auto mb-md-0 mb-4">
                                {/* <!-- Links --> */}
                                <h6 className="text-uppercase fw-bold w-fit">
                                    Contact
                                </h6>
                                <p>
                                    <i className="fas fa-home me-2"></i>{" "}
                                    Jallhan, Punjab, Pakistan
                                </p>
                                <p>
                                    <i className="fas fa-envelope me-2"></i>
                                    masterbookbank@gmail.com
                                </p>
                                <p>
                                    <i className="fas fa-phone me-2"></i>
                                    +92 342 0464626
                                </p>
                            </div>
                            {/* <!-- Grid column --> */}
                        </div>
                        {/* <!-- Grid row --> */}
                    </div>
                </section>
                {/* <!-- Section: Links  --> */}

                {/* <!-- Copyright --> */}
                <div className="text-center p-3">
                    © 2020 Copyright:
                    <Link to="/">Master Book Bank</Link>
                </div>
                {/* <!-- Copyright --> */}
            </footer>
            {/* <!-- Footer --> */}
        </>
    );
}

export default Footer;
