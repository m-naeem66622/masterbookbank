import React, { useEffect } from 'react'
import { useBooksContext } from '../provider/BookProvider';
import { Outlet } from 'react-router-dom';
import { authenticateUser } from '../features/AuthFeatures';
import Loader from './Loader';
import Page404 from './Page404';


function UserPrivateRoutes() {
    const { rolling, setRolling, setIsUser, isUser, setAccountDetail } = useBooksContext();
    const Loading = <><h3 className='text-center text-light mt-5'>Verifying User...</h3 ><Loader /></>;

    const authenticate = async () => {
        setRolling(true);
        const response = await authenticateUser();
        setRolling(false);
        if (response.status) {
            setIsUser(true);
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
            {isUser ? <Outlet /> : rolling ? Loading : isUser ? <Outlet /> : <Page404 />}
        </>
    )
}

export default UserPrivateRoutes