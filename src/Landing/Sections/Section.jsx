import React, { useRef, useEffect } from 'react'
import Header from './Header'
import About from './About'
import DreamJobSection from './DreamJobSection'
import SmartJobSection from './SmartJobSection'
import { useInView } from 'framer-motion'
import Testimonial from './Testimonial'
import Pricing from './Pricing'
import FAQ from './FAQ'
import ClaimSpot from './ClaimSpot'
import Footer from './Footer'

const Section = () => {



  return (
    <div>
      <Header />
      <About />
      <DreamJobSection />
      <SmartJobSection />
      <Testimonial />
      <Pricing />
      <FAQ />
      <ClaimSpot />
      <Footer/>
    </div>
  )
}

export default Section
