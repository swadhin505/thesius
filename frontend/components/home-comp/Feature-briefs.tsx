"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import newsimg from "@/assets/Home/FeatureBrief/news.png";
import notesimg from "@/assets/Home/FeatureBrief/notes.png";
import reportsimg from "@/assets/Home/FeatureBrief/reports.png";
import searchimg from "@/assets/Home/FeatureBrief/search.png";
import { useRef } from "react";
import useVisibility from "@/lib/visibility-detector";
import "./custom-styles/3-feature-briefs.css";

export function FeatureBriefs() {
  interface Feature {
    name: string;
    icon: StaticImageData;
    color: string;
    description: string;
  }
  const services: Feature[] = [
    {
      name: "Research Pathway",
      icon: notesimg,
      color: "bg-green-100/50 hover:bg-green-200/30",
      description:
        "Get a clear, guided roadmap based on your query, with key research insights and recommended resources for deeper exploration",
    },
    {
      name: "Core Findings",
      icon: reportsimg,
      color: "bg-green-100/50 hover:bg-green-200/30",
      description:
        "Access essential papers that directly address your research question, giving you a solid foundation without the hassle.",
    },
    {
      name: "Explore Further",
      icon: newsimg,
      color: "bg-green-100/50 hover:bg-green-200/30",
      description:
        "Pick the results that resonate most with your research, then ask follow-up questions to dive deeper and uncover more relevant insights.",
    },
    {
      name: "Optimize Each Result",
      icon: searchimg,
      color: "bg-green-100/50 hover:bg-green-200/30",
      description:
        "Engage with each study by exploring similar research papers, checking citations for reliability, delving into references, and much more to broaden your perspective.",
    },
  ];

  // Refs for each element
  const elementRefs = services.map(() => useRef<HTMLDivElement | null>(null));
  const visibilities = elementRefs.map((ref) => useVisibility(ref, 0));

  return (
    <Card className="w-[90%] lg:w-[60%] mx-auto my-32 shadow-2xl rounded-2xl bg-green-300/20 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-12 md:py-24 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl md:text-5xl font-bold text-center text-primary">
          New teammate for your research project.
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-md md:text-lg text-[#3b3b3b]">
          Access the most important data with ease. We bring together relevant
          information and guide you to focus on what really matters.
        </CardDescription>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              ref={elementRefs[index]}
              key={index}
              // ${
              //   visibilities[index]
              //     ? index % 2 === 0
              //       ? "slide-in-left"
              //       : "slide-in-right"
              //     : "slide-out"
              // }
              className={`
              flex items-center p-4 rounded-lg shadow-xl ${
                service.color
              } transition-colors duration-300 w-full text-left overflow-hidden`}
            >
              <div className="flex-shrink-0 mr-4">
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-xl font-semibold flex items-center">
                  {service.name}
                </h3>
                <p className="mt-2 text-[10px] sm:text-sm text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
