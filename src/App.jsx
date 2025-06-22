import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import CommiteeList from './pages/CommitteeList'
import CallForPaper from './pages/CallForPaper'
import { BrowserRouter } from "react-router-dom";
import PaperSubmition from './pages/PaperSubmition'
import UserP from './pages/User'
import Screen from './pages/Screen'



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
