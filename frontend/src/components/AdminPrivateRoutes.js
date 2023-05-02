import React from 'react'
import { useBooksContext } from '../provider/BookProvider';
import { Outlet } from 'react-router-dom';
import Loader from './Loader';
import Page404 from './Page404';

function AdminPrivateRoutes() {
    const { rolling, isAdmin } = useBooksContext();
    const Loading = <><h3 className='text-center text-light mt-5'>Verifying Admin...</h3 ><Loader /></>;

    return (
        <>
            {isAdmin ? <Outlet /> : rolling ? Loading : isAdmin ? <Outlet /> : <Page404 />}
        </>
    )
}

export default AdminPrivateRoutes