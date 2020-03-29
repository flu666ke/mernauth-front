import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';
import { authenticate, isAuth } from './helpers'
import Google from './Google';

const Signin = ({ history }) => {
    const [values, setValues] = useState({
        email: 'godivaden53@gmail.com',
        password: '123123',
        buttonText: 'Submit'
    })

    const { email, password, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const informParent = response => {
        authenticate(response, () => {
            isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('private')
        })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }
        })
            .then(response => {
                console.log('SIGNIN SUCCESS', response)
                //save the response (user, token) localstorage/cookie
                authenticate(response, () => {
                    setValues({
                        ...values,
                        email: '',
                        password: '',
                        buttonText: 'Submitted'
                    })
                    // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
                    isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('private')
                })
            })
            .catch(error => {
                console.log('SIGNIN ERROR', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const signinForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange('email')}
                    type="email"
                    value={email}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange('password')}
                    type="password"
                    value={password}
                    className="form-control"
                />
            </div>
            <div>
                <button
                    onClick={clickSubmit}
                    className="btn btn-primary"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    )
    return (
        <Layout>
            <div className="col-d-6 offset-md-3">
                <ToastContainer />
                {isAuth() ? <Redirect to="/" /> : null}
                <h1 className="p-5 text-center">Signin</h1>
                <Google informParent={informParent} />
                {signinForm()}
                <br />
                <Link
                    to="/auth/password/forgot"
                    className="btn btn-sm btn-outline-danger"
                >
                    Forgot Password
                </Link>
            </div>
        </Layout>
    )
}

export default Signin