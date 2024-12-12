/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/api";
import TweetForm from "./TweetForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  const [userData, setUserData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching users data...");
      try {
        const res = await api.get("/api/users"); // Fetch all users
        console.log("Fetched Users Data:", res.data.users); // Log the response data
        setUserData(res.data.users);
      } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error("Error fetching users data:", errorMessage);
        router.push('/dashboard');
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <ul>
        {userData.map((user: any) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <TweetForm />
    </div>
  );
}
