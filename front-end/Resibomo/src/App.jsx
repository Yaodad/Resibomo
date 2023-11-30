import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Homepage from "./pages/Homepage"
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useAuthContext } from './hooks/useAuthContext'

function App() {
  const { user } = useAuthContext()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={!user ? <Signup /> : <Navigate to={'/'} />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to={'/'} />} />
          <Route path='/' element={user ? <Homepage /> : <Navigate to={'/login'} />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
