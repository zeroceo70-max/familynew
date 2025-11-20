import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, Menu } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    // Cleanup subscription
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    setProfile(data);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (user) {
          await supabase.from("profiles").insert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
          });
        }
      }
      setShowAuth(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            FamilyShare
          </h1>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-medium">Welcome, {profile?.first_name || "User"}!</span>
                <button onClick={signOut} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="text-blue-600 font-semibold hover:underline">
                  Log In
                </button>
                <button onClick={() => { setIsLogin(false); setShowAuth(true); }} className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition">
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Landing */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center px-6 pt-24 text-center">
        <h2 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-6">
          Safety Through Trust and Consent
        </h2>
        <p className="text-2xl text-gray-700 max-w-4xl mb-12">
          FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition mb-20">
          Create Your Family Circle
        </button>

        <h3 className="text-5xl font-bold text-gray-800 mb-16">
          Ethical Features Designed for Your Peace of Mind
        </h3>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl">
          {[
            { title: "Consent-Based Sharing", color: "blue" },
            { title: "Polite Check-In Requests", color: "green" },
            { title: "Public Safety Alerts", color: "purple" },
            { title: "Supervised Accounts", color: "orange" }
          ].map((f) => (
            <div key={f.title} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h4 className={`text-3xl font-bold text-${f.color}-600 mb-4`}>{f.title}</h4>
              <p className="text-gray-700 text-lg">
                Full control, explicit consent, and transparency at every step.
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-24 text-gray-600 text-lg">
          © 2025 FamilyShare. All Rights Reserved. Your privacy is our priority.
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8">
              {isLogin ? "Welcome Back" : "Join FamilyShare"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <>
                  <input required placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg" />
                  <input required placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg" />
                  <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg" />
                </>
              )}
              <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg" />
              <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg" />
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 rounded-xl font-bold text-xl hover:shadow-xl transition">
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
            <button onClick={() => setShowAuth(false)} className="mt-6 text-gray-600 w-full text-center">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
