"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getLogs, logHabit } from "@/app/store/slices/goalSlice";

export default function HabitsDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [loadingActions, setLoadingActions] = useState({});
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

  const handleStatusChange = async (habit_id, status, date) => {
    if (!token) return;

    setLoadingActions((prev) => ({ ...prev, [habit_id]: true }));
    const request_data = {
      token,
      habit_id,
      status,
      date: date || new Date().toISOString().split("T")[0],
    };

    try {
      await dispatch(logHabit(request_data)).unwrap();
      await dispatch(getLogs(token));
    } catch (error) {
      alert("Failed to update habit status");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [habit_id]: false }));
    }
  };

  const formatDate = (dateString) => {
    console.log("dateString",dateString)
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Habits Dashboard</h1>
      <p className="mb-6 text-gray-700">Manage your habits and view completion history.</p>

      <div className="space-x-4 mb-8">
        <button
          onClick={() => router.push("/user/habits/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Habit
        </button>
        <button
          onClick={() => router.push("/user/habits/habit-type/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Habit Type
        </button>
        <button
          onClick={() => router.push("/user")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Users Page
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Habit Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : allLogs && allLogs.length > 0 ? (
        <div className="overflow-auto mb-8">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Habit</th>
                <th className="py-2 px-4 border-b">Goal Type</th>
                <th className="py-2 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {allLogs.map((log, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{formatDate(log.date)}</td>
                  <td className="py-2 px-4 border-b">
                    {loadingActions[log.habit_id] ? (
                      <span className="inline-block px-2 py-1">Updating...</span>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(log.habit_id, "completed", log.date)
                          }
                          disabled={loadingActions[log.habit_id]}
                          className={`px-2 py-1 rounded text-white ${
                            log.status === "completed" ? "bg-green-600" : "bg-gray-400"
                          } hover:bg-green-700`}
                        >
                          Completed
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(log.habit_id, "not-completed", log.date)
                          }
                          disabled={loadingActions[log.habit_id]}
                          className={`px-2 py-1 rounded text-white ${
                            log.status === "not-completed" ? "bg-red-600" : "bg-gray-400"
                          } hover:bg-red-700`}
                        >
                          Not Completed
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{log.name}</td>
                  <td className="py-2 px-4 border-b">{log.goal_type}</td>
                  <td className="py-2 px-4 border-b">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
}
