import React from 'react';

const PaymentSuccess = () => {
  return (
      <div className="bg-white p-6 md:mx-auto">
        <svg viewBox="0 0 24 24" className="text-blue-500 w-16 h-16 mx-auto my-6">
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          />
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Operation was successful!
          </h3>
          <p className="text-sm text-gray-600">Have a great day!</p>
          <div className="py-10 text-center">
            <a href="/" className="px-14 py-3 rounded-lg text-xl bg-black hover:bg-gray-800 duration-300 text-white font-semibold ">
              GO HOME
            </a>
          </div>
        </div>
      </div>
  );
};

export default PaymentSuccess;
