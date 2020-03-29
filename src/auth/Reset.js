import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';

const Reset = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset password'
    })

    useEffect(() => {
        let token = match.params.token
        let { name } = jwt.decode(token)
        if (token) {
            setValues({ ...values, name, token })
        }
    }, [])

    const { name, token, newPassword, buttonText } = values

    const handleChange = event => {
        // console.log(event.target.value)
        setValues({ ...values, newPassword: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        console.log('rend request')
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
            .then(response => {
                console.log('RESET PASSWORD SUCCESS', response)
                //save the response (user, token) localstorage/cookie
                toast.success(response.data.message)
                setValues({ ...values, buttonText: 'Done' })
            })
            .catch(error => {
                console.log('RESET PASSWORD ERROR', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Reset password' })
            })
    }

    const passwordResetForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">New password</label>
                <input
                    onChange={handleChange}
                    type="password"
                    value={newPassword}
                    className="form-control"
                    placeholder="Type new password"
                    required
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
                <h1 className="p-5 text-center">Hey {name}, Type your new password</h1>
                {passwordResetForm()}
            </div>
        </Layout>
    )
}

export default Reset