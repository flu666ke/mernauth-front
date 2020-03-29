import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';

const Forgot = ({ history }) => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request password reset link'
    })

    const { email, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        console.log('rend request')
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
            .then(response => {
                console.log('FORGOT PASSWORD SUCCESS', response)
                //save the response (user, token) localstorage/cookie
                toast.success(response.data.message)
                setValues({ ...values, buttonText: 'Requested' })
            })
            .catch(error => {
                console.log('FORGOT PASSWORD ERROR', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Request password reset link' })
            })
    }

    const passwordForgotForm = () => (
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
                <h1 className="p-5 text-center">Forgot password</h1>
                {passwordForgotForm()}
            </div>
        </Layout>
    )
}

export default Forgot