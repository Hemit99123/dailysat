import { generateJWT } from '@/lib/jwt/jwtAction';
import { useUserStore } from '@/store/user';
import axios from 'axios';
import React, { FC } from 'react';
import Image from "next/image"

interface RedeemProps {
    isReferred: boolean | undefined
}

const Redeem: FC<RedeemProps> = ({isReferred}) => {

    const setUser = useUserStore((state) => state.setUser)
    
    const redeemReferralBonus = async () => {
        const referralCode = prompt("Enter a referral code:");
    
        if (referralCode) {
            try {
                // Send referral code to the referral API
                await axios.post("/api/referral", {
                    referralCode
                }).then(async () => {
                    // Use the referral code as a Bearer token for the update-user-data API
                    const jwtToken = await generateJWT({
                        authorized: true
                    })


                    const response = await axios.get(
                        "/api/auth/update-user-data",
                        {
                            headers: {
                                Authorization: `Bearer ${jwtToken}`,
                            },
                        }
                    );

                    setUser(response.data.user)
                })
                } catch (error) {
                console.error("Error redeeming reward:", error);
                alert("An error occurred while redeeming the reward.");
            }
        }
    };

    return (
        <div className="shadow-lg w-full rounded-lg bg-white p-4">
            <div className="flex items-center flex-col mb-3">
                <p className="text-3xl font-bold ml-2 text-blue-500">DailySAT Referral</p>
                <p className="text-lg font-semibold text-gray-600 ml-2">
                    Both you and your friend can both redeem 200 coins when your friend first logs in!
                </p>
            </div>
            <Image alt="Redeem icon" height={150} width={150} src={"/icons/high-five.png"} className="w-32 ml-auto mr-auto " />
            <div className='flex justify-center mt-10 items-center'>

            {isReferred == false &&
                <button 
                    className='bg-blue-500 px-6 py-3 text-white rounded-lg font-semibold hover:bg-transparent hover:text-blue-500 duration-500 border-2 border-blue-500'
                    onClick={redeemReferralBonus}
                >
                    Redeem reward
                </button>
            }
            </div>
        </div>
    );
}

export default Redeem;