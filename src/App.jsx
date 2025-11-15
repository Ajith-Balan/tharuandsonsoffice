import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import AdminRoute from './components/Routes/AdminRoute'
import ManagerRoute from './components/Routes/ManagerRoute'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Admin/Dashboard'
import ManagerDashboard from './pages/Manager/Dashboard'
import Allsites from './pages/Admin/Allsites'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
           <Route path='/login' element={<Login/>}/>

        
          <Route path='/dashboard' element={<AdminRoute/>}>
            {/* ERS */}
          <Route path='admin' element={<Dashboard/>}/>
          <Route path='admin/allsites' element={<Allsites/>}/>

          </Route>

           <Route path='/dashboard' element={<ManagerRoute/>}>
            <Route path='manager' element={<ManagerDashboard/>}/>
          </Route>
    
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
