import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import TestimonialCard from './TestimonialCard';
import { testimonialList } from '@/data/landing-page/testimonials';

const Testimonials = () => {
  return (
    <div>
      <Header
        badgeText="Testimonials"
        text="Other People."
        gradientText='Real Opinions.'
        description="The raw impact DailySAT had on the lives of many students, everywhere in the world!"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {testimonialList.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <TestimonialCard
              name={testimonial.name}
              image_path={testimonial.image_path}
              testimonial={testimonial.testimonial}
              rating={testimonial.rating}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
