import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import CallToAction from './CallToAction'
import FooterSection from './FooterSection'
import DiscoverSection from './DiscoverSection'


const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection/>
      <CallToAction />
      <FooterSection />
    </div>
  )
}

export default Landing
