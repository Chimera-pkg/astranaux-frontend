import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return isLoggedIn;
};

export default useAuth;