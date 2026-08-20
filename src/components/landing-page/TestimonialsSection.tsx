"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    text: "I needed legal guidance for my business and found an expert who made the whole process smooth and stress-free.",
    name: "Michael T.", role: "Business Owner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "The consultant helped me clarify my career path and build a plan that actually works. Highly recommended!",
    name: "Sarah L.", role: "Marketing Manager", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Quick booking, great communication, and very helpful advice. Will definitely use Fixpair again.",
    name: "David R.", role: "Startup Founder", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Very professional service. The experts are highly vetted and I got my problems solved efficiently.",
    name: "Emma W.", role: "Freelance Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Outstanding experience! The platform is intuitive and finding the right professional was a breeze.",
    name: "James K.", role: "Tech Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  }
];

const INFINITE_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsSection() {
  const [testIdx, setTestIdx] = useState(0);
  const testSliderRef = useRef<HTMLDivElement>(null);
  const [isTestDragging, setIsTestDragging] = useState(false);
  const [testStartX, setTestStartX] = useState(0);
  const [testScrollLeft, setTestScrollLeft] = useState(0);

  // Initialize scroll position in the middle set for infinite looping
  useEffect(() => {
    if (testSliderRef.current) {
      testSliderRef.current.scrollLeft = TESTIMONIALS.length * 344;
    }
  }, []);

  const handleTestScroll = () => {
    if (!testSliderRef.current) return;
    const scrollLeft = testSliderRef.current.scrollLeft;
    const singleSetWidth = TESTIMONIALS.length * 344;

    // Seamless infinite reset when reaching start or end set
    if (scrollLeft >= singleSetWidth * 2) {
      testSliderRef.current.scrollLeft = scrollLeft - singleSetWidth;
    } else if (scrollLeft <= 10) {
      testSliderRef.current.scrollLeft = scrollLeft + singleSetWidth;
    }

    const calculatedIndex = Math.round((testSliderRef.current.scrollLeft % singleSetWidth) / 344);
    const clampedIndex = (calculatedIndex + TESTIMONIALS.length) % TESTIMONIALS.length;
    setTestIdx(clampedIndex);
  };

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (!testSliderRef.current) return;
    const cardWidth = 344;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    testSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleTestMouseDown = (e: React.MouseEvent) => {
    setIsTestDragging(true);
    if (!testSliderRef.current) return;
    setTestStartX(e.pageX - testSliderRef.current.offsetLeft);
    setTestScrollLeft(testSliderRef.current.scrollLeft);
  };

  const handleTestMouseLeave = () => {
    setIsTestDragging(false);
  };

  const handleTestMouseUp = () => {
    setIsTestDragging(false);
  };

  const handleTestMouseMove = (e: React.MouseEvent) => {
    if (!isTestDragging || !testSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - testSliderRef.current.offsetLeft;
    const walk = (x - testStartX) * 1.5;
    testSliderRef.current.scrollLeft = testScrollLeft - walk;
  };

  return (
    <section className="container mx-auto px-6 sm:px-8 lg:px-12 py-10 relative z-10">
      <div className="bg-gradient-to-br from-[#F6F8FF] via-[#F8FAFF] to-[#FAF8FF] rounded-[2.5rem] p-8 sm:p-10 lg:p-12 relative shadow-sm border border-indigo-100/80">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Info Column */}
          <div className="lg:w-[32%] flex flex-col items-start shrink-0">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase mb-5">
              What Our Clients Say
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
              Real people. <br />
              <span className="text-blue-600">Real results.</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-[320px] mb-6 font-medium">
              Thousands of clients have found the right advice and achieved their goals with the help of our experts.
            </p>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => scrollTestimonials('left')}
                aria-label="Previous Testimonials"
                className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button 
                onClick={() => scrollTestimonials('right')}
                aria-label="Next Testimonials"
                className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-slate-400 ml-2">
                {testIdx + 1} / {TESTIMONIALS.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 1" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 2" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 3" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 4" />
                </div>
              </div>
              
              <span className="inline-flex items-center justify-center bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                2.5K+
              </span>
              
              <span className="text-sm font-bold text-slate-900">
                Happy Clients
              </span>
            </div>
          </div>

          {/* Right Interactive Drag & Scroll Testimonial Cards Track */}
          <div className="lg:w-[68%] w-full overflow-hidden relative">
            <div 
              ref={testSliderRef}
              onScroll={handleTestScroll}
              onMouseDown={handleTestMouseDown}
              onMouseLeave={handleTestMouseLeave}
              onMouseUp={handleTestMouseUp}
              onMouseMove={handleTestMouseMove}
              className={`flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 select-none ${
                isTestDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {INFINITE_TESTIMONIALS.map((testimonial, idx) => (
                <div 
                  key={idx} 
                  className="w-[290px] sm:w-[320px] shrink-0 bg-white rounded-3xl p-7 border border-slate-100/90 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_35px_rgba(37,99,235,0.09)] hover:-translate-y-1 transition-all duration-300 pointer-events-none"
                >
                  <div>
                    <Quote className="w-8 h-8 text-blue-300 mb-3" />
                    <p className="text-[14.5px] text-slate-700 font-medium leading-relaxed mb-6 min-h-[75px]">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div className="flex items-center gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                      <img src={testimonial.avatar} className="w-full h-full object-cover" alt={testimonial.name} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-tight">{testimonial.name}</span>
                      <span className="text-xs text-slate-500 font-medium mt-0.5">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button 
              key={i}
              onClick={() => {
                setTestIdx(i);
                if (testSliderRef.current) {
                  testSliderRef.current.scrollTo({ left: (TESTIMONIALS.length + i) * 344, behavior: 'smooth' });
                }
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                testIdx === i 
                  ? 'w-6 h-2 bg-blue-600 shadow-sm' 
                  : 'w-2 h-2 bg-slate-300 hover:bg-blue-400'
              }`} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
