// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { login } from "../lib/api";

// UI Components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();

  // WhatsApp link & messages
  const WA_LINK = "https://wa.me/6281318138660";
  const WA_LUPA = encodeURIComponent("Wahai Yang Mulia, hamba yang ceroboh ini lupa password. Mohon sudi kiranya Yang Mulia membantu hamba.🙇🏻‍♂️");
  const WA_REGISTER = encodeURIComponent("Wahai Yang Mulia, ijinkan hamba yang berada dalam kekurangan ini menjadi abdimu yang setia.🙇🏻‍♂️");

  // Handle login form submit
  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!username || !password) {
      return setErr("Please fill all fields");
    }

    setOpenModal(true);

    const res = await login(username.trim(), password);

    if (res.ok) {
      localStorage.setItem("sp_user", JSON.stringify(res));
      router.push("/dashboard");
    } else {
      setErr(res.message || "Login gagal");
      setOpenModal(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login | STRESS Project</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md px-4">
          <Card className="p-8 shadow-xl rounded-2xl border border-gray-100 bg-white">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Sign In To Continue</p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username anda"
                  className="w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent 
                             focus:outline-none focus:border-blue-500 transition-colors text-gray-800"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href={`${WA_LINK}?text=${WA_LUPA}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-4 py-3 border-0 border-b-2 border-gray-300 bg-transparent 
                               focus:outline-none focus:border-blue-500 transition-colors text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 
                               hover:text-blue-500 text-sm font-medium"
                  >
                    {showPassword ? "🐵" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {err && <div className="text-sm text-red-500 py-2">{err}</div>}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 
                           hover:from-blue-700 hover:to-indigo-800 text-white font-medium 
                           rounded-lg transition-all transform hover:scale-[1.02]"
              >
                Login
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Driver Baru?{" "}
                <a
                  href={`${WA_LINK}?text=${WA_REGISTER}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Daftar
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Smooth Animation */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Proses Autentikasi"
        showFooter={false}
      >
        <p className="text-sm text-slate-600">
          Sedang autentikasi data. Mohon ditunggu...
        </p>
      </Modal>
    </>
  );
}
