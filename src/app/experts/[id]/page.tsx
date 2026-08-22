"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Star, ShieldCheck, MapPin, Clock, CheckCircle2, 
  Award, GraduationCap, Sparkles, QrCode, Smartphone
} from 'lucide-react';
import Footer from '@/components/landing-page/Footer';

// Full detailed expert dataset mapped by ID
const EXPERTS_DATA: Record<string, {
  id: number;
  name: string;
  role: string;
  category: string;
  categoryBg: string;
  rating: number;
  reviewsCount: number;
  experience: string;
  image: string;
  location: string;
  responseTime: string;
  pricePerSession: string;
  duration: string;
  bio: string;
  tags: string[];
  languages: string[];
  education: string[];
  certifications: string[];
  services: { title: string; price: string; duration: string; description: string }[];
  clientReviews: { name: string; date: string; rating: number; comment: string; avatar: string; role: string }[];
}> = {
  "1": {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Legal Consultant",
    category: "Legal Advice",
    categoryBg: "bg-purple-50 text-purple-700 border-purple-200",
    rating: 4.9,
    reviewsCount: 128,
    experience: "8+ years exp.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    location: "Berlin, Germany",
    responseTime: "< 15 mins",
    pricePerSession: "$120",
    duration: "45 min session",
    bio: "Sarah Johnson is a seasoned corporate and commercial legal consultant with over 8 years of experience advising tech startups, SMEs, and international enterprises. Specializing in contract negotiation, cross-border corporate law, and commercial dispute resolution, she brings actionable, straightforward legal guidance to help business leaders make confident decisions.",
    tags: ["Contracts", "Disputes", "Corporate Law", "IP Rights", "M&A Strategy"],
    languages: ["English (Native)", "German (Fluent)", "French (Intermediate)"],
    education: ["J.D. from Harvard Law School (Cum Laude)", "LL.M. in International Business Law - Humboldt Univ."],
    certifications: ["Certified Commercial Mediator (ICM)", "German Federal Bar Admission"],
    services: [
      { title: "1-on-1 Legal Review & Consultation", price: "$120", duration: "45 mins", description: "Comprehensive analysis of business contracts, employment agreements, or NDA terms." },
      { title: "Startup Corporate Strategy", price: "$180", duration: "60 mins", description: "Guidance on incorporation, shareholder agreements, equity split, and fundraising legalities." },
      { title: "Dispute Mediation & Resolution", price: "$220", duration: "60 mins", description: "Strategic advice and pre-litigation negotiation tactics for commercial conflicts." }
    ],
    clientReviews: [
      { name: "Michael T.", role: "Business Owner", date: "2 days ago", rating: 5, comment: "Sarah provided incredibly practical legal advice on our SaaS vendor contract. Saved us thousands in potential liability clauses!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
      { name: "Anna K.", role: "Founder @ FinTech", date: "1 week ago", rating: 5, comment: "Very thorough, punctual, and crystal clear. Answered all my complex corporate law questions effortlessly.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
      { name: "David R.", role: "E-commerce Director", date: "3 weeks ago", rating: 5, comment: "Highly recommend Sarah for any startup looking for reliable, fast, and structured legal consultation.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
    ]
  },
  "2": {
    id: 2,
    name: "Michael Chen",
    role: "Business Strategist",
    category: "Business Consulting",
    categoryBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rating: 4.8,
    reviewsCount: 96,
    experience: "10+ years exp.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    location: "Munich, Germany",
    responseTime: "< 30 mins",
    pricePerSession: "$140",
    duration: "45 min session",
    bio: "Michael Chen is a strategic business consultant who has advised over 150+ high-growth tech companies and retail brands. With a background at top-tier management consulting firms, he specializes in operational efficiency, revenue scaling, market expansion, and business model optimization.",
    tags: ["Strategy", "Operations", "Growth", "Scaling", "Fundraising"],
    languages: ["English (Fluent)", "German (Native)", "Mandarin (Native)"],
    education: ["M.B.A. from INSEAD", "B.S. in Industrial Engineering - TU Munich"],
    certifications: ["Certified Management Consultant (CMC)", "Lean Six Sigma Master Black Belt"],
    services: [
      { title: "Growth & Scaling Roadmap", price: "$140", duration: "45 mins", description: "Actionable plan to scale customer acquisition, retention, and monthly recurring revenue." },
      { title: "Operations Efficiency Audit", price: "$190", duration: "60 mins", description: "Streamline team workflows, reduce operational overhead, and improve margins." }
    ],
    clientReviews: [
      { name: "Robert B.", role: "Managing Director", date: "4 days ago", rating: 5, comment: "Michael helped us completely restructure our sales funnel. Conversions went up by 35% in just 1 month!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
    ]
  },
  "3": {
    id: 3,
    name: "Emily Davis",
    role: "Relationship Coach",
    category: "Relationship Advice",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-200",
    rating: 4.9,
    reviewsCount: 112,
    experience: "6+ years exp.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    location: "Frankfurt, Germany",
    responseTime: "< 10 mins",
    pricePerSession: "$95",
    duration: "45 min session",
    bio: "Emily Davis is a compassionate certified relationship and interpersonal communication coach. She helps couples and individuals rebuild trust, resolve deep-seated conflict, improve emotional intimacy, and establish healthy communication habits.",
    tags: ["Communication", "Marriage", "Counseling", "Conflict Resolution", "Empathy"],
    languages: ["English (Native)", "German (Conversational)"],
    education: ["M.A. in Clinical Psychology", "B.A. in Behavioral Science"],
    certifications: ["ICF Professional Certified Coach (PCC)", "Gottman Couples Method Trained"],
    services: [
      { title: "1-on-1 Relationship Coaching", price: "$95", duration: "45 mins", description: "Personalized coaching session focusing on self-awareness, emotional clarity, and relationship goals." },
      { title: "Couples Communication Session", price: "$150", duration: "60 mins", description: "Guided joint session to break negative communication loops and restore trust." }
    ],
    clientReviews: [
      { name: "Sophie M.", role: "Client", date: "1 week ago", rating: 5, comment: "Emily is so empathetic and insightful. She gave us practical exercises that transformed our conversations.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" }
    ]
  },
  "4": {
    id: 4,
    name: "David Wilson",
    role: "Career Coach",
    category: "Career Coaching",
    categoryBg: "bg-blue-50 text-blue-700 border-blue-200",
    rating: 4.8,
    reviewsCount: 76,
    experience: "7+ years exp.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    location: "Hamburg, Germany",
    responseTime: "< 20 mins",
    pricePerSession: "$110",
    duration: "45 min session",
    bio: "David Wilson is a senior executive career coach and former Talent Acquisition Director for European Fortune 500 tech companies. He empowers ambitious professionals to land dream roles, negotiate top tier salaries, and accelerate executive promotion paths.",
    tags: ["Career Growth", "Resume", "Interview Prep", "Salary Negotiation", "Executive Transition"],
    languages: ["English (Native)", "German (Fluent)"],
    education: ["B.S. in Organizational Psychology - Univ. of Hamburg"],
    certifications: ["Certified Professional Career Coach (CPCC)", "SHRM-SCP Senior Certified Professional"],
    services: [
      { title: "Resume & LinkedIn Overhaul", price: "$110", duration: "45 mins", description: "Transform your CV and LinkedIn profile into an executive candidate magnet." },
      { title: "Mock Technical / Managerial Interview", price: "$160", duration: "60 mins", description: "Simulated high-stakes interview with structured feedback and positioning tips." }
    ],
    clientReviews: [
      { name: "James K.", role: "Tech Lead", date: "5 days ago", rating: 5, comment: "David helped me negotiate a +25% salary bump and relocation package. Outstanding guidance!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
    ]
  },
  "5": {
    id: 5,
    name: "Dr. Marcus Vance",
    role: "Financial Advisor",
    category: "Finance & Wealth",
    categoryBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rating: 5.0,
    reviewsCount: 142,
    experience: "12+ years exp.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    location: "Cologne, Germany",
    responseTime: "< 15 mins",
    pricePerSession: "$160",
    duration: "45 min session",
    bio: "Dr. Marcus Vance is an independent financial planner and wealth manager. He assists high-net-worth individuals, tech founders, and expatriates with tax optimization, investment portfolio allocation, pension planning, and financial freedom roadmaps.",
    tags: ["Tax Planning", "Investments", "Wealth", "Retirement", "Estate Strategy"],
    languages: ["English (Native)", "German (Fluent)"],
    education: ["Ph.D. in Economics - Mannheim University", "M.S. in Quantitative Finance"],
    certifications: ["Certified Financial Planner (CFP®)", "Chartered Financial Analyst (CFA®)"],
    services: [
      { title: "Personal Wealth & Tax Strategy", price: "$160", duration: "45 mins", description: "Comprehensive audit of your savings, investment allocations, and German tax efficiency." },
      { title: "Retirement & Passive Income Plan", price: "$210", duration: "60 mins", description: "Long term investment roadmap tailored to early financial independence." }
    ],
    clientReviews: [
      { name: "Felix S.", role: "Expat Engineer", date: "1 week ago", rating: 5, comment: "Dr. Marcus is brilliant! He simplified complex expat tax and investment strategy in just 45 minutes.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
    ]
  },
  "6": {
    id: 6,
    name: "Sophia Martinez",
    role: "Leadership Coach",
    category: "Business Consulting",
    categoryBg: "bg-purple-50 text-purple-700 border-purple-200",
    rating: 4.9,
    reviewsCount: 89,
    experience: "9+ years exp.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    location: "Stuttgart, Germany",
    responseTime: "< 25 mins",
    pricePerSession: "$130",
    duration: "45 min session",
    bio: "Sophia Martinez is an executive leadership coach specializing in emotional intelligence, conflict management, executive presence, and cross-cultural team management for VPs, Directors, and Tech Founders.",
    tags: ["Leadership", "Management", "Negotiation", "Executive Presence"],
    languages: ["English (Fluent)", "Spanish (Native)", "German (Fluent)"],
    education: ["M.S. in Executive Leadership - ESMT Berlin"],
    certifications: ["Certified Executive Coach (CEC)", "Hogan Assessment Certified Practitioner"],
    services: [
      { title: "Executive Leadership Coaching", price: "$130", duration: "45 mins", description: "Intensive 1-on-1 session on team motivation, delegation, and strategic decision making." }
    ],
    clientReviews: [
      { name: "Elena V.", role: "VP of Engineering", date: "2 weeks ago", rating: 5, comment: "Sophia transformed how I manage my engineering leads. Best investment I made this year!", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" }
    ]
  }
};

export default function ExpertDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const expertId = unwrappedParams.id;
  
  // Fallback to Expert #1 if ID is invalid or out of range
  const expert = EXPERTS_DATA[expertId] || EXPERTS_DATA["1"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Landing Page</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              href="/#mobile-app"
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Get App to Book
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        
        {/* Hero Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8 relative overflow-hidden">
          
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            
            {/* Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Profile Avatar Frame */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-lg">
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center text-white" title="Active on Fixpair App">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              {/* Info Column */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${expert.categoryBg}`}>
                    {expert.category}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Verified Expert
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
                  {expert.name}
                </h1>
                
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  {expert.role}
                </p>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{expert.rating}</span>
                    <span className="text-slate-400 font-normal">({expert.reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{expert.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{expert.experience}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{expert.responseTime}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Rate Tag */}
            <div className="flex flex-col text-left lg:text-right shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
              <span className="text-xs text-slate-500 font-medium mb-0.5">Consultation Rate</span>
              <span className="text-3xl font-extrabold text-slate-900">{expert.pricePerSession} <span className="text-xs font-normal text-slate-500">/ {expert.duration}</span></span>
              <span className="text-[11px] font-semibold text-blue-600 mt-1">Bookings managed via Mobile App</span>
            </div>

          </div>
        </div>

        {/* Grid Layout: Left Content (8 cols) & Right Mobile App CTA Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Bio, Services Overview, Credentials, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                About {expert.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                {expert.bio}
              </p>

              {/* Expertise Tags */}
              <div className="border-t border-slate-100 pt-5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">Areas of Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {expert.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Overview Card (Informational Only - No Booking Forms) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Consultation Services Provided</h2>
                  <p className="text-xs text-slate-500 font-medium">Offered for 1-on-1 sessions on the Fixpair Mobile App</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {expert.services.length} Services
                </span>
              </div>

              <div className="space-y-4">
                {expert.services.map((srv, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{srv.title}</h3>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">{srv.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-lg font-extrabold text-slate-900">{srv.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Credentials */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Education */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Education &amp; Degrees
                </h3>
                <div className="space-y-3">
                  {expert.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Certifications &amp; Licenses
                </h3>
                <div className="space-y-3">
                  {expert.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-100">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900">Client Reviews</h2>
                    <span className="text-xs text-slate-500 font-medium">{expert.rating} out of 5.0 ({expert.reviewsCount} verified consultations)</span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Reviews
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {expert.clientReviews.map((rev, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{rev.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{rev.role}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Mobile App Download CTA Card */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            
            {/* App Booking Card */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden border border-slate-800">
              
              {/* Soft Ambient Light inside Card */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                  <Smartphone className="w-3.5 h-3.5" />
                  BOOK VIA APP ONLY
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white leading-tight mb-2">
                Book a Session with {expert.name.split(' ')[0]}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                To schedule a 1-on-1 HD video consultation, send live messages, and receive post-session reports, download the <strong className="text-white font-bold">Fixpair Mobile App</strong>.
              </p>

              {/* QR Code Scanner Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <QrCode className="w-full h-full text-slate-900" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white mb-0.5">Scan to Download App</span>
                  <span className="text-[11px] text-slate-300 leading-tight">Use phone camera to open Fixpair in App Store or Play Store</span>
                </div>
              </div>

              {/* Official App Store & Google Play Badges */}
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="w-full bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-3.5 shadow-md transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white shrink-0">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider mb-0.5">Download on the</span>
                    <span className="text-sm font-bold text-white tracking-tight">App Store</span>
                  </div>
                </a>

                <a
                  href="#"
                  className="w-full bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-3.5 shadow-md transition-all cursor-pointer"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512">
                    <path fill="#00C4FF" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
                    <path fill="#00E676" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                    <path fill="#FF3D00" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
                    <path fill="#FFC107" d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider mb-0.5">GET IT ON</span>
                    <span className="text-sm font-bold text-white tracking-tight">Google Play</span>
                  </div>
                </a>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-2 text-[11px] font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Instant 1-on-1 video room creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>End-to-end encrypted messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Secure &amp; Money-Back Guarantee</span>
                </div>
              </div>

            </div>

            {/* Quick Details Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expert Overview</h3>
              
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Languages</span>
                <span className="font-bold text-slate-900">{expert.languages.join(", ")}</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-bold text-slate-900">{expert.location}</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500 font-medium">Avg Response</span>
                <span className="font-bold text-emerald-600">{expert.responseTime}</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

// Icon helper
function Zap(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
