'use client';

import { UserProvider } from '../context/UserContext';

export default function AppProvider({ children }) {
  const openLogin = () => {
    window.dispatchEvent(new CustomEvent("open-login"));
  };

  const openSignup = () => {
    window.dispatchEvent(new CustomEvent("open-signup"));
  };

  return (
    <UserProvider
      value={{
        openLogin,
        openSignup
      }}
    >
      {children}
    </UserProvider>
  );
}
