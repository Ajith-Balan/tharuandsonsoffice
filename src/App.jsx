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
import AllBills from './pages/Admin/AllBills'
import Billdetails from './pages/Admin/Ers/Pages/Billdetails'
import Attendance from './pages/Admin/Ers/Pages/Attendance'
import Connect from './pages/Admin/Ers/Pages/Connect'
import LiveTrain from './pages/Admin/Ers/Pages/LiveTrain'
import Completedtrain from './pages/Admin/Ers/Pages/Completedtrain'
import TrainDetails from './pages/Admin/Ers/Pages/TrainDetail'
import StaffDetails from './pages/Admin/Ers/Pages/StaffDetails'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
           <Route path='/login' element={<Login/>}/>

        
          <Route path='/dashboard' element={<AdminRoute/>}>
            
          <Route path='admin' element={<Dashboard/>}/>
          <Route path='admin/allbills' element={<AllBills/>}/>
          <Route path='admin/allsites' element={<Allsites/>}/>
          {/* ERS */}
           <Route path='admin/ers/bills' element={<Billdetails/>}/>
           <Route path='admin/ers/attendance' element={<Attendance/>}/>
           <Route path='admin/ers/connect' element={<Connect/>}/>
           <Route path='admin/ers/live' element={<LiveTrain/>}/>
           <Route path='admin/ers/completed' element={<Completedtrain/>}/>
           <Route path='admin/ers/traindetails/:id' element={<TrainDetails/>}/>
           <Route path='admin/ers/staffdetails' element={<StaffDetails/>}/>




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
