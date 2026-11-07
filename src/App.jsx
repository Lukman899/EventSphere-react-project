import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import NotFound from './pages/NotFound'
import HomePage from './pages/HomePage'

function ScrollToTop(){
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo({top : 0})
  },[pathname]);
}

function App() {
  return (
    <div className='min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:text-red-600'>
      <ScrollToTop/>
      <Navbar />
      <div className='flex-1'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App