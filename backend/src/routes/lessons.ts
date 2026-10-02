import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/courses/:courseId/lessons", async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course id",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch lessons",
    });
  }
});

router.post("/courses/:courseId/lessons", async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { title, description } = req.body;

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course id",
      });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Lesson title is required",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        courseId,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create lesson",
    });
  }
});

router.patch("/lessons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { isCompleted } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid lesson id",
      });
    }

    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        message: "isCompleted must be a boolean",
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const updatedLesson = await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isCompleted,
      },
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update lesson",
    });
  }
});

router.delete("/lessons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid lesson id",
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    await prisma.lesson.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete lesson",
    });
  }
});

export default router;