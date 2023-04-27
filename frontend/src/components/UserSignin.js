import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.png'
import { useBooksContext } from '../provider/BookProvider';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateUser, signinUser } from '../features/AuthFeatures'
import Loader from './Loader';

function UserSignin() {
    const { notify, setIsUser, loading, setLoading, setAccountDetail } = useBooksContext();
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" });

    const handleOnChange = (e) => {
        setData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const response = await signinUser(data);
        console.log(response);

        if (response) {
            navigate("/");
        } else {
            notify("error", "Wrong username or password. Try Again...")
        }
    }

    const authenticate = async () => {
        setLoading(true);
        const response = await authenticateUser();
        if (response.status) {
            navigate(`/user/account`);
            setIsUser(true);
            setAccountDetail(response.json);
        }
        // else {
        //     navigate('/');
        // }
        setLoading(false);
    }


    useEffect(() => {
        authenticate();

        // eslint-disable-next-line
    }, [])

    return (
        <main className="form-signin w-50 m-auto">
            {loading ?
                <><h3 className='text-center text-light mt-5'>Verifying User...</h3> <Loader /></> :
                <form className='text-center my-4' onSubmit={handleOnSubmit}>
                    <img className="mb-4" src={Logo} alt="" width="200px" />
                    <h1 className="h3 mb-3 fw-normal text-light">Please sign in</h1>

                    <div className="form-floating form-floating-sm  mb-4">
                        <input type="text" className="form-control" id="floatingInput" placeholder="example@abc.com" value={data.email} name='email' onChange={handleOnChange} />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={data.password} name='password' onChange={handleOnChange} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary mb-4" type="submit">Sign in</button>
                    <div className="text-center text-light">
                        <p>Not a member? <Link to="/signup">Register</Link></p>
                    </div>
                </form>}
        </main>
    )
}

export default UserSignin