import React from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";
import Page404 from "./Page404";

function UserPrivateRoutes() {
    const { rolling, isUser } = useBooksContext();
    const Loading = (
        <>
            <h3 className="text-center text-light mt-5">Verifying User...</h3>
            <Loader />
        </>
    );

    return (
        <>
            {isUser ? (
                <Outlet />
            ) : rolling ? (
                Loading
            ) : isUser ? (
                <Outlet />
            ) : (
                <Page404 />
            )}
        </>
    );
}

export default UserPrivateRoutes;
