import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DarkMode from "../DarkMode";
import MobileNavbar from "./MobileNav";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/authApi";
import { toast } from "sonner";
import { userLoggedOut } from "@/features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(userLoggedOut());
      navigate("/login");

      toast.success("User Logged Out...");
    },
    onError: (error) => {
      console.log("User Logout Error ", error);
    },
  });

  const handleUserLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="w-full border-b bg-white dark:bg-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="hidden md:flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-blue-600 dark:text-white">
              <NavLink to="/">Learning Management System</NavLink>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-lg shadow-xl border border-border mt-2"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <NavLink to="/my-learning">My Learning</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink to="/profile">Edit Profile</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleUserLogout}>Logout</button>
                  </DropdownMenuItem>

                  {user?.user.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="justify-center">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/admin/dashboard")}
                        >
                          Dashboard
                        </Button>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button>
                  <NavLink to="/login">SignUp</NavLink>
                </Button>
              </div>
            )}
            <DarkMode />
          </div>
        </div>

        <div className="md:hidden w-full">
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
