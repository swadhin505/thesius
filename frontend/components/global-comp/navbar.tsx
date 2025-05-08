"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CompanyLogo from "@/assets/Navbar/logo.png";
import ProfileLogo from "@/assets/Navbar/user.png";
import ProtectedRoute from "./protected-route";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toolsLinks = [
    { name: "Thesius Search", href: "/tool/search-papers" },
    { name: "Research Paper Chat", href: "/tool/paper-chat" },
    { name: "Project Planner (comming soon)", href: "/" },
  ];

  return (
    <ProtectedRoute route={false}>
      <>
        {/* Regular Navbar for larger screens */}
        <nav
          className={`hidden lg:flex w-[50%] m-auto my-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out rounded-xl backdrop-blur-md ${
            isScrolled ? "bg-white/30 shadow-xl" : "bg-white/10 shadow-md"
          }`}
        >
          <Link href="/" className="w-[10%] flex items-center justify-center font-semibold text-gray-500">
            <Image
              src={CompanyLogo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            Beta
          </Link>
          <div className="w-[80%] mx-auto px-4">
            <ul className="flex justify-center items-center h-16 space-x-8">
              {user && (
                <li>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button
                      className={`inline-flex items-center text-lg font-medium transition-colors duration-300 ${
                        isScrolled
                          ? "text-gray-800 hover:text-blue-600"
                          : "text-black hover:text-black"
                      }`}
                    >
                      Tools
                      <ChevronDownIcon
                        className="ml-2 -mr-1 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-green-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                          {toolsLinks.map((tool) => (
                            <Menu.Item key={tool.name}>
                              {({ active }) => (
                                <Link
                                  href={tool.href}
                                  className={`${
                                    active
                                      ? "bg-green-500 text-white"
                                      : "text-gray-900"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  {tool.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </li>
              )}
              <li>
                <Link
                  href="/about"
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-800 hover:text-blue-600"
                      : "text-black hover:text-black"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-800 hover:text-blue-600"
                      : "text-black hover:text-black"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-[10%] flex items-center justify-center">
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button
                  className={`inline-flex items-center text-lg font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-800 hover:text-blue-600"
                      : "text-black hover:text-black"
                  }`}
                >
                  <Image
                    src={ProfileLogo}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full hover:opacity-80"
                  />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-green-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item key={"dashboard"}>
                        {({ active }) => (
                          <Link
                            href={"/dashboard"}
                            className={`font-bold ${
                              active
                                ? "bg-green-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {"dashboard"}
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item key={"logout"}>
                        {({ active }) => (
                          <Button
                            onClick={() => {
                              logout();
                            }}
                            className={` font-bold ${
                              active ? "bg-red-500 text-white" : "text-red-600"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Logout
                          </Button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Button
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 font-bold"
                onClick={() => {
                  router.push("/auth/login");
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </nav>

        {/* Burger menu for smaller screens */}
        <div
          className={`lg:hidden fixed top-0 left-0 right-0 z-50 m-2 rounded-2xl flex backdrop-blur-md justify-between items-center w-full p-4 ${
            isScrolled ? "bg-white/30 shadow-xl" : "bg-white/10 shadow-md"
          }`}
        >
          <Image
            src={CompanyLogo}
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Modal for smaller screens */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <div className="bg-purple-100/80 backdrop-blur-md w-11/12 h-5/6 rounded-lg p-8 flex flex-col items-center space-y-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 text-2xl font-semibold focus:outline-none"
              >
                &times;
              </button>
              <Link href="/">
                <Image
                  src={CompanyLogo}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </Link>
              <ul className="flex flex-col items-center space-y-4">
                <li>
                  <Link
                    href="/about"
                    onClick={() => setIsModalOpen(false)}
                    className="text-2xl font-medium text-gray-800 hover:text-blue-600"
                  >
                    About
                  </Link>
                </li>
                <li>
                  {user && (
                    <li>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button
                          className={`inline-flex items-center text-2xl font-medium transition-colors duration-300 ${
                            isScrolled
                              ? "text-gray-800 hover:text-blue-600"
                              : "text-black hover:text-black"
                          }`}
                        >
                          Tools
                          <ChevronDownIcon
                            className="ml-2 -mr-1 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="z-50 absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-green-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                              {toolsLinks.map((tool) => (
                                <Menu.Item key={tool.name}>
                                  {({ active }) => (
                                    <Link
                                      href={tool.href}
                                      className={`${
                                        active
                                          ? "bg-green-500 text-white"
                                          : "text-gray-900"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                      {tool.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </li>
                  )}
                </li>
                <li>
                  <Link
                    href="/#contact"
                    onClick={() => setIsModalOpen(false)}
                    className="text-2xl font-medium text-gray-800 hover:text-blue-600"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              {user ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button
                    className={`inline-flex items-center text-lg font-medium transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-800 hover:text-blue-600"
                        : "text-black hover:text-black"
                    }`}
                  >
                    <Image
                      src={ProfileLogo}
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="rounded-full hover:opacity-80"
                    />
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-green-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item key={"dashboard"}>
                          {({ active }) => (
                            <Link
                              href={"/dashboard"}
                              className={`font-bold ${
                                active
                                  ? "bg-green-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              {"dashboard"}
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item key={"logout"}>
                          {({ active }) => (
                            <Button
                              onClick={() => {
                                logout();
                              }}
                              className={` font-bold ${
                                active
                                  ? "bg-red-500 text-white"
                                  : "text-red-600"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Logout
                            </Button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Button
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 font-bold"
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}
