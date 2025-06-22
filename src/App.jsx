import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import CommiteeList from './pages/CommitteeList'
import CallForPaper from './pages/CallForPaper'
import { BrowserRouter } from "react-router-dom";


function App() {

  return (
    <>
      <div>
 <BrowserRouter> <CallForPaper /></BrowserRouter>
       

      </div>
    </>
  )
}

export default App
