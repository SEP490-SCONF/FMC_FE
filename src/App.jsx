import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import CommiteeList from './pages/CommitteeList'
import CallForPaper from './pages/CallForPaper'
import PaperSubmition from './pages/PaperSubmition'
import UserP from './pages/User'
import Screen from './pages/Screen'
import Sub from './pages/author/Submittedpaper'
import SubOrganizer from './pages/organizer/SubmittedPaper'



function App() {

  return (
    <>
      <div>
        {/* <Home /> */}
        {/* <CommiteeList /> */}
        {/* <UserP /> */}
        {/* <Screen /> */}
        {/* <CallForPaper /> */}
        {/* <PaperSubmition /> */}
        <SubOrganizer />
        {/* <Sub /> */}
      </div>
    </>
  )
}

export default App
