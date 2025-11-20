import React, { useState } from "react";
import { LogOut } from "lucide-react";

export default function App() {
  const [showAuth] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            FamilyShare
          </h1>
          <div className="flex gap-6">
            <button className="text-blue-600 font-bold text-lg hover:underline">Log In</button>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition">
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-24 pb-20">
        <section className="text-center px-6">
          <h2 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-6">
            Safety Through Trust and Consent
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-12">
            FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-16 py-6 rounded-2xl text-3xl font-bold shadow-2xl hover:shadow-3xl transition">
            Create Your Family Circle
          </button>
        </section>

        <section className="mt-32 px-6">
          <h3 className="text-5xl font-bold text-center text-gray-800 mb-20">
            Ethical Features Designed for Your Peace of Mind
          </h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {["Consent-Based Sharing", "Polite Check-In Requests", "Public Safety Alerts", "Supervised Accounts"].map((title) => (
              <div key={title} className="bg-white p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition text-center">
                <h4 className="text-3xl font-bold text-blue-600 mb-6">{title}</h4>
                <p className="text-xl text-gray-700">Full control, explicit consent, and transparency at every step.</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center mt-32 text-gray-600 text-lg">
          © 2025 FamilyShare. All Rights Reserved. Your privacy is our priority.
        </footer>
      </main>
    </>
  );
}
