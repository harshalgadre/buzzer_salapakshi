'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nav from './Nav';
import {
  Briefcase,
  Users,
  GraduationCap,
  UserCheck,
  Headphones,
  MonitorCheck,
  ArrowRightLeft,
  Code2,
  Globe2,
  Chrome,
  Monitor,
  Layers,
  Languages,
  BarChart3,
  UserCircle,
  Smile,
  CheckCircle,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const keyfeatures = [
  {
    icon: <ArrowRightLeft size={32} className="text-orange-500" />,
    title: 'Live Interview Assistance',
    description: 'Get hints and support during job interviews, live!',
  },
  {
    icon: <Users size={32} className="text-orange-500" />,
    title: 'HR Assistant & Meeting Copilot',
    description: 'Enhance HR workflows and meetings with AI-powered insights.',
  },
  {
    icon: <Code2 size={32} className="text-orange-500" />,
    title: 'Live Coding Cracker',
    description: 'Ace technical interviews with real-time coding help.',
  },
  {
    icon: <Globe2 size={32} className="text-orange-500" />,
    title: 'Real-Time Meeting Translator',
    description: 'Translate conversations instantly across 12+ languages.',
  },
  {
    icon: <Chrome size={32} className="text-orange-500" />,
    title: 'Chrome Extension Copilot',
    description: 'Overlay assistant in your browser — no tab switching needed.',
  },
  {
    icon: <Monitor size={32} className="text-orange-500" />,
    title: 'Stealth Console / Secondary Screen',
    description:
      'Get hints on a separate screen — never disrupt your main interface.',
  },
  {
    icon: <Layers size={32} className="text-orange-500" />,
    title: 'Multi-platform Support',
    description:
      'Works with Zoom, Google Meet, Teams, WebEx, WhatsApp, Slack, and more.',
  },
  {
    icon: <Languages size={32} className="text-orange-500" />,
    title: 'Language Support',
    description:
      'Supports 12+ languages: English, Arabic, Spanish, Chinese, German, and more.',
  },
  {
    icon: <BarChart3 size={32} className="text-orange-500" />,
    title: 'Session History & Analytics',
    description:
      'Track usage, hints, session logs, and after-session metrics easily.',
  },
];

const features = [
  {
    icon: <Briefcase size={32} className="text-orange-500" />,
    title: 'Job Seekers',
    description: 'Crack interviews & coding challenges.',
  },
  {
    icon: <Users size={32} className="text-orange-500" />,
    title: 'HR Managers',
    description: 'Hire smarter with AI insights.',
  },
  {
    icon: <GraduationCap size={32} className="text-orange-500" />,
    title: 'Students',
    description: 'Ace online assessments & interviews.',
  },
  {
    icon: <UserCheck size={32} className="text-orange-500" />,
    title: 'Consultants',
    description: 'Win clients with real-time support.',
  },
  {
    icon: <Headphones size={32} className="text-orange-500" />,
    title: 'Customer Support',
    description: 'Deliver instant, accurate responses.',
  },
  {
    icon: <MonitorCheck size={32} className="text-orange-500" />,
    title: 'Remote Employees',
    description: 'Collaborate seamlessly in meetings.',
  },
];

const testimonials = [
  {
    icon: <UserCircle size={56} className="text-orange-500" />,
    name: 'Henrik Broberg',
    role: 'SaaS Entrepreneur',
    quote:
      'Buzzer has revolutionized the way people talk to others. Truly a game-changer for business communication!',
  },
  {
    icon: <Smile size={56} className="text-orange-500" />,
    name: 'Claire Kebby',
    role: 'Product Manager',
    quote:
      'As a former job seeker, I appreciate how Buzzer made interviews fun and fair. I landed my dream job!',
  },
  {
    icon: <Briefcase size={56} className="text-orange-500" />,
    name: 'Samir Patel',
    role: 'Consultant',
    quote:
      'The live meeting features help me assist clients seamlessly—Buzzer is a must-have tool!',
  },
];

const faqs = [
  {
    question: 'What platforms does Buzzer support?',
    answer:
      'Buzzer works seamlessly with Zoom, Google Meet, Microsoft Teams, WebEx, WhatsApp, Slack, Telegram, Discord, and many more.',
  },
  {
    question: 'Is Buzzer free?',
    answer:
      'Yes! Buzzer offers a free Starter plan with limited features, plus premium plans for advanced capabilities.',
  },
  {
    question: 'Does Buzzer use ChatGPT?',
    answer:
      'Yes — Buzzer is powered by advanced AI models (including GPT) to deliver instant responses, insights, and translations.',
  },
  {
    question: 'Is Buzzer legal for interviews?',
    answer:
      'Yes, Buzzer complies with platform policies. Always ensure transparency when using AI assistance during interviews or meetings.',
  },
];

const Landing = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';

  return (
    <>
      {/* ✅ Enhanced Navbar with Auth Logic */}
      <Nav />
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-orange-600 hover:text-orange-800 font-semibold transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/console')}
              className="text-orange-600 hover:text-orange-800 font-semibold transition-colors"
            >
              Console
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-orange-600 hover:text-orange-800 font-semibold transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="text-orange-600 hover:text-orange-800 font-semibold transition-colors"
          >
            Login
          </button>
        )}
      </div>


      {/* ===== Hero Section ===== */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-16 px-6 md:px-12 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-stretch w-full">
          {/* Left */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 leading-tight mb-4">
              Free Online <br /> Meeting Copilot for Everyone
            </h2>
            <p className="text-gray-700 text-lg md:text-xl">
              Buzzer helps you ace interviews, meetings, and live coding
              challenges with instant AI-powered hints, real-time translation,
              and stealth support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  isAuthenticated
                    ? router.push('/dashboard')
                    : router.push('/login')
                }
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-200"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Try Demo'}
              </button>
              <button
                onClick={() =>
                  isAuthenticated
                    ? router.push('/console')
                    : router.push('/login')
                }
                className="border-2 border-orange-500 text-orange-600 font-semibold py-2 px-6 rounded-full hover:bg-orange-50 transition-all duration-200"
              >
                Stealth Console
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="bg-orange-500 rounded-2xl shadow-md overflow-hidden flex justify-center items-center">
            <Image
              src="/section.png"
              alt="Practicing Interview Illustration"
              width={500}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>

      {/* ===== Who is Buzzer for ===== */}
      <section className="py-20 bg-white text-center px-6">
        <h2 className="text-4xl font-extrabold text-orange-600 mb-12">
          Who is Buzzer for?
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border p-6 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Key Features ===== */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white text-center px-6">
        <h2 className="text-4xl font-extrabold text-orange-600 mb-12">
          Key Features
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {keyfeatures.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-20 bg-white text-center px-6">
        <h2 className="text-4xl font-extrabold text-orange-600 mb-12">
          What People Say
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <p className="text-gray-700 italic mb-4">"{item.quote}"</p>
              <p className="font-bold text-orange-600">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-gradient-to-t from-orange-50 to-white px-6 text-center">
        <h2 className="text-4xl font-extrabold text-orange-600 mb-10">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-orange-500" />
                ) : (
                  <ChevronDown className="text-orange-500" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
        <footer className="mt-12 sm:mt-16 border-t border-orange-200 pt-11 text-xs sm:text-sm text-gray-600">
          <p className="text-center">
            <span className="font-semibold text-orange-600">Buzzer ©2025.</span>{" "}
            All rights reserved.
          </p>
        </footer>
      </section>
    </>
  );
};

export default Landing;
