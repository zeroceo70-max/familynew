import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

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
        await supabase.auth.signInWithPassword({ email, password });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
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

  const signOut = () => supabase.auth.signOut();

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 right-0 p-6 z-50">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-800">
              Welcome, {profile?.first_name || "User"}!
            </span>
            <button
              onClick={signOut}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-white font-medium hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => { setIsLogin(true); setShowAuth(true); }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setShowAuth(true); }}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </header>

      {/* Landing Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center px-6 pt-20 text-center">
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8">
          FamilyShare
        </h1>
        <p className="text-4xl font-bold text-gray-800 mb-12">
          Safety Through Trust and Consent
        </p>
        <p className="max-w-3xl text-xl text-gray-700 mb-12">
          FamilyShare is the privacy-first family safety app. Connect with your loved ones without compromising their privacy. No secret tracking, ever.
        </p>

        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-10 py-5 text-2xl font-bold text-white shadow-xl hover:shadow-2xl mb-16">
          Create Your Family Circle
        </button>

        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          Ethical Features Designed for Your Peace of Mind
        </h2>

        <div className="grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-10">
          {/* Repeat for each feature */}
          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Consent-Based Sharing</h3>
            <p className="text-gray-700">
              Create private Family Circles where every member must accept an invitation. You control who sees your location, and for how long.
            </p>
          </div>
          {/* ... other three features exactly as you wrote ... */}
        </div>

        <footer className="mt-20 text-gray-600">
          © 2025 FamilyShare. All Rights Reserved. Your privacy is our priority.
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuth && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <>
                  <input placeholder="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-5 py-3 border rounded-xl" />
                  <input placeholder="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-5 py-3 border rounded-xl" />
                  <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full px-5 py-3 border rounded-xl" />
                </>
              )}
              <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-3 border rounded-xl" />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-3 border rounded-xl" />
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-bold text-xl">
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
            <button onClick={() => setShowAuth(false)} className="mt-6 text-gray-600 w-full">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
