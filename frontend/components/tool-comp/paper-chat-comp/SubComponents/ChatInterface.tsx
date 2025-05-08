"use client";

import { useChat } from "ai/react";
import { useRef, useState, useEffect } from "react";
import { BsRobot, BsSend } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdAttachFile, MdClose } from "react-icons/md";
import Image from "next/image";
import "./chatinterface.css";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import Katex CSS
import { useSinglePaperChatState } from "@/context/viewerContext";

export default function ChatPage() {
  const { messages, setMessages, input, stop, isLoading, setInput, handleInputChange, handleSubmit } =
    useChat();
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Context provider
  const { inputText, setInputText } = useSinglePaperChatState();

  const handlePaste = (event: ClipboardEvent) => {
    const fileToFileList = (file: File): FileList => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      return dataTransfer.files;
    };
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            setFiles(fileToFileList(pastedFile));
            break; // Only set the first image found
          }
        }
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    if (inputText.length > 0) {
      setInput(inputText);
      // console.log(input)
      setInputText("");
    }
  }, [inputText]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col bg-gray-100 text-black h-[90vh] sm:h-screen">
      <div className="flex-1 overflow-auto p-1 md:p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`flex items-start max-w-[95%] md:max-w-[80%] ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === "user" ? "bg-green-500 ml-2" : "bg-green-300 mr-2"
                }`}
              >
                {m.role === "user" ? (
                  <FaUserAlt className="text-white" />
                ) : (
                  <BsRobot className="text-gray-600" />
                )}
              </div>
              <div
                className={`md:p-3 px-1 rounded-lg ${
                  m.role === "user" ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {m?.experimental_attachments
                  ?.filter((attachment) =>
                    attachment?.contentType?.startsWith("image/")
                  )
                  .map((attachment, index) => (
                    <Image
                      key={`${m.id}-${index}`}
                      src={attachment.url}
                      width={400}
                      height={400}
                      alt={attachment.name ?? `attachment-${index}`}
                      className="rounded-md mb-2"
                    />
                  ))}
                {/* <p className="text-sm">{m.content}</p> */}
                <ReactMarkdown
                  className="markdown text-xs sm:text-sm"
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        className="border-t border-gray-200 p-4 bg-gray-200"
        onSubmit={(event) => {
          handleSubmit(event, { experimental_attachments: files });
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <div className="mb-2">
          {files && files.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {Array.from(files).map((file, index) => (
                <div key={index} className="relative inline-block">
                  <Image
                    src={URL.createObjectURL(file)}
                    width={200}
                    height={200}
                    alt={`Preview ${index + 1}`}
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFiles(undefined);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <MdClose className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            ref={fileInputRef}
            accept="image/*"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-green-300 rounded-md text-gray-500 hover:text-gray-700"
          >
            <MdAttachFile className="w-5 h-5" />
          </button>
          <textarea
            className="flex-1 p-2 text-xs sm:text-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={input}
            placeholder="Ask anything..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="p-2 bg-green-300 text-black rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <BsSend className="w-5 h-5" />
          </button>
          {isLoading && <button
            className="p-2 bg-red-300 text-black rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
            type="button"
            onClick={() => stop()}
          >
            stop
          </button>}
        </div>
      </form>
    </div>
  );
}
