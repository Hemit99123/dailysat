"use client";

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import Link from 'next/link';

const Tutor = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "What qualifications do I need to become a tutor?",
      answer: "You should have strong knowledge in SAT subjects and preferably experience in teaching or tutoring. A background in education or a relevant field is beneficial but not required."
    },
    {
      question: "How much can I earn as a tutor?",
      answer: "You set your own rates between $20-$80 per hour depending on your experience, qualifications, and the subjects you teach."
    },
    {
      question: "How do I get students?",
      answer: "Once you're registered, students can find you through our platform's search function. We also provide tools to help market your services and optimize your profile visibility."
    },
    {
      question: "How does payment work?",
      answer: "Payments are processed through our secure platform. Students pay in advance for lessons, and tutors receive payment within 48 hours after completing sessions."
    },
    {
      question: "What technology do I need?",
      answer: "You'll need a reliable computer with a webcam, microphone, and stable internet connection. Our platform works on most modern browsers."
    }
  ];

  const tutors = [
    {
      name: "Sarah Johnson",
      subjects: "Math, Reading",
      rating: 4.9,
      students: 78,
      rate: "$45/hr"
    },
    {
      name: "David Chen",
      subjects: "Math, Writing",
      rating: 4.8,
      students: 56,
      rate: "$40/hr"
    },
    {
      name: "Maria Garcia",
      subjects: "All SAT Subjects",
      rating: 5.0,
      students: 104,
      rate: "$55/hr"
    },
    {
      name: "James Wilson",
      subjects: "Reading, Writing",
      rating: 4.7,
      students: 42,
      rate: "$35/hr"
    }
  ];

  const benefits = [
    {
      title: "Flexible Schedule",
      description: "Set your own hours and work when it's convenient for you.",
      icon: <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">📅</div>
    },
    {
      title: "Virtual Classroom",
      description: "Teach from anywhere with our easy-to-use online platform.",
      icon: <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">💻</div>
    },
    {
      title: "Set Your Rates",
      description: "You decide how much to charge between $20-$80 per hour.",
      icon: <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">💵</div>
    },
    {
      title: "Growing Platform",
      description: "Connect with thousands of students looking for SAT help daily.",
      icon: <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">📈</div>
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Hero Text */}
              <div className="text-left lg:max-w-2xl">
                <div className="flex flex-col text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  <span className="text-gray-900 text-4xl sm:text-5xl md:text-6xl">Sign up To</span>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Be A Tutor</span>
                </div>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  Welcome to the best, affordable SAT private tutoring platform, where thousands of students find the perfect teacher daily. Share your expertise and earn on your own schedule.
                </p>
              </div>
              
              {/* Sign Up Card */}
              <div className="mt-10 lg:mt-0 bg-white rounded-lg shadow-xl p-6 max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign Up Today</h2>
                <p className="text-gray-600 mb-6">
                  Join our community of expert tutors and start helping students excel on their SAT. Set your own hours and rates.
                </p>
                <Link href="/auth/signin" className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Sign up with Google
                </Link>
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfj-yLv6oYy6YWy1zXGIzd2XL8YeKX_6Q7QHUproZnhY6ffbw/viewform?usp=header" target="_blank" className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700">
                  Fill out the Google Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Become a DailySAT Tutor?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Join our platform and enjoy these advantages while helping students succeed.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-center mb-4">
                    {benefit.icon}
                    <h3 className="ml-3 text-xl font-medium text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-base text-gray-500">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tutors */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Community</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet Our Top Tutors
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Join these successful tutors who are making a difference in student&apos; lives.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {tutors.map((tutor, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mx-auto mb-4">
                      <span className="text-2xl">{tutor.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{tutor.name}</h3>
                    <div className="mt-2 flex justify-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {tutor.subjects}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{tutor.rating}</span>
                      </div>
                      <div>{tutor.students} students</div>
                      <div className="font-semibold">{tutor.rate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Getting started as a tutor is simple and straightforward.
            </p>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-around">
                <div className="bg-white px-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
                </div>
                <div className="bg-white px-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                </div>
                <div className="bg-white px-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
                </div>
                <div className="bg-white px-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">4</div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Create Your Profile</h3>
                <p className="mt-2 text-base text-gray-500">Sign up and build your profile highlighting your expertise and experience.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Set Your Schedule</h3>
                <p className="mt-2 text-base text-gray-500">Define when you&apos;re available to teach and what subjects you cover.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Connect With Students</h3>
                <p className="mt-2 text-base text-gray-500">Students will book sessions with you based on your profile and availability.</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Get Paid</h3>
                <p className="mt-2 text-base text-gray-500">Teach your sessions and receive payment directly through our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to know about becoming a tutor on our platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            {faqItems.map((item, index) => (
              <div key={index} className="py-6">
                <button
                  onClick={() => toggleFaq(index)}
                  className="text-left w-full flex justify-between items-start text-gray-400"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="ml-6 h-7 flex items-center">
                    {activeFaq === index ? (
                      <X className="h-6 w-6 text-blue-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-500" />
                    )}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="mt-2 pr-12">
                    <p className="text-base text-gray-500">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start teaching?</span>
            <span className="block text-blue-200">Join our community of tutors today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Sign up now
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Jobs
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Press
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Privacy
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Terms
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">&copy; 2025 DailySAT, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Tutor;