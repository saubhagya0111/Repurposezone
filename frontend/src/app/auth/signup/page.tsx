/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import api from "@/app/utils/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData); // Debug log

    try {
      const res = await api.post("/api/register", formData);
      console.log("Registration Response:", res.data); // Log backend response

      if (res.status === 201) {
        setMessage(res.data.message || "User registered successfully");
        console.log("User registered successfully:", res.data);
      } else {
        setMessage("Unexpected response from the server");
      }
    } catch (error: any) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Role:
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Sign Up
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}
