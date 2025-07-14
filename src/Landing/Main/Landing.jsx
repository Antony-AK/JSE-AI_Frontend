// Landing.jsx
import React, { useState, useEffect } from 'react'
import ModelViewer from '../3D_Model/Model'
import LandingNavbar from '../Components/LandingNavbar'
import Section from '../Sections/Section'

const Landing = () => {
 

  return (
    <div className="Main bg-white font-poppins relative  overflow-y-scroll h-screen">
      <LandingNavbar />
      <ModelViewer />
      <Section />
    </div>
  )
}

export default Landing
