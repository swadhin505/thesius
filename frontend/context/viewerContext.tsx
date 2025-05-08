"use client"

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SinglePaperChatStateContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
}

const SinglePaperChatStateContext = createContext<SinglePaperChatStateContextType | undefined>(undefined);

export const SinglePaperChatStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  return (
    <SinglePaperChatStateContext.Provider value={{ selectedText, setSelectedText, inputText, setInputText }}>
      {children}
    </SinglePaperChatStateContext.Provider>
  );
};

export const useSinglePaperChatState = (): SinglePaperChatStateContextType => {
  const context = useContext(SinglePaperChatStateContext);
  if (!context) {
    throw new Error('useSinglePaperChatState must be used within a SinglePaperChatStateProvider');
  }
  return context;
};
