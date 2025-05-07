"use client"; 
import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { useDispatch, useSelector } from "react-redux"; 
import { getLogs, logHabit } from "@/app/store/slices/goalSlice";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

 
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
    
    console.log(`Logging habit: ID=${habit_id}, Status=${status}, Date=${date || 'today'}`);

    setLoadingActions(prev => ({...prev, [habit_id]: true}));
     
    const request_data = { 
      token, 
      habit_id, 
      status,
      date: date || new Date().toISOString().split('T')[0] 
    }; 
     
    try { 
      const result = await dispatch(logHabit(request_data)).unwrap();
      console.log("Log habit result:", result);

      await dispatch(getLogs(token));

    } catch (error) { 
     
      alert("Failed to update habit status. Please try again.");
    } finally {

      setLoadingActions(prev => ({...prev, [habit_id]: false}));
    } 
  }; 
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return;
  
    const dateString = date.toISOString().split('T')[0];
  
    const log = allLogs.find(log => log.date === dateString);
    if (!log) return 'bg-gray-200'; // default gray for no data
  
    if (log.status === 'completed') return 'bg-green-400 text-white';
    if (log.status === 'not-completed') return 'bg-red-400 text-white';
  
    return 'bg-yellow-300'; // for unknown status
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return ( 
    <div className="p-6 max-w-5xl mx-auto"> 
      <h1 className="text-3xl font-bold mb-4">Habits Dashboard</h1> 
      <p className="mb-6 text-gray-700">Manage your habits and habit types from here.</p> 
 
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
      <h2 className="text-xl font-semibold mt-12 mb-4">Habit Calendar</h2>
<div className="bg-white rounded shadow p-4 max-w-md">
  <Calendar
    tileClassName={getTileClassName}
  />
  <div className="mt-4 text-sm text-gray-600">
    <p><span className="inline-block w-4 h-4 bg-green-400 mr-2"></span>Completed</p>
    <p><span className="inline-block w-4 h-4 bg-red-400 mr-2"></span>Not Completed</p>
    <p><span className="inline-block w-4 h-4 bg-gray-200 mr-2"></span>No Log</p>
  </div>
</div>
 
      <h2 className="text-xl font-semibold mb-4">Your Habit Logs</h2> 
      {loading ? ( 
        <p>Loading logs...</p> 
      ) : error ? ( 
        <p className="text-red-500">Error: {error}</p> 
      ) : allLogs && allLogs.length > 0 ? ( 
        <div className="overflow-auto"> 
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
              {allLogs && allLogs.map((log, index) => { 
                return (
                  <tr key={index} className="text-center"> 
                    <td className="py-2 px-4 border-b">{formatDate(log.date)}</td> 
                    <td className="py-2 px-4 border-b"> 
                      {loadingActions[log.habit_id] ? (
                        <span className="inline-block px-2 py-1">Updating...</span>
                      ) : (
                        <select 
                          value={log.status || "not-completed"} 
                          onChange={(e) => {
                            console.log(`Selected ${e.target.value} for habit ${log.habit_id}`);
                            handleStatusChange(log.habit_id, e.target.value, log.date);
                          }}
                          className="border rounded px-2 py-1" 
                        > 
                          <option value="not-completed">Not Completed</option> 
                          <option value="completed">Completed</option> 
                        </select>
                      )}
                    </td> 
                    <td className="py-2 px-4 border-b">{log.name}</td> 
                    <td className="py-2 px-4 border-b">{log.goal_type}</td> 
                    <td className="py-2 px-4 border-b">{formatDate(log.created_at)}</td> 
                  </tr> 
                );
              })} 
            </tbody> 
          </table> 
        </div> 
      ) : ( 
        <p>No logs found.</p> 
      )} 
    </div> 
  ); 
}