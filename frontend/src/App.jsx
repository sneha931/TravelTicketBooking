import React,{useState} from 'react'

import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Register from './componets/Register'
import Login from './componets/Login'
import BusList from './componets/BusList'
import Wrapper from './componets/Wrapper'
import BusSeats from './componets/BusSeats'
import UserBookings from './componets/UserBookings'
import BusDetails from './componets/BusDetails'
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const [selectedBusId, setSelectedBusId] = useState(null) //Newly added state

  const handleLogin = (token, userId)=>{
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    setToken(token)
    setUserId(userId)
  }
const handleLogout = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  setToken(null)
  setUserId(null)
  setSelectedBusId(null)
}
  return (
    
      <div>
        <Wrapper token={token} handleLogout={handleLogout}>
        <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<BusList onSelectBus={(id)=>setSelectedBusId(id)} token={token}/>} />
        <Route path='/bus/:busId' element={<BusSeats token={token}/>} />
        <Route path='/bus-details/:busId' element={<BusDetails />} />
        <Route path='/my-bookings' element={<UserBookings token={token} userId={userId}/>} />
      </Routes>
        </Wrapper>
      
      
    </div>
    
  )
}

export default App