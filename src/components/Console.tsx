"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ConsoleSettings } from './ConsoleSetup';
import {
  CodeBracketIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  StealthLogoIcon,
  RocketLaunchIcon,
  FireIcon,
} from '../icons';

// Speech Recognition Types
interface SpeechRecognitionResult { isFinal: boolean; [key: number]: { transcript: string } }
interface SpeechRecognitionEvent { results: SpeechRecognitionResult[]; resultIndex: number; }
interface SpeechRecognitionErrorEvent { error: string; }
interface SpeechRecognition {
  continuous: boolean; interimResults: boolean;
  onstart: () => void; onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void; onend: () => void;
  start: () => void; stop: () => void;
}

interface SidebarButtonProps {
  icon: React.ReactNode; label: string; shortcut: string;
  isPrimary?: boolean; onClick?: () => void; isActive?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, shortcut, isPrimary = false, onClick, isActive }) => (
  <button onClick={onClick} className={`w-full flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-orange-700' : (isPrimary ? 'bg-blue-600 hover:bg-blue-700' : 'bg-buzzer-orange hover:bg-orange-600')} text-white`}>
    {icon}
    <span className="text-xs font-semibold mt-1">{label}</span>
    <span className="text-[10px] opacity-70">{shortcut}</span>
  </button>
);

interface StealthConsoleProps {
  settings: ConsoleSettings | null;
  onClose: () => void;
}

const StealthConsole: React.FC<StealthConsoleProps> = ({ settings, onClose }) => {
    const [transcript, setTranscript] = useState('');
    const [micStatus, setMicStatus] = useState('Initializing...');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY! }), []);

    // Speech Recognition Setup
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicStatus('Speech recognition not supported.');
            return;
        }

        setMicStatus('Waiting for mic permission...');
        const recognition: SpeechRecognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognitionRef.current = recognition;

        let finalTranscript = '';
        recognition.onstart = () => setMicStatus('Listening...');
        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + '. ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(finalTranscript + interimTranscript);
        };
        recognition.onerror = (event) => {
            if (event.error === 'no-speech') setMicStatus('No speech detected. Restarting...');
            else if (event.error === 'not-allowed') {
                setMicStatus('Microphone access denied. Enable in browser settings.');
                recognitionRef.current?.stop();
            } else setMicStatus(`Error: ${event.error}`);
        };
        recognition.onend = () => {
            if (!micStatus.startsWith('Microphone access denied')) {
                try { recognition.start(); } catch (e) { /* ignore */ }
            }
        };
        try { recognition.start(); } catch(e) { /* ignore */ }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            }
        };
    }, [micStatus]);

    const handleGeminiRequest = async (promptPrefix: string, contextText: string) => {
        setIsLoading(true);
        setResponse('');

        const context = `My name is ${settings?.userName}. I am interviewing at ${settings?.company} for a role focused on ${settings?.primaryTechnology}. Job Description: ${settings?.jobDescription}. My resume summary: ${settings?.resume}.`;
        const fullPrompt = `${promptPrefix}\n\nCONTEXT:\n${context}\n\nTRANSCRIPT / TEXT:\n"${contextText}"`;

        try {
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setResponse(result.text);
        } catch (e) {
            setResponse(`Error: ${(e as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getLastSentence = () => {
        return transcript.split('. ').filter(s => s.trim().length > 0).pop() || '';
    }

    const handleActionClick = (action: string) => {
        setActiveAction(action);
        const lastSentence = getLastSentence();
        if (!lastSentence) {
            setResponse("Please speak first to provide context.");
            return;
        }
        
        let prefix = "";
        switch(action) {
            case "Code":
                prefix = "Based on the following, provide a relevant code snippet:";
                break;
            case "Explain":
                 prefix = "Explain the following concept in simple terms:";
                 break;
            default:
                 return;
        }
        handleGeminiRequest(prefix, lastSentence);
    }
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeAction === 'Help Me' && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                const lastSentence = getLastSentence();
                if (lastSentence) {
                    handleGeminiRequest("Provide a helpful hint or answer based on this question:", lastSentence);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeAction, transcript]);


  return (
    <div className="h-full w-full flex flex-col p-4 bg-[#2d2d2d] text-gray-300">
      <header className="flex justify-between items-center flex-shrink-0 mb-4">
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
          <ArrowLeftIcon />
        </button>
        <div className="flex items-center gap-3">
          <StealthLogoIcon />
          <h1 className="text-2xl font-bold text-buzzer-orange">Stealth Console</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 bg-[#404040] rounded-2xl flex overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
            {isLoading ? (
                 <p className="text-yellow-400 animate-pulse">Buzzer is thinking...</p>
            ) : response ? (
                <pre className="whitespace-pre-wrap font-sans text-base">{response}</pre>
            ) : (
                <div className="space-y-6 text-gray-200">
                    <p className="text-center text-yellow-400 font-semibold">{micStatus}</p>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span></span>
                        <p className="text-lg">Started meeting : <span className="font-bold">{settings?.primaryTechnology || 'General'} Interview</span></p>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold mb-2">Live Transcript:</h2>
                        <p className="text-gray-400 italic h-40 overflow-y-auto p-2 bg-black/20 rounded-md">{transcript || "Waiting for speech..."}</p>
                    </div>
                </div>
            )}
        </div>

        <aside className="w-32 bg-[#2d2d2d]/50 flex-shrink-0 flex flex-col items-center p-4 space-y-3">
           <button onClick={() => setResponse('')} className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
              <DocumentTextIcon />
              <span className="text-xs mt-1">Transcript</span>
           </button>
           <div className="w-full border-b border-gray-600"></div>
           <SidebarButton onClick={() => handleActionClick('Code')} isActive={activeAction === 'Code'} icon={<CodeBracketIcon />} label="Code" shortcut="Click" />
           <SidebarButton onClick={() => handleActionClick('Explain')} isActive={activeAction === 'Explain'} icon={<ChatBubbleBottomCenterTextIcon />} label="Explain" shortcut="Click" />
           <SidebarButton onClick={() => setActiveAction('Help Me')} isActive={activeAction === 'Help Me'} icon={<SparklesIcon />} label="Help Me" shortcut="Space | En..." />
           <SidebarButton icon={<ComputerDesktopIcon />} label="Screen" shortcut="Ctrl+Insert" isPrimary />
        </aside>
      </main>
    </div>
  );
};

export default StealthConsole;
