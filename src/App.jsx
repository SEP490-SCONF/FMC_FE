import { useState } from 'react'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Login from './pages/Login'



function App() {

  return (
    <>
      <div>
        <Header />
        <Login />
        <Footer />
      </div>
    </>
  )
}

export default App
