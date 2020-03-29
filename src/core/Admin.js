import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout';
import { isAuth, getCookie, signout, updateUser } from '../auth/helpers'

const Admin = ({ history }) => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${getCookie('token')}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE', response)
                const { role, name, email } = response.data
                setValues({
                    ...values,
                    role,
                    name,
                    email
                })
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPADATE ERROR', error.response.data.error)
                if (error.response.status === 401) {
                    signout(() => {
                        history.push('/')
                    })
                }
            })
    }

    const { role, name, email, password, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/admin/update`,
            headers: {
                Authorization: `Bearer ${getCookie('token')}`
            },
            data: { name, password },
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE SUCCESS', response)
                updateUser(response, () => {
                    setValues({
                        ...values,
                        buttonText: 'Submitted'
                    })
                    toast.success('Profile updated successfully')
                })
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const updateForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Role</label>
                <input
                    type="text"
                    defaultValue={role}
                    className="form-control"
                    disabled
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange('name')}
                    type="text"
                    value={name}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    defaultValue={email}
                    className="form-control"
                    disabled
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
                <h1 className="pt-5 text-center">Admin</h1>
                <p className="lead text-center">
                    Profile Update
                </p>
                {updateForm()}
            </div>
        </Layout>
    )
}

export default Admin

