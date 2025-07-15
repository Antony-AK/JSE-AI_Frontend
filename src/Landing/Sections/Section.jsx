import React, { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { useRobotStore } from '../store/useRobotStore'

import Header from './Header'
import About from './About'
import DreamJobSection from './DreamJobSection'
import SmartJobSection from './SmartJobSection'
import Testimonial from './Testimonial'
import Pricing from './Pricing'
import FAQ from './FAQ'
import ClaimSpot from './ClaimSpot'
import Footer from './Footer'

const Section = () => {
  const setActiveSection = useRobotStore((state) => state.setActiveSection)

  const aboutRef = useRef()
  const dreamRef = useRef()
  const smartRef = useRef()
  const headerRef = useRef()
  const pricingRef = useRef()
    const testimonialRef = useRef() // ✅ NEW



const inHeader = useInView(headerRef, { margin: '-10% 0px -70% 0px' }) // wider top range
const inAbout = useInView(aboutRef, { margin: '-45% 0px -45% 0px' })
  const inDream = useInView(dreamRef, { margin: '-30% 0px -30% 0px' })
  const inSmart = useInView(smartRef, { margin: '-30% 0px -30% 0px' })
  const inPricing = useInView(pricingRef, { margin: '-30% 0px -30% 0px' })
    const inTestimonial = useInView(testimonialRef, { margin: '-30% 0px -30% 0px' }) // ✅ NEW


 useEffect(() => {
    if (inPricing) setActiveSection('pricing')        // 🆕 Top priority
    else if (inSmart) setActiveSection('smart')
    else if (inDream) setActiveSection('dream')
    else if (inAbout) setActiveSection('about')
    else if (inHeader) setActiveSection('header')
      else if (inTestimonial) setActiveSection('testimonial') // ✅ When testimonial enters, clear it
    else setActiveSection(null) // 🧨 Force null if none matched
  }, [inHeader, inAbout, inDream, inSmart, inPricing, inTestimonial]) // ✅ Add to deps

  useEffect(() => {
  setActiveSection('header'); // ✅ force set on mount (first render)
}, []);


  return (
    <div>
      <div ref={headerRef}><Header /></div>
      <div ref={aboutRef}><About /></div>
      <div ref={dreamRef}><DreamJobSection /></div>
      <div ref={smartRef}><SmartJobSection /></div>
      <div ref={testimonialRef}><Testimonial /></div>
      <div ref={pricingRef}><Pricing /></div>
      <FAQ />
      <ClaimSpot />
      <Footer />
    </div>
  )
}

export default Section