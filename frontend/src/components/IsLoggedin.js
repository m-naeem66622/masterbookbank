import React, { useEffect } from 'react'
import { useBooksContext } from '../provider/BookProvider';
import { Outlet } from 'react-router-dom';
import { authenticateUser } from '../features/AuthFeatures';
import Loader from './Loader';

function IsLoggedin() {
    const { rolling, setRolling, setIsUser, isUser, setAccountDetail } = useBooksContext();
    const Loading = <Loader />;

    const authenticate = async () => {
        setRolling(true);
        const response = await authenticateUser();
        setRolling(false);
        if (response.status) {
            setIsUser(true);
            setAccountDetail(response.json)
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
            {isUser ? <Outlet /> : rolling ? Loading : isUser ? <Outlet /> : <Outlet />}
        </>
    )
}

export default IsLoggedin