import AnimatedCounter from "@/components/features/About/AnimatedCounter";
import WorkshopItem from "@/components/features/About/WorkshopItem";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export const timelineData = [
  {
    title: "The Mission",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-lg font-normal mb-8">
          Our product will help you prep for the SAT by providing a large
          question bank! By practicing daily on this website, one will attain
          a strong understanding of the variety of topics that are covered on
          the SAT. With our no-pressure and stress-free environment, we truly
          believe that you can get a 1550+ on your SAT. We also provide
          various resources to aid you in your SAT journey to your dream
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
    content: (() => {
      const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

      return (
        <div ref={ref}>
          <p className="text-neutral-800 dark:text-neutral-200 text-md md:text-lg font-normal mb-8">
            We provide the ultimate online resource for mastering the SAT! Our
            mission is to empower students to achieve their best scores by
            providing an interactive, personalized, and efficient study
            experience. Whether you&apos;re aiming for a perfect score or just
            trying to improve in specific areas, DailySAT is here to guide you
            every step of the way.
          </p>
          {inView && (
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
          )}
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
      );
    })(),
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
          same resources. Here are some workshops we&apos;ve completed in the
          past.
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
