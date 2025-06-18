const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");
const auth = require("../middleware/authorization"); // Auth0-based middleware
const ExcelJS = require("exceljs");

// Create grade
router.post("/", auth, async (req, res) => {
  try {
    const { name, grades, exam } = req.body;
    const total = grades.reduce((sum, g) => sum + g, 0);
    const userId = req.user.sub; // From Auth0 token

    const newGrade = new Grade({ name, grades, total, exam, userId });
    await newGrade.save();
    res.status(201).json({ message: "Grade saved", data: newGrade });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get grades by logged-in user (and optional exam filter)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const query = { userId };
    if (req.query.exam) {
      query.exam = req.query.exam;
    }
    const grades = await Grade.find(query);
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch grades" });
  }
});

// Export grades to Excel
router.get("/export", auth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const query = { userId };
    if (req.query.exam) {
      query.exam = req.query.exam;
    }
    const grades = await Grade.find(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Grades");

    const maxQuestions = Math.max(...grades.map((g) => g.grades.length));
    const headers = ["Student Name"];
    for (let i = 1; i <= maxQuestions; i++) {
      headers.push(`Q${i}`);
    }
    headers.push("Total");
    worksheet.addRow(headers);

    grades.forEach((grade) => {
      const row = [grade.name, ...grade.grades];
      while (row.length < headers.length - 1) row.push("");
      row.push(grade.total);
      worksheet.addRow(row);
    });

    const avgRowValues = ["Averages"];
    for (let i = 0; i < maxQuestions; i++) {
      let sum = 0,
        count = 0;
      grades.forEach((g) => {
        if (g.grades[i] !== undefined) {
          sum += g.grades[i];
          count++;
        }
      });
      avgRowValues.push(count > 0 ? (sum / count).toFixed(2) : "");
    }

    const totalAvg =
      grades.length > 0
        ? (grades.reduce((acc, g) => acc + g.total, 0) / grades.length).toFixed(
            2
          )
        : "";
    avgRowValues.push(totalAvg);
    worksheet.addRow(avgRowValues);

    worksheet.columns.forEach((column) => (column.width = 15));
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=grades.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to export grades");
  }
});

// Delete a single grade by ID (must belong to the user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const grade = await Grade.findOneAndDelete({ _id: id, userId });
    if (!grade) return res.status(404).json({ error: "Grade not found" });
    res.json({ message: "Grade deleted", data: grade });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete grade" });
  }
});

// Delete all grades of the logged-in user
router.delete("/", auth, async (req, res) => {
  try {
    const userId = req.user.sub;
    await Grade.deleteMany({ userId });
    res.json({ message: "All grades deleted for this user" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete grades" });
  }
});

// Get only grade IDs of the logged-in user
router.get("/ids", auth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const ids = await Grade.find({ userId }, { _id: 1 });
    res.json(ids.map((item) => item._id));
  } catch (err) {
    res.status(500).json({ error: "Failed to get IDs" });
  }
});
// Get unique exam names for the logged-in user
router.get("/exams", auth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const exams = await Grade.distinct("exam", { userId });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exam names" });
  }
});
// GET /grades/check-exam?name=EXAM_NAME
router.get("/check-exam", auth, async (req, res) => {
  const userId = req.user.sub;
  const examName = req.query.name;

  if (!examName) return res.status(400).json({ error: "Missing exam name" });

  try {
    const existing = await Grade.findOne({ userId, exam: examName });
    if (existing) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
