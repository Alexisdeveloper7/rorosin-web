"use client";

import GlobalOverlay from "@/components/GlobalOverlay";
import { useUser } from "@/context/UserContext";

export default function UserOverlay() {
  const {
    loginModalOpen,
    signupModalOpen,
    closeLoginModal,
    closeSignupModal,
  } = useUser();

  const overlayVisible = loginModalOpen || signupModalOpen;

  const handleClickOverlay = () => {
    if (loginModalOpen) closeLoginModal();
    if (signupModalOpen) closeSignupModal();
  };

  return (
    <GlobalOverlay
      isVisible={overlayVisible}
      onClick={handleClickOverlay}
    />
  );
}