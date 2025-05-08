"use client";

import Navbar from "@/components/global-comp/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import AuthContext, { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const Login = () => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const router = useRouter()
  const {user} = useAuth()

  if (!authContext) {
    throw new Error("AuthContext not provided. Make sure AuthProvider wraps the Login component.");
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const response = await login(email, password);
    if (response?.message) {
      setLoginMessage(response.message)
    }
    setLoading(false)
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user])

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <Navbar />
      <div className="mt-10 max-w-md w-full sm:mx-auto m-2 rounded-2xl p-4 md:p-10 bg-white/30 shadow-lg">
        <form className="my-8" onSubmit={handleSubmit}>
          <Label className="my-2">Email Address</Label>
          <Input
            className="my-2 bg-white/50"
            id="email"
            placeholder="johndoe@foo.com"
            type="email"
            name="email"
          />

          <Label htmlFor="email" className="my-2">
            Password
          </Label>
          <Input
            className="my-2 bg-white/50"
            id="password"
            placeholder="*********"
            type="password"
            name="password"
          />

          <Button type="submit" className="my-4">Sign in</Button>

          <div className="flex">
            <p className="text-neutral-600 text-md max-w-sm mr-1">
              Don't have an account?
            </p>
            <Link className="text-blue-500 font-semibold" href="/auth/register">
              Sign up
            </Link>
          </div>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[3px] w-full" />
          <div className="text-md text-center text-red-500">{loginMessage}</div>
        </form>
      </div>
    </div>
  );
};

export default Login;

