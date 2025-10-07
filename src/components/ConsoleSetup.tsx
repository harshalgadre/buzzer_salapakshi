import React, { useState } from 'react';

export interface ConsoleSettings {
  userName: string;
  resume: string;
  company: string;
  jobDescription: string;
  primaryTechnology: string;
  keywords: string[];
}

interface ConsoleSetupProps {
  onStart: (settings: ConsoleSettings) => void;
  onClose: () => void;
}

const ConsoleSetup: React.FC<ConsoleSetupProps> = ({ onStart, onClose }) => {
  const [userName, setUserName] = useState('');
  const [resume, setResume] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [primaryTechnology, setPrimaryTechnology] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentKeyword.trim() !== '') {
      e.preventDefault();
      if (!keywords.includes(currentKeyword.trim())) {
        setKeywords([...keywords, currentKeyword.trim()]);
      }
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      userName,
      resume,
      company,
      jobDescription,
      primaryTechnology,
      keywords,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white text-buzzer-text p-8 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all animate-fade-in-up relative max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-buzzer-text">Session Setup</h1>
          <button 
            type="button"
            onClick={onClose} 
            className="text-buzzer-subtext hover:text-buzzer-text transition-colors"
            aria-label="Close setup"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto pr-4 -mr-4 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* User Name */}
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-buzzer-subtext mb-1">Your Name</label>
                    <input type="text" id="userName" value={userName} onChange={e => setUserName(e.target.value)} required className="w-full bg-gray-100 border-gray-300 text-buzzer-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-buzzer-orange focus:border-transparent" />
                </div>
                {/* Company */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-buzzer-subtext mb-1">Company</label>
                    <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} required className="w-full bg-gray-100 border-gray-300 text-buzzer-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-buzzer-orange focus:border-transparent" />
                </div>
                {/* Primary Technology */}
                <div className="md:col-span-2">
                    <label htmlFor="primaryTechnology" className="block text-sm font-medium text-buzzer-subtext mb-1">Primary Technology</label>
                    <input type="text" id="primaryTechnology" value={primaryTechnology} onChange={e => setPrimaryTechnology(e.target.value)} required className="w-full bg-gray-100 border-gray-300 text-buzzer-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-buzzer-orange focus:border-transparent" />
                </div>
                {/* Keywords */}
                <div className="md:col-span-2">
                    <label htmlFor="keywords" className="block text-sm font-medium text-buzzer-subtext mb-1">Keywords (Press Enter for each)</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-100 border border-gray-200 rounded-lg">
                        {keywords.map(keyword => (
                            <span key={keyword} className="bg-buzzer-orange-light text-buzzer-orange text-xs font-semibold px-2 py-1 rounded-full flex items-center border border-buzzer-orange/30">
                                {keyword}
                                <button type="button" onClick={() => removeKeyword(keyword)} className="ml-2 text-buzzer-orange hover:text-orange-700">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            id="keywords"
                            value={currentKeyword}
                            onChange={e => setCurrentKeyword(e.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                            className="flex-grow bg-transparent focus:outline-none p-1 text-buzzer-text"
                            placeholder={keywords.length === 0 ? "e.g., React, Node.js, AWS" : ""}
                        />
                    </div>
                </div>
                {/* Job Description */}
                <div className="md:col-span-2">
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-buzzer-subtext mb-1">Job Description</label>
                    <textarea id="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} required rows={5} className="w-full bg-gray-100 border-gray-300 text-buzzer-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-buzzer-orange focus:border-transparent"></textarea>
                </div>
                {/* Resume */}
                <div className="md:col-span-2">
                    <label htmlFor="resume" className="block text-sm font-medium text-buzzer-subtext mb-1">Paste Your Resume</label>
                    <textarea id="resume" value={resume} onChange={e => setResume(e.target.value)} required rows={5} className="w-full bg-gray-100 border-gray-300 text-buzzer-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-buzzer-orange focus:border-transparent"></textarea>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-gray-200 text-buzzer-subtext font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            Back
          </button>
          <button type="submit" className="bg-buzzer-orange text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
            Start Console
          </button>
        </div>

      </form>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConsoleSetup;