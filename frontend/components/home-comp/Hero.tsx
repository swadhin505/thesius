"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  FaRobot,
  FaChartLine,
  FaNewspaper,
  FaBrain,
  FaRocket,
  FaCog,
  FaDatabase,
  FaLightbulb,
  FaMicrochip,
  FaGlobe,
} from "react-icons/fa";
import { Button } from "../ui/button";
import "./custom-styles/1-hero-style.css";

const icons = [
  { component: FaRobot, position: "left-[10%] top-[20%]" },
  { component: FaChartLine, position: "left-[30%] top-[50%]" },
  { component: FaNewspaper, position: "left-[60%] top-[30%]" },
  { component: FaBrain, position: "left-[80%] top-[60%]" },
  { component: FaRocket, position: "left-[15%] top-[40%]" },
  { component: FaCog, position: "left-[50%] top-[70%]" },
  { component: FaDatabase, position: "left-[70%] top-[10%]" },
  { component: FaLightbulb, position: "left-[85%] top-[40%]" },
  { component: FaMicrochip, position: "left-[40%] top-[20%]" },
  { component: FaGlobe, position: "left-[20%] top-[60%]" },
];

const Hero = () => {
  const router = useRouter();
  return (
    <div className="mt-[100px] relative h-[70vh] flex flex-col justify-center items-center overflow-hidden">
      {icons.map(({ component: Icon, position }, index) => (
        <Icon
          key={index}
          className={`-z-[1] animate-bounce-slow fixed text-6xl text-green-700 opacity-20 animate-float ${position}`}
        />
      ))}

      <div className="scale-in-center w-[80%] md:w-[40%] flex flex-col justify-center items-center z-10">
        <div className="my-4 text-2xl md:text-4xl lg:text-6xl text-center font-bold text-[#2b2b2b]">
          From Idea to Impact — Discover Research That Drives Innovation
        </div>
        <div className="font-bold">
          Powered by OpenAlex
        </div>
        <div className="py-4 text-md sm:text-lg text-center font-bold text-[#4b4b4b]">
          Research should drive your work faster, not slow it down. Our
          platform brings you the papers you need — quickly and reliably. Spend
          less time searching and more time bringing your crazy ideas to life.
        </div>
      </div>

      <div className="scale-in-center flex my-3 z-10">
      <Button
      className="mx-3 px-8 py-8 text-md md:text-2xl text-gray-800 text-center font-semibold bg-green-500/50 hover:bg-green-700/50 rounded-lg shadow-lg"
      onClick={() => router.push("/auth/login")}
    >
          Get Started
        </Button>
        {/* <Button className="mx-3 px-8 py-8 text-md md:text-2xl text-gray-800 text-center font-semibold bg-green-500/50 hover:bg-green-700/50 rounded-lg shadow-lg">
          Watch Demo
        </Button> */}
      </div>
    </div>
  );
};

export default Hero;
