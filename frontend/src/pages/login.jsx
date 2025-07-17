import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/api/authApi";
import { userLoggedIn } from "@/features/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formTab, setFormTab] = useState("signup")

  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleSignupInput = (e) => {
    const { name, value } = e.target;
    setSignUp((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const mutationLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(userLoggedIn({ user: data.user }));
      toast.success("Login Successful");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Login Failed", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    },
  });

  const mutationSignUp = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(
        userLoggedIn({
          user: {
            name: data.user.name,
            email: data.user.email,
          },
        })
      );
      toast.success("Account created successfully");
      setFormTab("login")
    },
    onError: (error) => {
      toast.error("Sign-up failed", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    },
  });

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    mutationSignUp.mutate(signUp);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    mutationLogin.mutate(login);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8">
        <Tabs  value={formTab} onValueChange={setFormTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUpSubmit} autoComplete="on">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>
                    Fill in your details below to create an account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      autoComplete="name"
                      placeholder="John Doe"
                      value={signUp.name}
                      onChange={handleSignupInput}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="john@gmail.com"
                      value={signUp.email}
                      onChange={handleSignupInput}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password" // ✅ required for Chrome password suggestion
                      name="password"
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      value={signUp.password}
                      onChange={handleSignupInput}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} autoComplete="on">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      name="email"
                      autoComplete="username"
                      placeholder="Enter your email"
                      value={login.email}
                      onChange={handleLoginInput}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={login.password}
                      onChange={handleLoginInput}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
