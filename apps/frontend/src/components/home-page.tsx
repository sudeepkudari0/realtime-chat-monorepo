import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
      <main className="max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-block">
          <MessageCircle size={48} className="text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Connect Instantly with
          <span className="text-blue-600"> Real-Time Chat</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Join conversations that matter. Our real-time chat platform lets you
          connect with others instantly in a secure and intuitive environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={"/login"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-lg flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Button
            variant="outline"
            className="border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-800 px-8 py-6 rounded-lg text-lg"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">10k+</h3>
            <p className="text-slate-600">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">1M+</h3>
            <p className="text-slate-600">Messages Sent</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-3xl font-bold text-slate-900">5k+</h3>
            <p className="text-slate-600">Chat Rooms</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
