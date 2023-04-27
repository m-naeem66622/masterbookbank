import React from 'react'
import { useBooksContext } from '../provider/BookProvider'
import { Link } from 'react-router-dom';

function UserAccount() {
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
                                <th scope="row">Country:</th>
                                <td>{accountDetail.shippingAddress.country}</td>
                            </tr>
                            <tr>
                                <th scope="row">City:</th>
                                <td>{accountDetail.shippingAddress.city}</td>
                            </tr>
                            <tr>
                                <th scope="row">Postal Code:</th>
                                <td>{accountDetail.shippingAddress.postalCode}</td>
                            </tr>
                            <tr>
                                <th scope="row">Address:</th>
                                <td>{accountDetail.shippingAddress.address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <Link to='/user/account/edit' className='btn btn-primary'>Edit</Link>
                </div>
            </div>
        </>
    )
}

export default UserAccount