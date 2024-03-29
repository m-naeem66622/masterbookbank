import React from "react";

function Page404() {
    document.title = "Page Not Found | Master Book Bank";
    const pTagStyle = {
        fontSize: "1.5rem",
    };

    const h1TagStyle = {
        fontSize: "5rem",
    };

    return (
        <div className="my-5 mx-auto text-center d-flex flex-column justfy-content-center h-100">
            <h1 style={h1TagStyle}>404</h1>
            <p style={pTagStyle}>Page not found</p>
            <p style={pTagStyle}>
                Sorry, we couldn't find what you were looking for.
            </p>
        </div>
    );
}

export default Page404;
