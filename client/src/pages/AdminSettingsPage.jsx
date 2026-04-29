import { KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import SectionCard from "../components/SectionCard";
import api, { getApiErrorMessage, unwrapApiResponse } from "../lib/api";
import { getAuthToken, getAuthUser, setAuthSession } from "../lib/auth";

function AdminSettingsPage() {
  const [profile, setProfile] = useState(getAuthUser());
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/auth/me");
        const adminProfile = unwrapApiResponse(response);
        setProfile(adminProfile);
        setProfileForm({
          name: adminProfile.name || "",
          email: adminProfile.email || "",
        });

        const existingSession = getAuthUser();
        if (existingSession) {
          setAuthSession({
            token: getAuthToken(),
            userId: adminProfile.userId,
            name: adminProfile.name,
            email: adminProfile.email,
            role: adminProfile.role,
          });
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load admin profile"));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.put("/auth/me", profileForm);
      const updatedSession = unwrapApiResponse(response);
      setProfile(updatedSession);
      setAuthSession({
        token: updatedSession.token,
        userId: updatedSession.userId,
        name: updatedSession.name,
        email: updatedSession.email,
        role: updatedSession.role,
      });
      setProfileForm({
        name: updatedSession.name,
        email: updatedSession.email,
      });
      setSuccessMessage("Admin profile updated successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update admin profile"));
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/auth/change-password", form);
      setSuccessMessage("Password updated successfully. Please use the new password next time you log in.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to change password"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Admin Settings"
      subtitle="Review your current admin account and rotate the password securely from inside the app."
      action={
        <button type="button" className="btn-primary">
          <ShieldCheck size={18} className="mr-2" />
          Security Center
        </button>
      }
    >
      {error ? <div className="mb-6 rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div> : null}
      {successMessage ? (
        <div className="mb-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Admin Account" description="Current authenticated admin profile from the backend.">
          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-500">Loading admin profile...</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Name</p>
                <p className="mt-2 text-base font-semibold text-ink-900">{profile?.name || "Unknown"}</p>
              </div>
              <div className="rounded-3xl bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                <p className="mt-2 text-base font-semibold text-ink-900">{profile?.email || "Unknown"}</p>
              </div>
              <div className="rounded-3xl bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Role</p>
                <p className="mt-2 text-base font-semibold text-ink-900">{profile?.role || "ADMIN"}</p>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Update Profile" description="Change the admin display name and login email.">
          <form className="grid gap-4" onSubmit={handleProfileSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Admin name</label>
              <input
                className="field"
                value={profileForm.name}
                onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Admin email</label>
              <input
                className="field"
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={profileSubmitting}>
              {profileSubmitting ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Change Password" description="Update the current admin password with server-side verification.">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Current password</label>
              <input
                className="field"
                type="password"
                value={form.currentPassword}
                onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">New password</label>
              <input
                className="field"
                type="password"
                value={form.newPassword}
                onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Confirm new password</label>
              <input
                className="field"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              <KeyRound size={18} className="mr-2" />
              {submitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default AdminSettingsPage;
