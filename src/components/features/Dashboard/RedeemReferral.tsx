import axios from 'axios';
import React from 'react';
import Header from './Header';


const RedeemReferral = () => {
  const redeemReferralBonus = async () => {
    const referralCode = prompt("Enter a referral code:");

    if (referralCode) {
      try {
        await axios.post("/api/redeem-referral", {
          referralCode,
        });
      } catch (error) {
        alert("An error occurred while redeeming the reward.");
      }
    }
  };

  return (
    <div className="shadow-lg w-full rounded-lg bg-white p-4">
      <Header title="DailySAT Referral" icon="gift" />
      <p className="text-lg font-semibold text-gray-600 mb-6">
        Redeem 250 coins by using a referral code.
      </p>
      <div className="flex justify-center mt-10 items-center">
      <button
                className="bg-blue-600 px-6 py-3 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 border-none"
                onClick={redeemReferralBonus}
       >
           Redeem reward
      </button>  
      </div>
    </div>
  );
};

export default RedeemReferral;
