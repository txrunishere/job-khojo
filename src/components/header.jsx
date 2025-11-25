import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
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
import { toast } from "sonner";

export const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, user } = useUser();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userRole = user?.unsafeMetadata?.role;

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

  const handleDashboardNavigation = () => navigate("/dashboard/candidate");

  const handlePostJobNavigation = () => navigate("/post-form");

  const handleRecruiterModel = () => setIsOpen(true);

  const handleBecomeRecruiter = async () => {
    const res = await user.update({
      unsafeMetadata: { role: "recruiter" },
    });
    if (res) {
      toast.success(
        "🎉 You’re now a Recruiter! Redirecting you to your hiring dashboard…",
      );
      navigate("/dashboard/recruiter");
      setIsOpen(false);
    } else {
      toast.error("Something went wrong!!");
    }
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
                <div className="flex items-center gap-4">
                  {!pathname.startsWith("/dashboard") && (
                    <Button
                      onClick={handleDashboardNavigation}
                      variant={"outline"}
                      className={"text-xs"}
                      size={"sm"}
                    >
                      Dashboard
                    </Button>
                  )}
                  {pathname === "/dashboard/candidate" && (
                    <Button
                      onClick={handleRecruiterModel}
                      variant={"outline"}
                      className={"text-xs"}
                      size={"sm"}
                    >
                      Hire Candidate ?
                    </Button>
                  )}
                  {userRole &&
                    userRole === "recruiter" &&
                    pathname.startsWith("/dashboard") && (
                      <Button
                        onClick={handlePostJobNavigation}
                        variant={"outline"}
                        className={"text-xs"}
                        size={"sm"}
                      >
                        Post a Job
                      </Button>
                    )}
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
                </div>
              </SignedIn>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-8 w-20 rounded-md bg-neutral-600 px-3"></div>
                <div className="mb-1 h-[34px] w-[34px] rounded-full bg-neutral-600"></div>
              </div>
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-card border-muted flex flex-col gap-6 rounded-xl border p-6">
            <div>
              <h4 className="text-[16px] font-semibold">
                Are you looking to hire candidates?
              </h4>
              <p className="text-muted-foreground">
                Become a recruiter and post jobs.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button size={"sm"} onClick={handleBecomeRecruiter}>
                Become Recruiter
              </Button>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
