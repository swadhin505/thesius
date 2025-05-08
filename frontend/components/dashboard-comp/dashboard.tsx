"use client";

import { useState, useRef } from "react";
import { PlusCircle, Pencil, Trash2, Upload, Library } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import FeaturesExplore from "./subComponents/features";
import Link from "next/link";

export function DashboardComponent() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Alpha",
      description: "A groundbreaking initiative",
    },
    { id: 2, name: "Project Beta", description: "Innovating for the future" },
    { id: 3, name: "Project Gamma", description: "Pushing boundaries" },
    { id: 4, name: "Project Delta", description: "Redefining excellence" },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    problemStatement: "",
    document: null as File | null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProject((prev) => ({ ...prev, document: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.description) {
      setProjects((prev) => [...prev, { id: Date.now(), ...newProject }]);
      setNewProject({
        name: "",
        description: "",
        problemStatement: "",
        document: null,
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="container mx-auto mt-16 p-6 max-w-7xl">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold">
            Welcome back {user?.username}!{" "}
          </h1>
          <p className="text-2xl text-black mt-2">
            Here's an overview of your projects.
          </p>
          <Button
            onClick={() => {
              logout();
            }}
            className="bg-red-500 hover:bg-red-600 font-bold text-xl my-2"
          >
            logout
          </Button>
          <FeaturesExplore />
        </div>
      </header>

      <main>
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/library"
              className="transition-transform hover:scale-105"
            >
              <Card className="h-full bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <CardHeader>
                  <Library className="w-12 h-12 text-gray-600 mb-4" />
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Go to your library
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Revist your saved search results and research papers
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
        
        {/* <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            Your project workspace (comming soon !)
          </h2>
          {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="text-black bg-green-600/30 hover:bg-green-600/40">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new project here.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    required
                  />
                </div>
                <div>
                  <Label className="py-3" htmlFor="problemStatement">Have a problem statement for your project ? Add or upload below to get a complete research plan for you !</Label>
                  <Textarea
                    id="problemStatement"
                    name="problemStatement"
                    value={newProject.problemStatement}
                    onChange={handleInputChange}
                    placeholder="Enter your problem statement"
                  />
                </div>
                <div>
                  <Label htmlFor="document">Upload Problem Statement Document</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="document"
                      name="document"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-green-600/40 hover:bg-green-600/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {newProject.document ? newProject.document.name : "No file chosen"}
                    </span>
                  </div>
                </div>
                <Button type="submit" className="text-black w-full bg-green-600/40 hover:bg-green-600/50">Add Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div> */}

        {/* <div className="flex flex-wrap gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shadow-md bg-green-600/10"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {project.name}
                </CardTitle>
                <CardDescription className="text-gray-700">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 mr-2 bg-green-600/20 hover:bg-green-600/30"
                    aria-label={`Enter ${project.name}`}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Enter the project
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 ml-2 bg-green-600/20 hover:bg-green-600/30"
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </main>
    </div>
  );
}
