"use client";

import axios from "axios";
import { useState } from "react";

export default function Authorize() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  const handleAuthorization = async () => {
    try {
      const response = await axios.post(`/api/employee-verification/`, {
        email
      });

      if (response.data.result) {
        // Generate the OTP and send it via email
        alert("OTP sent to your email!");
        setEmail("")
      } else {
        alert(
          "Unauthorized email. Please try again or contact DailySAT staff for assistance!"
        );
      }
    } catch (error) {
      console.error("Error during authorization:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleVerification = async () => {
    try {
      const email = prompt("Enter email please")

      // Here we see if email actually belongs to the user because the otp was sent to their email
      const response = await axios.get(`/api/employee-verification/otp`, {
        params: { passwordAttempt: otp, email },
      });

      // result is true meaning we are good to go to assign the session and stuff
      if (response.data.result) {
        alert("Verification successful!");
        // add session to the redis db 
        await axios.post('/api/employee-session', {
          email
        })
        setOTP("")
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Employee Authorization
        </h1>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Enter your email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleAuthorization}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>

        <div className="mt-8">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP:
          </label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleVerification}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition mt-4"
        >
          Verify Code
        </button>
      </div>
    </section>
  );
}
