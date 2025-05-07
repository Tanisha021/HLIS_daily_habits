"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getStreaks } from "@/app/store/slices/goalSlice";
import { logoutUser } from "@/app/store/slices/authSlice";

export default function HabitStreaks() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  const { streaks, loading, error } = useSelector((state) => state.habits);

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (!storedToken) {
      router.push("/user/login");
    } else {
      setToken(storedToken);
      dispatch(getStreaks(storedToken));
    }
  }, [dispatch, router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("user_token");
    if (token) {
      await dispatch(logoutUser(token));
      router.push("/user/login");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto m-2">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Habit Streaks</h1>
       
        <button 
          onClick={() => router.push("/user/habits")} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 m-2"
        >
            Move to Dashboard
        </button>
        <button 
          onClick={() => router.push("/user/suggested-habits")} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 m-2"
        >
            Suggested Habit
        </button>
        <button 
          onClick={() => router.push("/user/reminders")} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 m-2"
        >
            See Upcoming Reminders
        </button>
        <button 
          onClick={() => router.push("/user/calendar")} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 m-2"
        >
            See Calendar
        </button>
        <button
          onClick={handleLogout} 
          className="inline-block bg-red-600 text-white px-4 py-2 rounded text-sm m-2"
        >
          Logout
        </button>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : streaks && streaks.length > 0 ? (
          <ul className="space-y-4">
            {streaks.map((streak, index) => (
              <li
                key={index}
                className="bg-white p-4 border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-700">{streak.name}</h2>
                  <span className="text-sm text-gray-500">{streak.goal_type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Current Streak: {streak.current_streak}</p>
                  <p>Longest Streak: {streak.longest_streak}</p>
                  <p>Last Completed: {new Date(streak.last_completed).toLocaleDateString()}</p>
                  <p>Created At: {new Date(streak.created_at).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No streaks found.</p>
        )}
      </div>
    </div>
  );
}
