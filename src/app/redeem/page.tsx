"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Signup() {
  // State variables to store purpose, email, picture, and input field text
  const [purpose, setPurpose] = useState<string>("");
  const [inputFieldText, setInputFieldText] = useState<string>("");

  // useEffect to set the purpose based on URL parameters
  useEffect(() => {
    const searchParams: URLSearchParams = new URL(window.location.href).searchParams;
    setPurpose(searchParams.get("t") || "");
  }, []);

  // Function to send request based on the purpose
  async function sendReq() {
      try {
        if (purpose === "Referee bonus") {
          await axios.post("/api/referral", {
            id_referee: inputFieldText
          });
        } else {
          // For now, just the two purposes
          await axios.post("/api/initial-250-auth");
        }
        window.location.replace("/");
      } catch (error) {
        console.error("Error sending request:", error);
        window.alert("An error occurred while sending the request.");
      }
  }

  return (
    <div>
        <div className="bg-white p-8">
          <div className="flex mb-6">

          {purpose === "Referee bonus" && (
            <div className="flex justify-center mb-12">
              <h2>Input the Code given to you:</h2>
              <input
                type="text"
                className="fancy-input ml-4 -mt-1"
                onChange={(e) => setInputFieldText(e.target.value || "")}
                value={inputFieldText}
              />
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="w-[30%] px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={sendReq}
            >
              Continue
            </button>
          </div>
        </div>
    </div>
    </div>
  );
}
