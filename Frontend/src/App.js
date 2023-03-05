import React from 'react'
import { Route, Routes } from "react-router-dom"
// import Login from './components/login';
// import Meja from './pages/user/meja';
// import Menu from './pages/user/menu';
import User from './pages/user/user';
// import Pemesanan from './pages/kasir/pemesanan';
// import Riwayat from './pages/kasir/riwayat'
// import Manajer from './pages/manager/manager';

function App() {
  return (
    <Routes>
      {/* <Route exact path="/" element={<Login />} /> */}
      <Route path="/user/user" element={<User />} />
      {/* <Route path='/user/meja' element={<Meja />} />
      <Route path='/user/menu' element={<Menu />} />
      <Route path='/kasir/pemesanan' element={<Pemesanan />} />
      <Route path='/kasir/riwayat' element={<Riwayat />} />
      <Route path='/manager' element={<Manager />} /> */}
    </Routes>
  )
}
export default App;