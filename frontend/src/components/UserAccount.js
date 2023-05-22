import React from "react";
import { useBooksContext } from "../provider/BookProvider";
import { Link } from "react-router-dom";

function UserAccount() {
    document.title = "Account Details | Master Book Bank";
    const { accountDetail } = useBooksContext();

    return (
        <>
            <h1 className="text-center my-4 text-light">User Information</h1>
            <div className="row justify-content-center pb-4">
                <div className="col-md-8">
                    <table className="table table-dark">
                        <tbody>
                            <tr>
                                <th scope="row">Name:</th>
                                <td>{accountDetail.name}</td>
                            </tr>
                            <tr>
                                <th scope="row">Email:</th>
                                <td>{accountDetail.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">Phone Number:</th>
                                <td>{accountDetail.phoneNumber}</td>
                            </tr>
                            <tr>
                                <th scope="row">Shipping Address:</th>
                                <td>
                                    {Object.values(
                                        accountDetail.shippingAddress
                                    ).join(", ")}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Created At:</th>
                                <td>
                                    {new Date(
                                        accountDetail.createdAt
                                    ).toString()}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Updated At:</th>
                                <td>
                                    {new Date(
                                        accountDetail.updatedAt
                                    ).toString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Link to="/user/account/edit" className="btn btn-primary">
                        Edit
                    </Link>
                </div>
            </div>
        </>
    );
}

export default UserAccount;
