import { Link, useSearchParams } from "react-router";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Briefcase, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks";

export const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const { isLoaded } = useUser();
  const isMobile = useIsMobile();

  const handleShowSignInModel = () => {
    setShowSignIn(true);
  };

  const handleShowSignUpModel = () => {
    setShowSignUp(true);
  };

  useEffect(() => {
    if (urlSearchParams.get("sign-in")) setShowSignIn(true);
  }, [urlSearchParams]);

  const handleCloseSignInModel = (e) => {
    if (e.target === e.currentTarget) setShowSignIn(false);
    setUrlSearchParams({});
  };

  const handleCloseSignUpModel = (e) => {
    if (e.target === e.currentTarget) setShowSignUp(false);
  };

  return (
    <>
      <div className="w-full">
        <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <div className="h-14 w-30 sm:w-40">
              <Link to={"/"}>
                <img
                  className="h-full w-full object-cover"
                  src="./job-khojo.png"
                  alt="job-khojo-logo"
                />
              </Link>
            </div>
          </div>
          <div>
            <SignedOut>
              <div className="space-x-2">
                <Button
                  size={isMobile ? "sm" : "default"}
                  onClick={handleShowSignInModel}
                >
                  Login
                </Button>
                <Button
                  size={isMobile ? "sm" : "default"}
                  onClick={handleShowSignUpModel}
                  variant={"outline"}
                >
                  Register
                </Button>
              </div>
            </SignedOut>
            {isLoaded ? (
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: "36px",
                        height: "36px",
                      },
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Jobs"
                      href="/my-jobs"
                      labelIcon={<Briefcase size={15} />}
                    />
                    <UserButton.Link
                      label="Saved Jobs"
                      href="/saved-jobs"
                      labelIcon={<Heart size={15} />}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            ) : (
              <div className="mb-1 h-[34px] w-[34px] rounded-full bg-neutral-600"></div>
            )}
          </div>
        </nav>
      </div>
      {showSignIn && (
        <div
          onClick={handleCloseSignInModel}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
        >
          <SignIn />
        </div>
      )}
      {showSignUp && (
        <div
          onClick={handleCloseSignUpModel}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
        >
          <SignUp />
        </div>
      )}
    </>
  );
};
