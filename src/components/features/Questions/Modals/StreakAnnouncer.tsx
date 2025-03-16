import { useStreakAnnouncerModalStore } from '@/store/modals';
import React from 'react';
import CloseButton from '@/components/features/common/Cancel';

const StreakAnnouncer = () => {
  const { isOpen, closeModal } = useStreakAnnouncerModalStore();

  const handleClose = () => {
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 flex flex-col items-center relative">
            <div className='absolute top-3 right-3'>
              <CloseButton onClose={handleClose} />
            </div>
            <svg
              fill="#e68600"
              height="55px"
              width="55px"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 230.888 230.888"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              enableBackground="new 0 0 230.888 230.888"
              stroke="#e68600"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path d="m85.556,230.888c-75.306,0-90.207-74.522-60.397-119.233 16.063-24.089 49.207-51.316 48.376-97.135-0.196-10.741 11.163-17.803 20.758-12.969 12.145,6.116 26.307,15.677 35.618,29.792 31.977,48.452 15.869,95.759 15.869,95.759s20.333-11.582 37.525-32.073c6.701-7.992 19.45-6.328 23.902,3.107 21.155,44.862 25.808,132.752-62.036,132.752 0-44.713-29.809-88.034-29.809-88.034s-29.806,43.321-29.806,88.034z"></path>
                  </g>
                </g>
              </g>
            </svg>
            <h2 className="font-black text-6xl">3</h2>
            <p className="font-extrabold text-2xl">streaks</p>
            <p className="text-sm text-gray-500 mt-2">You are doing really great!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default StreakAnnouncer;
