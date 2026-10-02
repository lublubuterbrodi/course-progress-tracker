import { API_URL } from "./api";
import type { Lesson } from "../types/course";

export async function createLesson(
  courseId: number,
  title: string,
  description = "",
): Promise<Lesson> {
  const response = await fetch(
    `${API_URL}/courses/${courseId}/lessons`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create lesson");
  }

  return response.json();
}

export async function updateLesson(
  lessonId: number,
  isCompleted: boolean,
): Promise<Lesson> {
  const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCompleted,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update lesson");
  }

  return response.json();
}

export async function deleteLesson(lessonId: number): Promise<void> {
  const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete lesson");
  }
}