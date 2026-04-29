import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";
import { isAuthenticated, setAuthSession } from "../lib/auth";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);
      setAuthSession(unwrapApiResponse(response));
      navigate("/dashboard");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to log in right now"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-brand-100/50 blur-3xl lg:block" />
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-700">
            Office Product Management
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
            Secure asset operations for modern office teams.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            A polished admin workspace to monitor employees, manage inventory, assign devices,
            and process returns without losing operational visibility.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "248", label: "Employees" },
              { value: "1,426", label: "Products" },
              { value: "98%", label: "Traceability" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                <p className="text-2xl font-semibold text-ink-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-8 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="inline-flex rounded-2xl bg-brand-100 p-4 text-brand-700">
              <ShieldCheck size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-ink-900">Admin Login</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to access product inventory, staff records, assignments, and return
              tracking from a single dashboard.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  placeholder="admin@officehub.com"
                  className="field"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="field"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </div>

              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  <LockKeyhole size={18} className="mr-2" />
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <button type="button" className="btn-secondary flex-1">
                  Contact IT Support
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-ink-900">Security status</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Session monitoring, role-based access, and auditable assignment workflows are
                built into this admin experience.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLoginPage;
