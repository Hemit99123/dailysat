import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth/authClient";
import { determineAuthStatus } from "@/lib/auth/authStatus";

const AuthButton = () => {
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const handleGetAuthStatus = async () => {
      const status = await determineAuthStatus();
      setStatus(status);
    };

    handleGetAuthStatus();
  }, []);

  const handleToggleStatus = () => {
    setStatus((prevStatus) => !prevStatus);
  };

  return (
    <>
      {status && (
        <div>
          <button
            onClick={() => {
              signOut();
              handleToggleStatus();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

export default AuthButton;
