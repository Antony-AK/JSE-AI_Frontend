// Landing.jsx
import React, { useState, useEffect } from 'react'
import LandingNavbar from '../Components/LandingNavbar'
import Section from '../Sections/Section'

const Landing = () => {
 

  return (
    <div className="Main bg-white font-Manrope relative scroll-smooth  overflow-y-scroll h-screen">
      <LandingNavbar />
      <Section />
    </div>
  )
}

export default Landing
