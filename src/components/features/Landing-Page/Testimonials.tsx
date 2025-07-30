import React from 'react';
import Header from './Header';
import TestimonialCard from './TestimonialCard';
import { testimonialList } from '@/data/landing-page/testimonials';

const Testimonials = () => {
  return (
    <div>
      <Header
        badgeText="Testimonials"
        text="What Others Think About Us"
        description="Real people, real impact"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {testimonialList.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            title={testimonial.title}
            testimonial={testimonial.testimonial}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
