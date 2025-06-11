import { useState } from 'react'
import './App.css'
import Header from './components/layout/Header'
import Home from './pages/Home'


function App() {

  return (
    <>
      <div>
        <Header />
        <Home />
      </div>
    </>
  )
}

export default App
