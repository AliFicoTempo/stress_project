// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/api";
import Head from "next/head";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const WA_LINK = "https://wa.me/6281318138660";

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!username || !password) return setErr("Isi username & password");
    const res = await login(username.trim(), password);
    if (res.ok) {
      localStorage.setItem("sp_user", JSON.stringify(res));
      router.push("/dashboard");
    } else {
      setErr(res.message || "Login gagal");
    }
  }

  return (
    <>
      <Head>
        <title>Login | STRESS Project</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black animate-gradient">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <h1
            className="text-3xl font-bold mb-6 text-center text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Stress Project — Login
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Username</label>
              <input
                className="mt-1 w-full bg-white/20 text-white border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full bg-white/20 text-white border border-white/30 pl-3 pr-10 py-2 rounded focus:outline-none focus:border-cyan-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-cyan-400"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      <path d="M2 10s3.939 4 8 4 8-4 8-4-3.939-4-8-4-8 4-8 4zm10.894 2.106A4.003 4.003 0 0110 14a4 4 0 01-4-4 3.997 3.997 0 01.894-2.106A2.001 2.001 0 0110 8a2 2 0 012 2 2.001 2.001 0 01-.894 1.894z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {err && <div className="text-sm text-red-400">{err}</div>}

            <button
              className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Login
            </button>

            <div className="text-xs text-center mt-4 text-gray-300 space-x-3">
              <a href={`${WA_LINK}?text=...`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 underline">Register</a>
              <span>|</span>
              <a href={`${WA_LINK}?text=...`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 underline">Lupa Password</a>
            </div>
          </form>
        </div>

        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
        `}</style>
      </div>
    </>
  );
}