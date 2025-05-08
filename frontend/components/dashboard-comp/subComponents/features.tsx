import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Bot, Bolt, Zap } from 'lucide-react'
import Link from "next/link"

export default function FeaturesExplore() {
  const features = [
    {
      icon: Search,
      title: "Thesius Search",
      description: "Get the best papers with just a single query",
      link: "/tool/search-papers/"
    },
    {
      icon: Bot,
      title: "Reasearch paper Chat",
      description: "Chat with your favourite research paper",
      link: "/tool/paper-chat/"
    },
    {
      icon: Zap,
      title: "Project Planner (comming soon !)",
      description: "Go from just a bare idea to full executable research plan",
      link: "/dashboard"
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Features to Explore</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index} className="transition-transform hover:scale-105">
            <Card className="h-full bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-gray-600 mb-4" />
                <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
                <CardDescription className="text-gray-700">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

