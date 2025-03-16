import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const About = () => {
  const teamMembers = [
    {
      name: "Aarush Kute",
      designation: "Chief Executive Officer",
      src: "/people/aarush.png", // Update with correct src path
      quote:
        "I am passionate about artificial intelligence and machine learning, with a keen interest in Arduino projects. In my free time, I enjoy playing the piano and tennis. My career goal is to work in the AI/ML field while also pursuing entrepreneurial ventures. I am driven by the desire to innovate and create impactful solutions through technology.",
    },
    {
      name: "Hemit Patel",
      designation: "President & Chief Operating Officer",
      src: "/people/hemit.png",
      quote:
        "Hi! I'm Hemit! A passionate high school student interested in Computer Science, specifically AI which I am currently learning. Additionally, I am also well-versed in full stack development. I am always open to new connections and ideas so feel free to connect with me!",
    },
    {
      name: (
        <>
          <h2 className="inline">Wilman Chan &nbsp;&nbsp;</h2>
          <a
            href="https://www.linkedin.com/in/wilman-chan-03a468286/"
            target="_blank"
          >
            <img
              src="/icons/linkedin.svg"
              className="w-[16px] inline mb-1 "
              alt="Check out Wilman's LinkedIn!"
            />
          </a>
        </>
      ),
      designation: <>Chief Marketing Officer&nbsp;&nbsp;&nbsp;&nbsp;</>,
      src: "/people/G10_Yearbook_Picture.png",
      quote: (
        <>
          Hi there, I&apos;m Wilman! I am a student founder passionate about
          social media marketing & content creation.
        </>
      ),
    },
    {
      name: "Gautham Korrapati",
      designation: "Interim CTO",
      src: "/people/gautham.png",
      quote:
        "Hey, I'm Gautham, a current student at COC and I just want to have fun.",
    },
    {
      name: "Devesh Khilnani",
      designation: "Chief Business Officer",
      src: "/people/devesh.png",
      quote:
        "I am a 17 year old high school and college student with a passion for R&D + business, and medicine. As a startup founder with 2+ years of hands-on experience, I bring entrepreneurial energy and experience to every project, consistently seeking innovative solutions and new challenges.",
    },
  ];
  return (
    <div>
      <AnimatedTestimonials testimonials={teamMembers} />
    </div>
  );
};

export default About;
