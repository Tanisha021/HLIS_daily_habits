"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addHabitType } from "@/app/store/slices/goalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const HabitSchema = yup.object().shape({
  name: yup.string().required("Habit type name is required"),
});

export default function CreateHabitTypePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, habit_type } = useSelector((state) => state.habits);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/user/login");
    } else {
      setAdminToken(token);
    }
  }, [router]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.name,
      token: adminToken,
    };
    await dispatch(addHabitType(payload));
    setSubmitting(false);
    resetForm();
    router.push("/user/habits/")
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Habit Type</h1>

      <Formik
        initialValues={{ name: "" }}
        validationSchema={HabitSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Habit Type Name</label>
              <Field name="name" className="border p-2 w-full rounded" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}
            {habit_type && (
              <div className="text-green-600">
                Habit Type "{habit_type.name}" created successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting || loading ? "Creating..." : "Create Habit Type"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
