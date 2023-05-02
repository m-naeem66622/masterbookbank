import React from "react";
import Spinner from "../assets/Spinner.svg";

function Loader() {
    return (
        <div className="text-center">
            <img src={Spinner} style={{ width: "100px" }} alt="loading" />
        </div>
    );
}

export default Loader;
