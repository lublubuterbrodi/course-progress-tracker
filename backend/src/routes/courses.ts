import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/courses", async (_req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Course title is required",
      });
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create course",
    });
  }
});

router.patch("/courses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid course id",
      });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Course title is required",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update course",
    });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid course id",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete course",
    });
  }
});

export default router;