import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4 sm:mb-6 shadow-lg shadow-emerald-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PIXEL<span className="text-emerald-400">DETECT</span>
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base">AI-powered image forensics & manipulation detection</p>
          </div>

          {/* Auth Card */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex mb-6 sm:mb-8 bg-zinc-800/50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setFlow("signIn")}
                className={`flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  flow === "signIn"
                    ? "bg-emerald-500 text-zinc-950"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setFlow("signUp")}
                className={`flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  flow === "signUp"
                    ? "bg-emerald-500 text-zinc-950"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-semibold rounded-lg hover:from-emerald-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  flow === "signIn" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-6 border-t border-zinc-800/50">
              <button
                type="button"
                onClick={() => signIn("anonymous")}
                className="w-full py-2.5 sm:py-3 border border-zinc-700/50 text-zinc-400 font-medium rounded-lg hover:bg-zinc-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50 transition-all text-sm"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-zinc-600 text-xs">
          Requested by <span className="text-zinc-500">@stringer_kade</span> · Built by <span className="text-zinc-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
