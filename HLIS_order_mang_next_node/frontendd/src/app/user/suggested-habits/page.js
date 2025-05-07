"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getSuggestedHabits } from "@/app/store/slices/goalSlice";

export default function SuggestedHabits() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  const { suggestedHabits, loading, error } = useSelector((state) => state.habits);

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (!storedToken) {
      router.push("/user/login");
    } else {
      setToken(storedToken);
      dispatch(getSuggestedHabits(storedToken));
    }
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Habits</h1>

        {loading ? (
          <p className="text-gray-500">Loading suggestions...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : suggestedHabits && suggestedHabits.length > 0 ? (
          <ul className="space-y-4">
            {suggestedHabits.map((habit, index) => (
              <li
                key={index}
                className="bg-white p-4 border border-gray-200 "
              >
                <h2 className="text-lg font-medium text-gray-800">{habit.name}</h2>
                <p className="text-sm text-gray-500">{habit.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No suggested habits found.</p>
        )}
      </div>
    </div>
  );
}
