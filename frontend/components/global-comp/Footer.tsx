"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-sm text-gray-600 pt-24 pb-12 rounded-2xl w-[90%] mx-auto my-10 border-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex space-x-6">
            <Link
              href="https://www.linkedin.com/company/thesius-ai/"
              target="blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://x.com/thesiusai"
              target="blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaXTwitter className="h-6 w-6" />
              <span className="sr-only">X</span>
            </Link>
            <Link
              href="https://www.instagram.com/thesius_ai/profilecard/?igsh=MWpjZGZ6aDhjMmV0aQ=="
              target="blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <InstagramLogoIcon className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.instagram.com/thesius_ai/profilecard/?igsh=MWpjZGZ6aDhjMmV0aQ=="
              target="blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaFacebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm">
              We are dedicated to providing students and professionals with the
              best AI-powered research tools, ensuring quick access to relevant
              data and actionable insights for informed decision-making
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#FeatureDescription"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="text-sm">Indian Institute of Technology, Kharagpur</p>
            <p className="text-sm">Kharagpur, West Bengal 721302</p>
            <p className="text-sm">Phone: 6372632223</p>
            <p className="text-sm">Email: thesius42@gmail.com</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Subscribe to Our Newsletter
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button
                type="submit"
                className="w-full bg-green-500/50 hover:bg-green-700/50 text-gray-800 font-semibold"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Thesius.ai all rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
