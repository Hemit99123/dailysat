import React from 'react'
import { team } from '@/data/team';
import Image from 'next/image';

const page = () => {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
    <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-blue-900">Our Executives</h2>
    <p className="font-light text-gray-500 sm:text-xl">
        These are the people behind DailySAT!
    </p>
    </div>
    {/* Mapping over team array */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {team.map((member, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
        <Image
            className="rounded-3xl object-cover mb-4"
            src={member.imgSrc}
            alt={member.name}
            width={250}
            height={250}
        />
        <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{member.name}</h3>
            <p className="text-sm">{member.role}</p>
            <ul className="flex justify-center mt-4 space-x-4">
            <li>
                <a href={member.linkedIn} className="text-[#0e76a8] hover:text-gray-900">
                {/* LinkedIn icon */}
                <svg fill="#0090b1" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 310 310" xmlSpace="preserve" stroke="#0090b1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_801_"> <path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"></path> <path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"></path> <path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"></path> </g> </g></svg>
                </a>
            </li>
            </ul>
        </div>
        </div>
    ))}
    </div>
</div>  )
}

export default page