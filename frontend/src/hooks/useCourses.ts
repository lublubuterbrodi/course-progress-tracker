import { useEffect, useState } from "react";
import type { FormEvent, MouseEvent } from "react";

import type { Course } from "../types/course";

import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../api/courses";

import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "../api/lessons";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [addingLessonCourseId, setAddingLessonCourseId] =
    useState<number | null>(null);

  const [lessonInputs, setLessonInputs] = useState<Record<number, string>>({});

  const [error, setError] = useState("");

  async function loadCourses() {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load courses.");
    }
  }

  useEffect(() => {
   const fetchCourses = async () => {
      try {
         const data = await getCourses();
         setCourses(data);
      } catch (error) {
         console.error(error);
         setError("Failed to load courses.");
      }
   };

    fetchCourses();
   }, []);
   

  const resetCourseForm = () => {
    setCourseTitle("");
    setCourseDescription("");
    setError("");
    setIsCourseFormOpen(false);
  };

  const handleCreateCourse = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = courseTitle.trim();
    const trimmedDescription = courseDescription.trim();

    if (!trimmedTitle) {
      setError("Course title is required.");
      return;
    }

    try {
      await createCourse(trimmedTitle, trimmedDescription);

      await loadCourses();

      resetCourseForm();
    } catch (error) {
      console.error(error);
      setError("Failed to create course.");
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await deleteCourse(courseId);

      await loadCourses();

      if (expandedCourseId === courseId) {
        setExpandedCourseId(null);
      }

      if (editingCourseId === courseId) {
        setEditingCourseId(null);
        setEditedTitle("");
        setEditedDescription("");
      }

      if (addingLessonCourseId === courseId) {
        setAddingLessonCourseId(null);
      }

      setLessonInputs((currentInputs) => {
        const nextInputs = { ...currentInputs };
        delete nextInputs[courseId];
        return nextInputs;
      });

      setCourseToDelete(null);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to delete course.");
    }
  };

  const handleToggleCourse = (courseId: number) => {
    setExpandedCourseId((currentId) =>
      currentId === courseId ? null : courseId,
    );

    if (expandedCourseId === courseId) {
      setAddingLessonCourseId(null);
    }

    setError("");
  };

  const handleStartEditing = (
    event: MouseEvent<HTMLButtonElement>,
    course: Course,
  ) => {
    event.stopPropagation();

    setEditingCourseId(course.id);
    setEditedTitle(course.title);
    setEditedDescription(course.description ?? "");
    setError("");
  };

  const handleCancelEditing = () => {
    setEditingCourseId(null);
    setEditedTitle("");
    setEditedDescription("");
    setError("");
  };

  const handleSaveCourse = async (
    event: FormEvent<HTMLFormElement>,
    courseId: number,
  ) => {
    event.preventDefault();

    const trimmedTitle = editedTitle.trim();
    const trimmedDescription = editedDescription.trim();

    if (!trimmedTitle) {
      setError("Course title is required.");
      return;
    }

    try {
      await updateCourse(
        courseId,
        trimmedTitle,
        trimmedDescription,
      );

      await loadCourses();

      handleCancelEditing();
    } catch (error) {
      console.error(error);
      setError("Failed to update course.");
    }
   };
   
     const handleOpenLessonForm = (courseId: number) => {
    setAddingLessonCourseId(courseId);
    setError("");
  };

  const handleCloseLessonForm = (courseId: number) => {
    setAddingLessonCourseId(null);
    setError("");

    setLessonInputs((currentInputs) => ({
      ...currentInputs,
      [courseId]: "",
    }));
  };

  const handleLessonInputChange = (
    courseId: number,
    value: string,
  ) => {
    setLessonInputs((currentInputs) => ({
      ...currentInputs,
      [courseId]: value,
    }));
  };

  const handleAddLesson = async (
    event: FormEvent<HTMLFormElement>,
    courseId: number,
  ) => {
    event.preventDefault();

    const lessonTitle = lessonInputs[courseId]?.trim();

    if (!lessonTitle) {
      setError("Lesson title is required.");
      return;
    }

    try {
      await createLesson(courseId, lessonTitle);

      await loadCourses();

      setLessonInputs((currentInputs) => ({
        ...currentInputs,
        [courseId]: "",
      }));

      setAddingLessonCourseId(null);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to create lesson.");
    }
  };

  const handleToggleLesson = async (
    courseId: number,
    lessonId: number,
  ) => {
    try {
      const course = courses.find((course) => course.id === courseId);

      if (!course) {
        return;
      }

      const lesson = course.lessons.find(
        (lesson) => lesson.id === lessonId,
      );

      if (!lesson) {
        return;
      }

      await updateLesson(
        lessonId,
        !lesson.isCompleted,
      );

      await loadCourses();
    } catch (error) {
      console.error(error);
      setError("Failed to update lesson.");
    }
  };

  const handleDeleteLesson = async (
    _courseId: number,
    lessonId: number,
  ) => {
    try {
      await deleteLesson(lessonId);

      await loadCourses();
    } catch (error) {
      console.error(error);
      setError("Failed to delete lesson.");
    }
  };

  return {
    courses,
    expandedCourseId,

    isCourseFormOpen,
    courseTitle,
    courseDescription,

    courseToDelete,

    editingCourseId,
    editedTitle,
    editedDescription,

    addingLessonCourseId,
    lessonInputs,
    error,

    setIsCourseFormOpen,
    setCourseTitle,
    setCourseDescription,
    setCourseToDelete,
    setEditedTitle,
    setEditedDescription,
    setError,

    resetCourseForm,
    handleCreateCourse,
    handleDeleteCourse,
    handleToggleCourse,
    handleStartEditing,
    handleCancelEditing,
    handleSaveCourse,
    handleOpenLessonForm,
    handleCloseLessonForm,
    handleLessonInputChange,
    handleAddLesson,
    handleToggleLesson,
    handleDeleteLesson,
  };
}