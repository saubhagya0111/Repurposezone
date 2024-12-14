/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted for Login:", formData); // Log the login form data

    try {
      const res = await api.post("/api/login", formData);
      console.log("Login Response:", res.data); // Log the backend response

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token); // Save JWT token
        console.log("Login successful. Token saved:", res.data.token); // Confirm success
        setMessage("Login successful!");
        router.push("/dashboard"); // Redirect to Dashboard
      } else {
        setMessage("Unexpected response from the server");
      }
    } catch (error: any) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Login</h2>
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
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Login
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}
