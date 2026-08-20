'use client';
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Headphones, ArrowRight, Plus, Star } from 'lucide-react';

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Simply browse experts or categories, select the expert that fits your needs, choose a convenient time, and confirm your booking. You'll receive a confirmation with all the details."
  },
  {
    question: "Are the experts verified?",
    answer: "Yes, every expert on our platform goes through a rigorous verification process to ensure their credentials and experience meet our high standards."
  },
  {
    question: "What types of consultations are available?",
    answer: "We offer video calls, voice calls, and text-based consultations depending on the expert and your preference."
  },
  {
    question: "How much does a consultation cost?",
    answer: "Costs vary depending on the expert's rates and the duration of the session. You can view all pricing transparently on their profile."
  },
  {
    question: "Can I cancel or reschedule my session?",
    answer: "Yes, you can reschedule or cancel up to 24 hours before your session without any penalty."
  },
  {
    question: "Is my personal information secure?",
    answer: "Absolutely. We use bank-level encryption to ensure that your data and communications are completely secure and private."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our 24/7 support team through the 'Contact Support' button on this page, or email us at support@fixpair.com."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="relative w-full bg-white py-24 z-10 overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold tracking-wider uppercase mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQS
          </div>
          <h2 className="text-4xl lg:text-[2.75rem] font-bold text-[#0B1B3D] tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] text-slate-500 font-medium">
            Find answers to common questions about our platform and services.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          {/* Left Column: Contact Card */}
          <div className="w-full lg:w-[360px] bg-[#F4F8FF] rounded-3xl p-8 lg:p-10 border border-blue-100 flex flex-col items-center text-center shrink-0">
            {/* 3D Illustration */}
            <div className="w-full aspect-square bg-transparent rounded-2xl mb-8 relative flex items-center justify-center overflow-visible">
               <img src="/faq-image.png" alt="FAQ" className="w-full h-full object-contain relative z-10" />
               
               {/* Decorative Background Icons */}
               <Plus className="absolute top-4 left-8 w-6 h-6 text-blue-600/25" strokeWidth={4} />
               <Star className="absolute top-12 right-6 w-5 h-5 text-blue-600/20 fill-blue-600/20" strokeWidth={2} />
               <div className="absolute bottom-14 left-4 w-4 h-4 rounded-full bg-blue-600/20" />
               <Plus className="absolute bottom-8 right-8 w-5 h-5 text-blue-600/25" strokeWidth={4} />
               <Star className="absolute top-1/2 left-2 w-4 h-4 text-blue-600/20 fill-blue-600/20" strokeWidth={2} />
               <div className="absolute top-8 right-2 w-2 h-2 rounded-full bg-blue-600/20" />
               <Plus className="absolute bottom-1/2 right-0 w-3 h-3 text-blue-600/20" strokeWidth={4} />
            </div>
            
            <h3 className="text-[20px] font-bold text-slate-900 mb-3">Still have questions?</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8 px-2">
              Our support team is here to help you 24/7. Get in touch anytime.
            </p>
            
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-[14px] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6 shadow-sm shadow-blue-600/20">
              <Headphones className="w-4 h-4" />
              Contact Support
            </button>
            
            <button className="text-blue-700 hover:text-blue-800 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors group">
              Visit Help Center
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Accordion */}
          <div className="flex-1 w-full flex flex-col gap-3 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index}
                  className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen 
                      ? 'bg-white border-blue-100 shadow-[0_4px_20px_-10px_rgba(37,99,235,0.1)]' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  {/* Header Row */}
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-blue-100 text-blue-700' : 'bg-blue-50/50 text-blue-500'
                    }`}>
                      <span className="text-[13px] font-black leading-none pb-[1px]">?</span>
                    </div>
                    <h4 className={`text-[15px] font-bold flex-1 transition-colors ${
                      isOpen ? 'text-blue-700' : 'text-slate-900'
                    }`}>
                      {faq.question}
                    </h4>
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-blue-700" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  {/* Content (Expanded) */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[200px] opacity-100 pb-5 px-5' : 'max-h-0 opacity-0 overflow-hidden px-5'
                    }`}
                  >
                    <div className="bg-[#F8FAFC] rounded-xl p-5 ml-10">
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
