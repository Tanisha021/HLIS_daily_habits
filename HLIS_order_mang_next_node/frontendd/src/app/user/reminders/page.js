"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getUpcomingReminders } from "@/app/store/slices/goalSlice";

export default function ReminderPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  const { reminders, loading, error } = useSelector((state) => state.habits);
    console.log("reminders",reminders)
  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (!storedToken) {
      router.push("/user/login");
    } else {
      setToken(storedToken);
      dispatch(getUpcomingReminders(storedToken));
    }
  }, [dispatch, router]);


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Reminders</h1>

        <button
          onClick={() => router.push("/user")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Move to Home Page
        </button>
        <button
          onClick={() => router.push("/user/habits")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Move to Dashboard
        </button>
       

        {loading ? (
          <p className="text-gray-500 mt-6">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mt-6">Error: {error}</p>
        ) : reminders && reminders.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {reminders.map((reminder, index) => (
              <li
                key={index}
                className="bg-white p-4 border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-700">{reminder.name}</h2>
                  <span className="text-sm text-gray-500">{reminder.goal_type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Reminder Time: {reminder.reminder_time}</p>
                  <p>Message: {reminder.message}</p>
                  <p>Target: {reminder.goal_target}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-6">No upcoming reminders found.</p>
        )}
      </div>
    </div>
  );
}
