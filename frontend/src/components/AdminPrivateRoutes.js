import React, { useEffect } from 'react'
import { useBooksContext } from '../provider/BookProvider';
import { Outlet } from 'react-router-dom';
import { authenticateAdmin } from '../features/AuthFeatures';
import Loader from './Loader';
import Page404 from './Page404';


function AdminPrivateRoutes() {
    const { rolling, setRolling, setIsAdmin, isAdmin, setAccountDetail } = useBooksContext();
    const Loading = <><h3 className='text-center text-light mt-5'>Verifying Admin...</h3 ><Loader /></>;

    const authenticate = async () => {
        setRolling(true);
        const response = await authenticateAdmin();
        setRolling(false);
        if (response.status) {
            setIsAdmin(true);
            setAccountDetail(response.json);
            return true;
        }
        return false;
    }

    useEffect(() => {
        authenticate();

        // eslint-disable-next-line
    }, [])

    return (
        <>
            {isAdmin ? <Outlet /> : rolling ? Loading : isAdmin ? <Outlet /> : <Page404 />}
        </>
    )
}

export default AdminPrivateRoutes