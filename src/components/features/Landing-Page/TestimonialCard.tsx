import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types/landing-page/testimonial';


const TestimonialCard: React.FC<Testimonial> = ({
  name,
  title,
  testimonial,
  rating = 5,
}) => {
  return (
    <div className="h-60 bg-gradient-to-br from-white via-blue-200 to-blue-400 text-white p-6 rounded-xl shadow-lg space-y-4">
      <div className="flex space-x-1">
        {[...Array(rating)].map((_, index) => (
          <Star key={index} className="w-5 h-5 text-blue-900 fill-blue-900" />
        ))}
      </div>

      <p className="text-lg font-medium leading-relaxed text-black">
        "{testimonial}"
      </p>

      <div className="flex items-center space-x-4 pt-2">
        <div>
          <p className="font-semibold text-black">{name}</p>
          <p className="text-sm text-gray-800">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
