import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Book,
  Code,
  Cog,
  Zap,
  ExternalLink,
  Youtube,
  FileText,
  Globe,
} from "lucide-react";

const steps = [
  {
    title: "Learn the Basics",
    description:
      "Gain a strong foundation by understanding the key principles of chatbot technology and conversational AI. Start with fundamental concepts such as chatbot functionality, how they interpret user input, and how natural language processing (NLP) enables these bots to simulate human-like conversations.",
    icon: Book,
    resources: {
      youtube: [
        {
          title: "Introduction to Chatbots",
          description:
            "A beginner-friendly introduction to chatbot technology, its potential applications, and how chatbots are transforming various industries.",
          url: "https://youtube.com/watch?v=example1",
        },
        {
          title: "Conversational AI Fundamentals",
          description:
            "An in-depth look at the core components of conversational AI, including NLP, machine learning, and understanding user intents.",
          url: "https://youtube.com/watch?v=example2",
        },
      ],
      papers: [
        {
          title: "Survey of Chatbot Design Techniques",
          description:
            "An academic survey that outlines various design approaches for chatbots, exploring how they address different conversational challenges.",
          url: "https://example.com/paper1.pdf",
        },
        {
          title: "Advances in Natural Language Processing for Chatbots",
          description:
            "A review of the latest NLP technologies that enhance chatbot accuracy and user engagement.",
          url: "https://example.com/paper2.pdf",
        },
      ],
      articles: [
        {
          title: "Getting Started with Chatbot Development",
          description:
            "A comprehensive beginner's guide covering the basics of building a chatbot from scratch.",
          url: "https://example.com/article1",
        },
        {
          title: "Key Concepts in Conversational AI",
          description:
            "An article exploring essential ideas and terminologies, helping newcomers understand the building blocks of conversational AI.",
          url: "https://example.com/article2",
        },
      ],
    },
  },
  {
    title: "Choose Your Tech Stack",
    description:
      "Decide on the best programming languages, frameworks, and tools for your chatbot based on your project’s requirements. Learn about the popular frameworks, compare their features, and choose a tech stack that aligns with your goals and technical expertise.",
    icon: Code,
    resources: {
      youtube: [
        {
          title: "Comparing Chatbot Frameworks",
          description:
            "A detailed comparison of chatbot frameworks, highlighting their strengths, weaknesses, and best use cases.",
          url: "https://youtube.com/watch?v=example3",
        },
        {
          title: "Deep Dive into NLP Tools",
          description:
            "An analysis of various NLP tools and libraries, explaining how they support chatbot development and enhance user interactions.",
          url: "https://youtube.com/watch?v=example4",
        },
      ],
      papers: [
        {
          title: "Performance Analysis of Chatbot Frameworks",
          description:
            "A research study comparing performance metrics across different chatbot frameworks.",
          url: "https://example.com/paper3.pdf",
        },
        {
          title: "Emerging Trends in Chatbot Technologies",
          description:
            "An overview of the latest advancements in chatbot technologies and future trends.",
          url: "https://example.com/paper4.pdf",
        },
      ],
      articles: [
        {
          title: "Top 10 Chatbot Frameworks in 2024",
          description:
            "An article listing the most popular chatbot frameworks, with pros and cons for each.",
          url: "https://example.com/article3",
        },
        {
          title: "Choosing the Right NLP Library for Your Chatbot",
          description:
            "Guidelines for selecting the best NLP library to suit your chatbot's unique needs.",
          url: "https://example.com/article4",
        },
      ],
    },
  },
  {
    title: "Design the Conversation Flow",
    description:
      "Outline the interactions your chatbot will have with users, mapping out possible conversation paths and responses. By understanding user intents, you’ll create a seamless and engaging conversation flow that keeps users engaged and on track.",
    icon: Cog,
    resources: {
      youtube: [
        {
          title: "Conversation Design Principles",
          description:
            "An exploration of essential conversation design principles to create natural, intuitive, and user-friendly chatbot interactions.",
          url: "https://youtube.com/watch?v=example5",
        },
        {
          title: "User Intent Mapping Techniques",
          description:
            "Detailed strategies for identifying user intents, creating conversation flows, and ensuring relevant responses.",
          url: "https://youtube.com/watch?v=example6",
        },
      ],
      papers: [
        {
          title: "Optimizing Conversation Flows in Chatbots",
          description:
            "Research insights on improving the logical flow of chatbot conversations to enhance coherence and effectiveness.",
          url: "https://example.com/paper5.pdf",
        },
        {
          title: "User Experience in Conversational Interfaces",
          description:
            "A study focused on optimizing the user experience in chatbot interactions through effective design.",
          url: "https://example.com/paper6.pdf",
        },
      ],
      articles: [
        {
          title: "Best Practices for Chatbot Conversation Design",
          description:
            "Expert insights and best practices for designing conversational flows that feel natural to users.",
          url: "https://example.com/article5",
        },
        {
          title: "Creating Natural Dialogues in Chatbots",
          description:
            "Methods to make chatbot dialogues sound more authentic and human-like.",
          url: "https://example.com/article6",
        },
      ],
    },
  },
  {
    title: "Implement and Test",
    description:
      "Put your chatbot design into action by implementing the conversation flow, integrating NLP capabilities, and rigorously testing its functionality. Testing ensures the chatbot responds accurately and provides a smooth user experience.",
    icon: Zap,
    resources: {
      youtube: [
        {
          title: "Building a Chatbot with React",
          description:
            "A complete guide to building a chatbot using React, covering development from setup to deployment.",
          url: "https://youtube.com/watch?v=example7",
        },
        {
          title: "Advanced Chatbot Testing Strategies",
          description:
            "Comprehensive testing methods to ensure your chatbot meets performance and reliability standards.",
          url: "https://youtube.com/watch?v=example8",
        },
      ],
      papers: [
        {
          title: "Automated Testing Frameworks for Chatbots",
          description:
            "An overview of frameworks and tools for automated chatbot testing, to ensure robust performance.",
          url: "https://example.com/paper7.pdf",
        },
        {
          title: "Evaluating Chatbot Performance: Metrics and Methods",
          description:
            "A guide on using various metrics and methods to evaluate and enhance chatbot performance.",
          url: "https://example.com/paper8.pdf",
        },
      ],
      articles: [
        {
          title: "Step-by-Step Guide to Implementing a Chatbot",
          description:
            "A detailed guide on the implementation process, from initial setup to final testing.",
          url: "https://example.com/article7",
        },
        {
          title: "Comprehensive Chatbot Testing Checklist",
          description:
            "A checklist to ensure your chatbot is thoroughly tested and ready for real-world interactions.",
          url: "https://example.com/article8",
        },
      ],
    },
  },
];

function ResourceCard({ title, description, url, icon: Icon }) {
  return (
    <Card className="flex flex-col h-full bg-gray-300">
      <CardHeader>
        <Icon className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          Learn More
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
}

export function RoadmapGuide() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black">Chatbot Development Roadmap</h2>
      {steps.map((step, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <step.icon className="w-5 h-5" />
              <span className="text-lg">{step.title}</span>
            </CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="youtube" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="papers">Papers</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
              </TabsList>
              <TabsContent value="youtube" className="mt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {step.resources.youtube.map((resource, idx) => (
                    <ResourceCard
                      key={idx}
                      title={resource.title}
                      description={resource.description}
                      url={resource.url}
                      icon={Youtube}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="papers" className="mt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {step.resources.papers.map((resource, idx) => (
                    <ResourceCard
                      key={idx}
                      title={resource.title}
                      description={resource.description}
                      url={resource.url}
                      icon={FileText}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="articles" className="mt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {step.resources.articles.map((resource, idx) => (
                    <ResourceCard
                      key={idx}
                      title={resource.title}
                      description={resource.description}
                      url={resource.url}
                      icon={Globe}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center">
        <Button>
          Start Building Your Chatbot
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
