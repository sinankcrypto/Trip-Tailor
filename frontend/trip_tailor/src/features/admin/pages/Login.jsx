import React, { useState } from 'react'
import { useAdminLogin } from '../hooks/useAdminLogin'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { handleLogin, loading, error } = useAdminLogin()

    const handleSubmit = (e) =>{
        e.preventDefault()
        handleLogin(username, password)
    }

  return (
    <div className='login-container'>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            value={username}
            placeholder='Username'
            onChange={(e)=> setUsername(e.target.value)} 
            /><br />
            <input 
            type="text"
            value={password}
            placeholder='password'
            onChange={(e)=>setPassword(e.target.value)} 
            /><br />
            <button type='submit' disabled={loading}>
                {loading? 'Loggin in...': 'Login'}
            </button>
        </form>
        { error && <p style={{color : 'red' }}>{error}</p>}
    </div>
  )
}

export default Login
