"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHabit, getHabitTypes } from "@/app/store/slices/goalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const CreateHabitSchema = yup.object().shape({
  name: yup.string().required("Habit name is required"),
  habit_type_id: yup.string().required("Habit type is required"),
  goal_type: yup
    .string()
    .oneOf(["daily", "weekly"], "Invalid goal type")
    .required("Goal type is required"),
  goal_target: yup.number()
    .required("Goal target is required")
    .positive("Goal must be positive"),
    reminder_time: yup.string().required("Reminder time is required"),
    message: yup.string().nullable(),
});

export default function CreateHabitPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, allHabitType, createdHabit } = useSelector((state) => state.habits);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/user/login");
    } else {
      setAdminToken(token);
      dispatch(getHabitTypes(token));
    }
  }, [dispatch, router]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      ...values,
      token: adminToken,
    };
    await dispatch(createHabit(payload));
    setSubmitting(false);
    resetForm();
    router.push("/user/habits/");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Habit</h1>

      <Formik
        initialValues={{
            name: "",
            habit_type_id: "",
            goal_type: "",
            goal_target: "",
            reminder_time: "",
            message: "",
          }}
        validationSchema={CreateHabitSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">Habit Name</label>
              <Field name="name" className="border p-2 w-full rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Habit Type</label>
              <Field as="select" name="habit_type_id" className="border p-2 w-full rounded">
              <option value="">Select Habit Type</option>
    {allHabitType &&
      allHabitType.map((type) => (
        <option key={type.habit_type_id} value={type.habit_type_id}>
          {type.name}
        </option>
                  ))}
              </Field>
              <ErrorMessage name="habit_type_id" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Goal Type</label>
              <Field as="select" name="goal_type" className="border p-2 w-full rounded">
                <option value="">Select Goal Type</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Field>
              <ErrorMessage name="goal_type" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Goal Target</label>
              <Field type="number" name="goal_target" className="border p-2 w-full rounded" />
              <ErrorMessage name="goal_target" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Reminder Time</label>
              <Field type="time" name="reminder_time" className="border p-2 w-full rounded" />
              <ErrorMessage name="reminder_time" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Message </label>
              <Field as="textarea" name="message" className="border p-2 w-full rounded" />
              <ErrorMessage name="message" component="div" className="text-red-500 text-sm" />
            </div>

            {error && <div className="text-red-500">{error}</div>}
            {createHabit && (
              <div className="text-green-600">
                Habit "{createHabit.name}" created successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting || loading ? "Creating..." : "Create Habit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
