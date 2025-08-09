import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/api";
import Head from "next/head";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const WA_LINK = "https://wa.me/6281318138660"; // Ganti nomor WA sesuai di file docx Anda

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
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet" />
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
              <input
                type="password"
                className="mt-1 w-full bg-white/20 text-white border border-white/30 px-3 py-2 rounded focus:outline-none focus:border-cyan-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {err && <div className="text-sm text-red-400">{err}</div>}

            <button
              className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Login
            </button>

            <div className="text-xs text-center mt-4 text-gray-300 space-x-3">
              <a
                href={`${WA_LINK}?text=Kepada Paduka yang Mulia, ijinkan hamba untuk mencantumkan nama hamba yang rendah ini sebagai salah satu pengikutmu yang setia. Hamba bersumpah akan setia dan tetap menjunjung tinggi nilai integritas kepada Paduka.🙇‍♂️`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 underline"
              >
                Register
              </a>
              <span>|</span>
              <a
                href={`${WA_LINK}?text=Wahai Paduka Yang Mulia, ma'afkan hamba yang ceroboh lagi lalai ini. Hamba secara tidak sengaja telah lupa kata kunci, mohon dengan penuh kesopanan agar sudi kiranya Paduka memberi pencerahaan kepada hamba.🙇‍♂️`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 underline"
              >
                Lupa Password
              </a>
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
