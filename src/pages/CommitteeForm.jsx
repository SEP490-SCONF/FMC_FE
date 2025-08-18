import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getCommitteeForm,
  completeCommitteeForm,
} from "../services/UserConferenceRoleService";

const CommitteeForm = () => {
  const [searchParams] = useSearchParams();
  const eid = searchParams.get("eid");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    GroupName: "",
    SpecificTitle: "",
    Affiliation: "",
    Expertise: "",
    DisplayNameOverride: "",
    IsPublic: false,
  });

  useEffect(() => {
    if (!eid || !token) {
      setError("Invalid or missing link parameters.");
      setLoading(false);
      return;
    }
    getCommitteeForm(eid, token)
      .then((res) => {
        const data = res.data || res;
        setForm({
          GroupName: data.groupName || "",
          SpecificTitle: data.specificTitle || "",
          Affiliation: data.affiliation || "",
          Expertise: data.expertise || "",
          DisplayNameOverride: data.displayNameOverride || "",
          IsPublic: data.isPublic || false,
        });
      })
      .catch(() => setError("Invalid or expired link."))
      .finally(() => setLoading(false));
  }, [eid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await completeCommitteeForm(eid, { ...form, token });
      setSuccess("Your information has been updated successfully!");
    } catch (err) {
      setError(
        "Failed to update information. Please try again or contact support."
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (success)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-green-50 border border-green-200 rounded-xl px-8 py-6 flex flex-col items-center shadow-md">
        <svg
          className="w-12 h-12 text-green-500 mb-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div className="text-green-700 text-lg font-semibold text-center">
          {success}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white shadow rounded-xl p-8 w-full max-w-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">
          Committee Information Form
        </h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Group Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.GroupName}
            onChange={(e) => setForm({ ...form, GroupName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Specific Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.SpecificTitle}
            onChange={(e) =>
              setForm({ ...form, SpecificTitle: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Affiliation</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.Affiliation}
            onChange={(e) => setForm({ ...form, Affiliation: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Expertise</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.Expertise}
            onChange={(e) => setForm({ ...form, Expertise: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Display Name 
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.DisplayNameOverride}
            onChange={(e) =>
              setForm({ ...form, DisplayNameOverride: e.target.value })
            }
          />
        </div>
        <div className="mb-6 flex items-center">
          {/* Switch style for IsPublic */}
          <label
            htmlFor="isPublic"
            className="flex items-center cursor-pointer"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="isPublic"
                checked={form.IsPublic}
                onChange={(e) =>
                  setForm({ ...form, IsPublic: e.target.checked })
                }
                className="sr-only"
              />
              <div
                className={`block w-12 h-7 rounded-full ${form.IsPublic ? "bg-blue-600" : "bg-gray-300"}`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition ${
                  form.IsPublic ? "translate-x-5" : ""
                }`}
              ></div>
            </div>
            <span className="ml-3 text-gray-700 font-medium">
              Public in committee list
            </span>
          </label>
        </div>
        <button
          type="submit"
className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 
           text-white py-2 rounded-lg font-semibold 
           shadow-md hover:from-green-500 hover:via-green-600 hover:to-green-700 
           transition duration-300"        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommitteeForm;
