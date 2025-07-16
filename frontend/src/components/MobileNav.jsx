import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import DarkMode from "../DarkMode";
import { NavLink } from "react-router-dom";

const MobileNavbar = () => {
  const user = false;

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center gap-2">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-lg font-bold text-blue-600 dark:text-white">
          E-Learning
        </span>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-64 flex flex-col gap-6 p-6">
          <SheetTitle className="text-lg font-semibold">Navigation</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Quickly access your dashboard and settings
          </SheetDescription>

          {user && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-3 text-sm">
            <SheetClose asChild>
              <NavLink
                to="/"
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Home
              </NavLink>
            </SheetClose>

            <SheetClose asChild>
              <NavLink
                to="/my-learning"
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                My Learning
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink
                to="/profile"
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Edit Profile
              </NavLink>
            </SheetClose>
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto flex flex-col gap-3">
            <DarkMode />

            {user ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  My Learning
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Edit Profile
                </DropdownMenuItem>
                <Button variant="outline">Dashboard</Button>
                <Button variant="destructive">Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button>
                  <NavLink to="/login">Sign Up</NavLink>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
