import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.png'
import { useBooksContext } from '../provider/BookProvider';
import { useNavigate } from 'react-router-dom';
import { signinAdmin } from '../features/AuthFeatures'
import Loader from './Loader';

function AdminSignin() {
    const { notify, isAdmin, loading } = useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({ username: "", password: "" });

    const handleOnChange = (e) => {
        setData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const response = await signinAdmin(data);

        if (response) {
            navigate("/admin/book/add");
        } else {
            notify("error", "Wrong username or password. Try Again...")
        }
    }

    useEffect(() => {
        if (isAdmin) {
            navigate("/admin/book/add");
        }

        // eslint-disable-next-line
    }, [isAdmin])

    return (
        <main className="form-signin w-50 m-auto">
            {loading ?
                <><h3 className='text-center text-light mt-5'>Verifying Admin...</h3> <Loader /></> :
                <form className='text-center my-4' onSubmit={handleOnSubmit}>
                    <img className="mb-4" src={Logo} alt="" width="200px" />
                    <h1 className="h3 mb-3 fw-normal text-light">Please sign in</h1>

                    <div className="form-floating form-floating-sm  mb-4">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Username" value={data.username} name='username' onChange={handleOnChange} />
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={data.password} name='password' onChange={handleOnChange} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                </form>}
        </main>
    )
}

export default AdminSignin