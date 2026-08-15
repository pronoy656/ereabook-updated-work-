"use client";

import React, { useState, useRef } from "react";
import { Camera, Mail, Briefcase, CheckCircle2, Globe, Hash, Clock, Award, User, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function ConsultantSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isForced = searchParams.get('forced') === 'true';
  
  const [formData, setFormData] = useState({
    name: "Expert Consultant",
    email: "consultant_1785120108085@test.com",
    image: "https://i.ibb.co/z5YHLV9/profile.png",
    consultancyType: "",
    experience: "",
    languages: "",
    expertise: "",
    bio: "",
    perMinuteRate: "",
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://i.ibb.co/z5YHLV9/profile.png";
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
    
    // Extract base URL (e.g. http://10.10.7.106:5000 from the api/v1 route)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
      : 'http://10.10.7.106:5000';
      
    return `${baseUrl}${imagePath}`;
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          image: getImageUrl(data.image),
          consultancyType: data.consultancyType || "",
          experience: data.experience || "",
          languages: data.languages?.join(', ') || "",
          expertise: data.expertise?.join(', ') || "",
          bio: data.bio || "",
          perMinuteRate: data.perMinuteRate || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast.error("Please fill out all required fields (Name, Email)");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {};

      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;
      if (formData.experience) payload.experience = String(formData.experience);
      if (formData.bio) payload.bio = formData.bio;

      if (formData.languages) {
        const langs = formData.languages.split(',').map(s => s.trim()).filter(Boolean);
        if (langs.length > 0) payload.languages = langs;
      }
      
      if (formData.expertise) {
        const exp = formData.expertise.split(',').map(s => s.trim()).filter(Boolean);
        if (exp.length > 0) payload.expertise = exp;
      }

      const formDataObj = new FormData();
      formDataObj.append('data', JSON.stringify(payload));
      if (selectedFile) {
        formDataObj.append('image', selectedFile); // Assuming 'image' is the field name backend expects
      }

      const response = await api.patch('/user/profile', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setIsSaved(true);
        toast.success(response.data.message || "Profile updated successfully!");
        
        // Refetch profile to ensure state reflects exact backend values
        await fetchProfile();
        
        if (isForced) {
          router.push('/consultant/overview');
        } else {
          setTimeout(() => setIsSaved(false), 3000);
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-transparent -z-10 rounded-3xl blur-3xl opacity-50 pointer-events-none" />
      
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Settings</h1>
        <p className="text-slate-500 font-medium text-[15px]">Manage your professional profile, expertise, and account preferences.</p>
      </div>

      <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-100/50 p-8 bg-white/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Profile Information</CardTitle>
              <CardDescription className="text-[14px] mt-1 font-medium">Update your photo and personal details to stand out.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-10">
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group cursor-pointer" onClick={triggerFileUpload}>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <Avatar className="relative h-28 w-28 border-4 border-white shadow-xl">
                <AvatarImage src={formData.image} alt="Profile" className="object-cover" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-bold">EC</AvatarFallback>
              </Avatar>
              <div className="absolute inset-1 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                <Camera className="text-white h-8 w-8" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm" onClick={triggerFileUpload}>
                <Camera className="w-4 h-4 mr-2" /> Change Photo
              </Button>
              <p className="text-xs font-medium text-slate-400">JPG, GIF or PNG. Max size of 2MB</p>
            </div>
          </div>

          <Separator className="bg-slate-100/60" />

          {/* Form Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name <span className="text-rose-500">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm" 
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address <span className="text-rose-500">*</span></Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label htmlFor="experience" className="text-sm font-bold text-slate-700 ml-1">Experience (Years)</Label>
                <div className="relative group">
                  <Award className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="experience" 
                    type="text" 
                    value={formData.experience} 
                    onChange={handleInputChange} 
                    placeholder="Enter your experience (e.g. 5 Years)" 
                    className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="languages" className="text-sm font-bold text-slate-700 ml-1">Languages (comma separated)</Label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="languages" 
                    value={formData.languages} 
                    onChange={handleInputChange} 
                    placeholder="Enter your expertise language area" 
                    className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="expertise" className="text-sm font-bold text-slate-700 ml-1">Expertise (comma separated)</Label>
              <div className="relative group">
                <Layers className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  id="expertise" 
                  value={formData.expertise} 
                  onChange={handleInputChange} 
                  placeholder="Enter your expertise" 
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm" 
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="bio" className="text-sm font-bold text-slate-700 ml-1">Bio</Label>
              <Textarea 
                id="bio" 
                value={formData.bio} 
                onChange={handleInputChange} 
                placeholder="Enter a short professional bio..." 
                rows={4}
                className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm resize-none p-4" 
              />
            </div>
          </div>

          <Separator className="bg-slate-100/60" />

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex-1">
              {isSaved && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold animate-in fade-in slide-in-from-left-4 duration-300 w-fit">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" className="px-6 h-12 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold transition-all" onClick={() => fetchProfile()}>
                Cancel
              </Button>
              <Button 
                className="px-8 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

