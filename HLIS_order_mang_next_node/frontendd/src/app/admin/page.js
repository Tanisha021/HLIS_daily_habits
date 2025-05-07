"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { viewAllUsers} from "../store/slices/adminSlice";
import { useRouter } from "next/navigation";

export default function Admin() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {users, loading, error} = useSelector((state) => state.adminauth);
  console.log("users", users);
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    console.log("token-frontend", token);
    if (!token) {
      router.push("/admin/login");
      return;
    }
    dispatch(viewAllUsers(token));
  }, [dispatch, router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">View All Users</h1>
      <div className="flex gap-3 mb-4">
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="overflow-x-auto">
  {users?.length ? (
    <table className="min-w-full bg-white border rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3 border">user_id</th>
          <th className="p-3 border">full_name</th>
          <th className="p-3 border">Email_id</th>
         
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id} className="border-t hover:bg-gray-50">
            <td className="p-3 border">{user.user_id}</td>
            <td className="p-3 border">{user.full_name || "N/A"}</td>
            <td className="p-3 border capitalize">{user.email_id}</td>
            <td className="p-3 border">
                    <Link
                      href={`/admin/user/${user.user_id}`} 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    !loading && <p className="text-center mt-4">No users available</p>
  )}
</div>

    </div>
  );
}