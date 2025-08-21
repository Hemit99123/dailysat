import React from 'react'
import Header from './Header'
import FeatureItem from './FeatureItem'
import { featureList } from '@/data/landing-page/features'


const Features = () => {
  return (
    <div id="how-it-works">
      <Header 
        badgeText="Our Features"
        text="Tools designed for teens"
        description="Not just tools—your sidekicks for smashing goals, staying curious, and doing it all your way."
      />

      <div className="space-y-28">
          {featureList.map((feature, index) => (
            <div key={index} className={index !== 0 ? "mt-10" : ""}>
              <FeatureItem 
                badgeText={feature.badgeText}
                title={feature.title}
                description={feature.description}
                toolTip1={feature.toolTip1}
                toolTip2={feature.toolTip2}
                flip={index % 2 === 1}
                gif={feature.gif}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default Features
