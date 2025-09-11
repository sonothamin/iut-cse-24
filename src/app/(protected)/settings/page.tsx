"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { FormEvent, useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import AvatarImage from "@/components/AvatarImage";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [roll, setRoll] = useState("");
  const [section, setSection] = useState("");
  const [blood, setBlood] = useState("");
  const [batchYear, setBatchYear] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Socials
  const [github, setGithub] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  // Tags
  const [tagInput, setTagInput] = useState("");
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setBio(profile.bio ?? "");
      setRoll(profile.roll ?? "");
      setSection(profile.section ?? "");
      setBlood(profile.blood_group ?? "");
      setBatchYear(profile.batch_year ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setGithub(profile.github ?? "");
      setFacebook(profile.facebook ?? "");
      setLinkedin(profile.linkedin ?? "");
      setInstagram(profile.instagram ?? "");
      setTwitter(profile.twitter ?? "");
      setWebsite(profile.website ?? "");
      setTagsArray(profile.tags ?? []);
    }
  }, [profile]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      setUploading(true);
      const supabase = getSupabaseBrowserClient();
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage.from("avatar").upload(path, file);
      if (upErr) throw upErr;
      await supabase.from("users").update({ avatar_url: path }).eq("id", user.id);
      await refreshProfile();
    } finally {
      setUploading(false);
      (e.target as HTMLInputElement).value = "";
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const supabase = getSupabaseBrowserClient();
    await supabase
      .from("users")
      .update({
        first_name: firstName,
        last_name: lastName,
        bio,
        roll,
        section,
        blood_group: blood,
        batch_year: batchYear || null,
        phone,
        github,
        facebook,
        linkedin,
        instagram,
        twitter,
        website,
        tags: tagsArray,
      })
      .eq("id", user.id);
    await refreshProfile();
    setSuccessMessage("✅ Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tagsArray.includes(newTag)) {
        setTagsArray([...tagsArray, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTagsArray(tagsArray.filter((t) => t !== tag));
  };

  return (
    <ProtectedRoute>
      <div className="container py-5" style={{ maxWidth: 900 }}>
        <h2 className="mb-4">
          <i className="fa-solid fa-gear me-2"></i> Account Settings
        </h2>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* Avatar */}
        <div className="card mb-4">
          <div className="card-body d-flex align-items-center gap-3">
            <AvatarImage path={profile?.avatar_url ?? undefined} size={72} />
            <div>
              <h5 className="mb-1">{profile?.first_name} {profile?.last_name}</h5>
              <label className="btn btn-outline-primary btn-sm mb-0">
                <i className="fa-regular fa-image me-1"></i>
                {uploading ? "Uploading..." : "Change Avatar"}
                <input
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={onUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSave} className="card p-4">
          <h5 className="mb-3">Profile Info</h5>
          <div className="row g-3">
            {/* Name */}
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                <label>First Name</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
                <label>Last Name</label>
              </div>
            </div>

            {/* Email + Phone */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-phone"></i>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="col-12">
              <div className="form-floating">
                <textarea
                  className="form-control"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio"
                  style={{ height: 100 }}
                />
                <label>Bio</label>
              </div>
            </div>

            {/* Academic */}
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  className="form-control"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="Roll"
                />
                <label>Roll</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  className="form-control"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="Section"
                />
                <label>Section</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  className="form-control"
                  value={blood}
                  onChange={(e) => setBlood(e.target.value)}
                  placeholder="Blood"
                />
                <label>Blood Group</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  value={batchYear}
                  onChange={(e) =>
                    setBatchYear(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Batch Year"
                />
                <label>Batch Year</label>
              </div>
            </div>
          </div>

          {/* Socials */}
          <h5 className="mt-4">Social Links</h5>
          <div className="row g-3">
            {[
              ["GitHub", github, setGithub, "fa-brands fa-github"],
              ["LinkedIn", linkedin, setLinkedin, "fa-brands fa-linkedin"],
              ["Facebook", facebook, setFacebook, "fa-brands fa-facebook"],
              ["Instagram", instagram, setInstagram, "fa-brands fa-instagram"],
              ["Twitter", twitter, setTwitter, "fa-brands fa-twitter"],
              ["Website", website, setWebsite, "fa-solid fa-globe"],
            ].map(([label, value, setter, icon], i) => (
              <div className="col-md-6" key={i}>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className={icon as string}></i>
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    placeholder={label as string}
                    value={value as string}
                    onChange={(e) =>
                      (setter as React.Dispatch<React.SetStateAction<string>>)(
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <h5 className="mt-4">Tags</h5>
          <div className="form-control d-flex flex-wrap gap-2 p-2">
            {tagsArray.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary d-flex align-items-center">
                {tag}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-2"
                  onClick={() => removeTag(tag)}
                ></button>
              </span>
            ))}
            <input
              type="text"
              className="border-0 flex-grow-1 bg-white text-secondary"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Type tag, press Enter"
            />
          </div>

          {/* Save */}
          <div className="mt-4 text-end">
            <button className="btn btn-primary" type="submit" disabled={uploading}>
              <i className="fa-solid fa-floppy-disk me-1"></i>
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
