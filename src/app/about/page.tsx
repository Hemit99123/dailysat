import Image from 'next/image';
import React from 'react';
import WorkshopItem from '@/components/features/About/WorkshopItem';

const About = () => {
  return (
    <div>
        <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
            <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                        <h2 className="text-blue-900 text-6xl font-bold font-manrope leading-normal lg:text-start text-center">ACE the SAT.</h2>
                        <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">Our product will help you prep for the SAT through providing a question bank! You will have annotation and other tools available to aid you in your SAT journey to your dream school 🚀</p>
                    </div>
                </div>
                <Image 
                    className='lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="https://pagedone.io/asset/uploads/1717751272.png'
                    src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="About Us image"
                    width={500}
                    height={300}
                />
            </div>
        </div>
    </section>
      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
            <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
              <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
                <Image
                  className="rounded-xl object-cover"
                  src="https://images.unsplash.com/photo-1604933834215-2a64950311bd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={500}
                  height={300}
                  alt='Image of person'
                />
              </div>
              <Image
                className="sm:ml-0 ml-auto rounded-xl object-cover"
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About Us image"
                width={500}
                height={300}
              />
            </div>
            <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                  <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                    Empowering students to succeed!
                  </h2>
                  <p className="text-gray-500 text-sm font-normal leading-relaxed lg:text-start lg:text-base text-center">
                    Welcome to DailySAT, your ultimate online resource for mastering the SAT! Our mission is to empower students to achieve their best scores by providing an interactive, personalized, and efficient study experience. Whether you&apos;re aiming for a perfect score or just trying to improve in specific areas, DailySAT is here to guide you every step of the way.
                  </p>
                </div>
                <div className="w-full lg:justify-start justify-center items-center sm:gap-10 space-x-10 inline-flex">
                  <div className="flex-col justify-start items-start inline-flex">
                    <h3 className="text-blue-400 text-4xl font-bold font-manrope leading-normal">80,000+</h3>
                    <h6 className="text-gray-500 text-base font-normal leading-relaxed">users</h6>
                  </div>
                  <div className="flex-col justify-start items-start inline-flex">
                    <h4 className="text-blue-400 text-4xl font-bold font-manrope leading-normal">3500+</h4>
                    <h6 className="text-gray-500 text-base font-normal leading-relaxed">SAT Questions</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     <section>
  <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-blue-900 text-center">Workshops:</h2>
  <p className="font-light text-gray-500 sm:text-xl text-center">
    We love educating, sharing and learning :) These are workshops completed in the past
  </p>
  <div className="flex flex-col items-center gap-6 mt-10 mb-20">
    <WorkshopItem 
      title='DailySAT x StockSavvy'
      people='60+ people'
      desc='Did a workshop on post-secondary education and finances!'
      icon={
        <svg
        height={75}
        width={75}
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M655.1 877.5H371c-141.3 0-255.9-114.6-255.9-255.9v-19c0-141.3 114.6-255.9 255.9-255.9h284.1c141.3 0 255.9 114.6 255.9 255.9v19c0 141.3-114.6 255.9-255.9 255.9z"
            fill="#FF92B4"
          ></path>
          <path
            d="M373.2 364.5l-50.5-35.9c-8.1-5.8-17.8-8.9-27.8-8.9H171.2c-11.3 0-19.7 10.8-16.5 21.8 7.1 24.7 30.8 43.9 91.5 106.5M148.1 681H78.7c-7.6 0-13.8-6.2-13.8-13.8v-102c0-7.6 6.2-13.8 13.8-13.8h69.4c7.6 0 13.8 6.2 13.8 13.8v102c0 7.7-6.2 13.8-13.8 13.8z"
            fill="#FF92B4"
          ></path>
          <path
            d="M148.1 674.9H78.7c-7.6 0-13.8-6.2-13.8-13.8v-102c0-7.6 6.2-13.8 13.8-13.8h69.4c7.6 0 13.8 6.2 13.8 13.8v102c0 7.6-6.2 13.8-13.8 13.8zM448.1 867v57.3c0 7.6-6.2 13.8-13.8 13.8H333.8c-7.6 0-13.8-6.2-13.8-13.8V867c0-7.6 6.2-13.8 13.8-13.8h100.5c7.6 0 13.8 6.2 13.8 13.8zM704.1 867v57.3c0 7.6-6.2 13.8-13.8 13.8H589.9c-7.6 0-13.8-6.2-13.8-13.8V867c0-7.6 6.2-13.8 13.8-13.8h100.5c7.6 0 13.7 6.2 13.7 13.8zM847.3 589.7c-3.2 2-7.5 1-9.4-2.3l-16.7-28.6c0.7-0.4 26.5-15.6 51.7-37.9 27.5-24.3 43.8-47.7 46.7-66.8 0.5-3.3 3.3-5.8 6.7-5.8H953c3.9 0 7.1 3.4 6.7 7.3-2.8 30.6-23.2 62.8-60.8 95.8-21 18.3-41.7 32.1-51.6 38.3z"
            fill="#FF92B4"
          ></path>
          <path
            d="M256 512.1m-22.3 0a22.3 22.3 0 1 0 44.6 0 22.3 22.3 0 1 0-44.6 0Z"
            fill="#444444"
          ></path>
          <path
            d="M581.3 418H427.8c-2.9 0-5.3-2.4-5.3-5.3v-42.8c0-2.9 2.4-5.3 5.3-5.3h153.5c2.9 0 5.3 2.4 5.3 5.3v42.8c0.1 2.9-2.3 5.3-5.3 5.3z"
            fill="#444444"
          ></path>
          <path
            d="M513.13777778 169.81333333m-107.29244445 0a107.29244445 107.29244445 0 1 0 214.58488889 0 107.29244445 107.29244445 0 1 0-214.58488889 0Z"
            fill="#FFDA00"
          ></path>
        </g>
      </svg>
      }
    />

    <WorkshopItem 
      title='DailySAT x FTN Broadcasting'
      people='1000+ students'
      desc='A broadcasting network with in-house content developments, did some with us!'
      icon={
        <Image 
          src='/workshop/ftnbroadcasting.png' 
          alt="FTN Logo"
          className="w-full h-full object-contain" 
          width={50}
          height={50}
        />
      }
    />
    </div>
      </section>
    </div>
  );
};

export default About;
