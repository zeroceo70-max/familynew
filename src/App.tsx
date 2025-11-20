import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, Shield, Bell, MapPin, Users } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email for confirmation!");
    }
    setShowAuth(false);
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            FamilyShare
          </h1>
          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-lg font-semibold">Welcome back!</span>
              <button onClick={signOut} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <LogOut size={22} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-6">
              <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="text-blue-600 font-bold text-xl hover:underline">
                Log In
              </button>
              <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition">
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logged-out Landing Page */}
      {!user ? (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-32 pb-24 px-6">
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8 leading-tight">
              Safety Through Trust and Consent
            </h2>
            <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
              FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-20 py-7 rounded-3xl text-4xl font-bold shadow-3xl hover:shadow-4xl transform hover:scale-105 transition duration-300"
            >
              Create Your Family Circle
            </button>
          </div>

          <section className="mt-32 max-w-7xl mx-auto">
            <h3 className="text-5xl font-bold text-center text-gray-800 mb-20">
              Ethical Features Designed for Your Peace of Mind
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { title: "Consent-Based Sharing", desc: "Full control, explicit consent, and transparency at every step.", icon: Shield },
                { title: "Polite Check-In Requests", desc: "Ask once or for a short time — they must approve.", icon: Bell },
                { title: "Public Safety Alerts", desc: "Help your community stay safe together.", icon: MapPin },
                { title: "Supervised Accounts", desc: "For minors with parental controls and child awareness.", icon: Users },
              ].map((feature) => (
                <div key={feature.title} className="bg-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover-lift transition text-center">
                  <feature.icon size={64} className="mx-auto mb-6 text-blue-600" />
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h4>
                  <p className="text-lg text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="text-center mt-32 text-gray-600 text-lg">
            © 2025 FamilyShare. All Rights Reserved. Your privacy is our priority.
          </footer>
        </main>
      ) : (
        <div className="pt-40 text-center">
          <h2 className="text-6xl font-bold text-green-600">Welcome to your Family Circle!</h2>
          <p className="text-3xl mt-8">Real-time map + all features coming in the next commit</p>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full shadow-3xl">
            <h2 className="text-4xl font-bold text-center mb-10">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <form onSubmit={handleAuth} className="space-y-8">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-blue-500 outline-none transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-blue-500 outline-none transition"
              />
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 rounded-2xl font-bold text-2xl hover:shadow-2xl transition">
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
            <button onClick={() => setShowAuth(false)} className="mt-6 text-gray-600 w-full text-center font-medium text-lg">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
