'use client';
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#ff751f] text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Name */}
        <div className="flex items-center space-x-2 shadow-2xl">
          <img
            src="/logo.png"
            alt="Buzzer Logo"
            className="w-8 h-8"
          />
          <span className="text-2xl font-bold">Buzzer</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#demo" className="hover:text-orange-200">
            Demo
          </Link>
          <Link href="#pricing" className="hover:text-orange-200">
            Pricing
          </Link>
          <Link href="/console" className="hover:text-orange-200">
            Console
          </Link>
          <Link href="#faq" className="hover:text-orange-200">
            FAQ
          </Link>
          <button className="bg-white text-[#ff751f] px-5 py-2 rounded-full font-semibold transition hover:bg-orange-100">
            <Link href="/login">
              Login
            </Link>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Orange Theme) */}
      {isOpen && (
        <div className="md:hidden bg-[#ff751f] border-t border-orange-300 px-6 py-4 space-y-4 text-white">
          <Link href="#demo" className="block hover:text-orange-200">
            Demo
          </Link>
          <Link href="#pricing" className="block hover:text-orange-200">
            Pricing
          </Link>
          <Link href="/console" className="block hover:text-orange-200">
            Console
          </Link>
          <Link href="#faq" className="block hover:text-orange-200">
            FAQ
          </Link>
          <button className="w-full bg-white text-[#ff751f] font-semibold px-5 py-2 rounded-full hover:bg-orange-100 transition">
            <Link href="/login">
              Login
            </Link>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
