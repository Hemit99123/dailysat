"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import WorkshopItem from "@/components/features/About/WorkshopItem";
import { Timeline } from "@/components/ui/timeline";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Counter animation only starts when the element comes into view
const AnimatedCounter = ({
  from,
  to,
  duration,
}: {
  from: number;
  to: number;
  duration: number;
}) => {
  const [count, setCount] = useState(from);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1
      );
      setCount(Math.floor(progress * (to - from) + from));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return (
    <h3 ref={ref} className="text-4xl text-[#5FA4F8] font-bold">
      {count.toLocaleString()}+
    </h3>
  );
};

const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  const data = [
    {
      title: "The Mission",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Our product will help you prep for the SAT by providing a large
            question bank! By practicing daily on this website, one will attain
            a strong understanding of the variety of topics that are covered on
            the SAT. With our no-pressure and stress-free environment, we truly
            believe that you can get a 1550+ on your SAT. You also provide
            various available to aid you in your SAT journey to your dream
            school 🚀
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/assets/ace-sat.png"
              alt="SAT Prep"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="/assets/algebra-studying.webp"
              alt="Study Resources"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Why Us?",
      content: (
        <div ref={ref}>
          <p className="text-neutral-800 dark:text-neutral-200 text-md md:text-lg font-normal mb-8">
            We provide the ultimate online resource for mastering the SAT! Our
            mission is to empower students to achieve their best scores by
            providing an interactive, personalized, and efficient study
            experience. Whether you're aiming for a perfect score or just trying
            to improve in specific areas, DailySAT is here to guide you every
            step of the way.
          </p>
          <div className="grid grid-cols-2 mb-4">
            <div>
              <AnimatedCounter from={10000} to={80000} duration={2} />
              <p className="text-lg">Users</p>
            </div>
            <div>
              <AnimatedCounter from={0} to={3500} duration={2} />
              <p className="text-lg">Questions</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/assets/happy-students.avif"
              alt="Happy Students"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="/assets/students-happy-2.avif"
              alt="More Students"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Workshops",
      content: (
        <div>
          <p className="text-lg mb-4">
            We love educating, sharing, and learning! We encourage students to
            work together and bring each other up as they prepare for this
            rigorous exam. By instituting numerous workshops, we cultivate a
            positive and supportive environment where everyone has access to the
            same resources.Here are some workshops we've completed in the past.
          </p>
          <Image
            src="/assets/study-2.avif"
            alt="Workshop Image"
            width={500}
            height={1000}
            className="aspect-square mb-4 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
          />
          <div className="grid lg:grid-cols-1 w-full sm:grid-cols-1 gap-4">
            <WorkshopItem
              title="DailySAT x StockSavvy"
              people="60+ people"
              desc="Hosted a workshop on post-secondary education and finances!"
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
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
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
              title="DailySAT x FTN Broadcasting"
              people="1000+ students"
              desc="A broadcasting network with in-house content developments, did some with us!"
              icon={
                <Image
                  src="/workshop/ftnbroadcasting.png"
                  alt="FTN Logo"
                  className="w-full h-full object-contain"
                  width={50}
                  height={50}
                />
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Timeline data={data} />
    </div>
  );
};

export default About;
