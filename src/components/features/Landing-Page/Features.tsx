import React from 'react'
import Header from './Header'
import FeatureItem from './FeatureItem'
import { featureList } from '@/data/features'


const Features = () => {
  return (
    <div>
      <Header 
        badgeText="Our Features"
        text="Tools designed for teens"
        description="Not just tools—your sidekicks for smashing goals, staying curious, and doing it all your way."
      />

      <div className="space-y-10 mt-16">
        {featureList.map((feature, index) => (
          <FeatureItem 
            key={index}
            badgeText={feature.badgeText}
            title={feature.title}
            description={feature.description}
            toolTip1={feature.toolTip1}
            toolTip2={feature.toolTip2}
            flip={index % 2 !== 0} // Flip every second item
          />
        ))}
      </div>
    </div>
  )
}

export default Features
