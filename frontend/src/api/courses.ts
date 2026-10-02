import { API_URL } from "./api";
import type { Course } from "../types/course";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

export async function createCourse(
  title: string,
  description: string,
): Promise<Course> {
  const response = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create course");
  }

  return response.json();
}

export async function updateCourse(
  courseId: number,
  title: string,
  description: string,
): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update course");
  }

  return response.json();
}

export async function deleteCourse(courseId: number): Promise<void> {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete course");
  }
}