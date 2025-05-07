"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { viewUserDetails } from "@/app/store/slices/adminSlice";
import Link from "next/link";

export default function UserHabitProgress() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.adminauth.usersDetail);
  const loading = useSelector((state) => state.adminauth.loading);
  const error = useSelector((state) => state.adminauth.error);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (id) {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/admin/login");
          return;
        }
        await dispatch(viewUserDetails({ id, token }));
      }
    };

    fetchUserDetails();
  }, [dispatch, id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
        <Link href="/admin" className="mt-4 text-blue-500 hover:underline">
          Back to Admin
        </Link>
      </div>
    );
  }

  if (!userDetails || userDetails.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">No Habit Progress Found</div>
        <Link href="/admin" className="mt-4 text-blue-500 hover:underline">
          Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">User Habit Progress</h1>
      {userDetails.map((habit, index) => (
        <div key={index} className="border p-4 mb-4 rounded bg-gray-100">
          <h2 className="font-bold text-lg">{habit.name}</h2>
          <p className="text-gray-700">Goal Type: {habit.goal_type}</p>
          <p className="text-gray-700">Created At: {new Date(habit.created_at).toLocaleDateString()}</p>
          <p className="text-green-700">Current Streak: {habit.current_streak}</p>
          <p className="text-blue-700">Longest Streak: {habit.longest_streak}</p>
          <p className="text-gray-600">Last Completed: {new Date(habit.last_completed).toLocaleDateString()}</p>
        </div>
      ))}

      <Link href="/admin" className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 inline-block">
        Back to Admin
      </Link>
    </div>
  );
}
