const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");
const auth = require("../middleware/authorization");

// Save student grades
router.post("/", auth, async (req, res) => {
  try {
    const { name, grades, exam } = req.body;
    const total = grades.reduce((sum, g) => sum + g, 0);

    const newGrade = new Grade({
      name,
      grades,
      total,
      exam,
      userId: req.user.userId,
    });
    await newGrade.save();

    res.status(201).json({ message: "Grade saved", data: newGrade });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all saved grades for the logged-in user (optionally by exam)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = { userId };
    if (req.query.exam) query.exam = req.query.exam;

    const allGrades = await Grade.find(query);
    res.json(allGrades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch grades" });
  }
});

// Export grades as Excel with averages and styling
router.get("/export", auth, async (req, res) => {
  const ExcelJS = require("exceljs");

  try {
    const query = { userId: req.user.userId };
    if (req.query.exam) query.exam = req.query.exam;

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

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCE6F1" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    grades.forEach((grade) => {
      const row = [grade.name, ...grade.grades];
      while (row.length < headers.length - 1) row.push("");
      row.push(grade.total);
      worksheet.addRow(row);
    });

    const avgRowValues = ["Averages"];
    let totalSum = 0;

    for (let i = 0; i < maxQuestions; i++) {
      let sum = 0;
      let count = 0;
      grades.forEach((g) => {
        if (g.grades[i] !== undefined) {
          sum += g.grades[i];
          count++;
        }
      });
      avgRowValues.push(count > 0 ? (sum / count).toFixed(2) : "");
    }

    totalSum = grades.reduce((acc, g) => acc + g.total, 0);
    const totalAvg =
      grades.length > 0 ? (totalSum / grades.length).toFixed(2) : "";
    avgRowValues.push(totalAvg);

    const avgRow = worksheet.addRow(avgRowValues);
    avgRow.font = { italic: true };
    avgRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE699" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

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

// Delete a grade by ID (only if it belongs to the user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade || grade.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this grade" });
    }
    await grade.deleteOne();
    res.json({ message: "Grade deleted", data: grade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete grade" });
  }
});

// Delete all grades of this user (optionally by exam)
router.delete("/", auth, async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    if (req.query.exam) query.exam = req.query.exam;
    await Grade.deleteMany(query);
    res.json({ message: "All your grades deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete all grades" });
  }
});

// Get only grade IDs (for the logged-in user, optionally by exam)
router.get("/ids", auth, async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    if (req.query.exam) query.exam = req.query.exam;
    const ids = await Grade.find(query, { _id: 1 });
    const idList = ids.map((item) => item._id);
    res.json(idList);
  } catch (err) {
    res.status(500).json({ error: "Failed to get IDs" });
  }
});

module.exports = router;
