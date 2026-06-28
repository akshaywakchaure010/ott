import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../api/auth";
import "../styles/editProfile.css";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileError("Name and email are required");
      return;
    }

    setSavingProfile(true);
    try {
      const { data } = await updateProfile(profileForm);
      updateUser(data.user);
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation don't match");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="pp-edit-profile">
        <button className="pp-back-link" onClick={() => navigate("/myspace")}>
          <FiArrowLeft /> Back to My Space
        </button>

        <h1>Edit Profile</h1>
        <p className="pp-admin-page-sub">
          Update your account details. This works the same whether you're a viewer or an admin.
        </p>

        <div className="pp-edit-profile-grid">
          {/* Profile details panel */}
          <div className="pp-admin-panel">
            <h3>Profile Details</h3>

            <div className="pp-edit-avatar-preview">
              {profileForm.avatar ? (
                <img src={profileForm.avatar} alt="Avatar preview" />
              ) : (
                <FiUser size={28} />
              )}
            </div>

            {profileError && <div className="pp-auth-error">{profileError}</div>}
            {profileSuccess && <div className="pp-auth-success">{profileSuccess}</div>}

            <form className="pp-admin-form" onSubmit={handleProfileSubmit}>
              <label className="pp-form-full">
                Full name
                <input name="name" value={profileForm.name} onChange={handleProfileChange} required />
              </label>

              <label className="pp-form-full">
                Email
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </label>

              <label className="pp-form-full">
                Avatar Image URL (optional)
                <input
                  name="avatar"
                  value={profileForm.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
              </label>

              <div className="pp-form-full">
                <button type="submit" className="pp-btn pp-btn-primary" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Password panel */}
          <div className="pp-admin-panel">
            <h3>Change Password</h3>

            {passwordError && <div className="pp-auth-error">{passwordError}</div>}
            {passwordSuccess && <div className="pp-auth-success">{passwordSuccess}</div>}

            <form className="pp-admin-form" onSubmit={handlePasswordSubmit}>
              <label className="pp-form-full">
                Current password
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label className="pp-form-full">
                New password
                <input
                  type="password"
                  name="newPassword"
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label className="pp-form-full">
                Confirm new password
                <input
                  type="password"
                  name="confirmPassword"
                  minLength={6}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <div className="pp-form-full">
                <button type="submit" className="pp-btn pp-btn-primary" disabled={savingPassword}>
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
