import React from 'react'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import { House } from 'lucide-react'

function App() {
  return (
    <div>
      <House/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App