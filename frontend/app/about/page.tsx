import { Metadata } from "next";
import Image from "next/image";
import { Motion } from "@/components/ui/motion";
import { TeamMember } from "./team-member";
import Navbar from "@/components/global-comp/navbar";
import swaraj from "@/assets/About/swaraj.jpg";
import swadhin from "@/assets/About/swadhin.jpg";

export const metadata: Metadata = {
  title: "About Us | Our Mission and Team",
  description: "Learn about our mission and meet the team behind our success.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-32 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-16">
          About Us
        </h1>

        <section className="mb-24">
          <Motion
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our mission is to help researchers and engineers overcome the
              challenges of cross-domain projects by simplifying their workflow,
              providing structured support, and making it easier to navigate
              complex ideas while turning them into meaningful progress.
            </p>
          </Motion>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Team
          </h2>
          <div className="space-y-24">
            <TeamMember
              name="Swaraj Kumar Biswal"
              role="IIT Kharagpur"
              imageUrl={swaraj}
              socialLinks={{
                linkedin: "https://www.linkedin.com/in/swaraj-biswal-2a8771252",
                github: "https://github.com/swaraj-42",
                twitter: "/",
              }}
              isReversed={false}
            />

            <TeamMember
              name="Swadhin Kumar Biswal"
              role="IIT Kharagpur"
              imageUrl={swadhin}
              socialLinks={{
                linkedin:
                  "https://www.linkedin.com/in/swadhin-biswal-b87267225",
                github: "https://github.com/swadhin505",
                twitter: "/",
              }}
              isReversed={true}
            />
          </div>
        </section>
      </Motion>
    </div>
  );
}
