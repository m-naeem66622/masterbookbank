import React from "react";
import { useBooksContext } from "../provider/BookProvider";

function AdminAccount() {
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
                                <th scope="row">Username:</th>
                                <td>{accountDetail.username}</td>
                            </tr>
                            <tr>
                                <th scope="row">Created At:</th>
                                <td>
                                    {new Date(
                                        accountDetail.createdAt
                                    ).toString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminAccount;
