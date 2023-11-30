import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [email, setEmail] = useState(null)  
  const [password, setPassword] = useState(null)
  const {login, isLoading, error} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
        <div className='bg-[#d63416] mx-auto sm:w-[500px] w-[310px] h-[14px]'></div>
        <div className='sm:w-[500px] w-[310px] mx-auto px-[36px] py-[8px] pb-6 bg-white shadow-lg'>
            <div className='flex justify-between items-center pb-3'>
                <h1 className='font-sans sm:text-[47px] text-[40px] font-bold text-primary tracking-tighter'>resibomo</h1>
                <h1 className=' sm:text-[24px] text-[16px] font-bold text-tertiary tracking-tighter'>Log in</h1>
            </div>
            <form className='flex flex-col gap-1 text-primary font-sans' onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" name='email' required placeholder='Enter email' autoComplete='off' className='rounded-md border-[1px] hover:border-tertiary focus:border-tertiary outline-none font-sans text-[14px] p-2 w-full border-secondary mb-2' onChange={(e) => { setEmail(e.target.value)}}/>
                <label>Password</label>
                <input type="password" name='password' required placeholder='Enter password' autoComplete='off' className='rounded-md border-[1px] hover:border-tertiary focus:border-tertiary outline-none font-sans text-[14px] p-2 w-full border-secondary mb-5' onChange={(e) =>  {setPassword(e.target.value)}}/>
                <button type="submit" disabled={isLoading} className='rounded-md bg-tertiary font-primary text-[14px] text-white p-2 w-full hover:bg-white hover:text-tertiary hover:border-tertiary border-tertiary border-[1px] transition-all duration-500 ease-out'>Log in</button>
                {error && <div className='w-full mt-3 p-2 rounded-md bg-[#f8d7da] border-[1px] border-[#f1aeb5] text-[#58151c] text-sm'>{error}</div>}
            </form>
            <p className='text-[14px] text-center pt-5'>No account? <Link to='/signup'><span className='text-tertiary hover:underline'>Create one!</span></Link></p>
        </div>
    </div>
  )
}

export default Login