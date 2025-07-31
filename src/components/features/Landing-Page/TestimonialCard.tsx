import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types/landing-page/testimonial';
import Image from "next/image";

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  testimonial,
  rating = 5,
  image_path
}) => {
  return (
    <div className="h-32 flex items-center p-6 rounded-xl shadow-lg space-x-5">
      <div className="p-[2px] rounded-full bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 inline-block">
        <Image 
          src={`/people/testimonial/${image_path}.png`}
          height={100}
          width={100}
          alt="Person avatar"
          className="rounded-full bg-white" 
        />
      </div>
      <div className='space-y-1'>
        <div className="flex space-x-2 items-center">
          <p className='text-sm sm:text-base text-black font-bold'>{name}</p>
          <div className='flex space-x-1'>
            {[...Array(rating)].map((_, index) => (
              <Star key={index} className="w-3 h-3 text-blue-900 fill-blue-900" />
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium leading-relaxed text-black">
          {testimonial}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
