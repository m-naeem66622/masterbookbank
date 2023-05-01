import React, { useEffect } from 'react'
import { useBooksContext } from '../provider/BookProvider';
import { Outlet } from 'react-router-dom';
import { authenticateAdmin, authenticateUser } from '../features/AuthFeatures';
import Loader from './Loader';

function IsLoggedin() {
    const { rolling, setRolling, setIsUser, isUser, setIsAdmin, isAdmin, setAccountDetail } = useBooksContext();
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
        authenticateAgain();
        return false;
    }

    const authenticateAgain = async () => {
        setRolling(true);
        const response = await authenticateAdmin();
        setRolling(false);
        if (response.status) {
            setIsAdmin(true);
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
            {isUser||isAdmin ? <Outlet /> : rolling ? Loading : isUser ? <Outlet /> : <Outlet />}
        </>
    )
}

export default IsLoggedin