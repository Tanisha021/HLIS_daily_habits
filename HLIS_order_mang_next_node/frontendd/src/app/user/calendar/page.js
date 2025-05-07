"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getLogs } from "@/app/store/slices/goalSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function HabitCalendarPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { allLogs, loading, error } = useSelector((state) => state.habits);

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (!storedToken) {
      router.push("/user/login");
    } else {
      setToken(storedToken);
      dispatch(getLogs(storedToken));
    }
  }, [dispatch, router]);

  const events =
    allLogs?.map((log) => ({
      title: `${log.name}`,
      start: log.date,
      backgroundColor: log.status === "completed" ? "#86efac" : "#fca5a5",
      textColor: "#000",
    })) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Habits Calendar</h1>
      <button
        onClick={() => router.push("/user/habits")}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back to Dashboard
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events} 
            height={"auto"}
            eventDisplay="block"
          />
        </div>
      )}
    </div>
  );
}
