const Material = require("../models/material.model");

exports.addMaterial = async (req, res) => {
  try {
    const { sessionId, date, title, description } = req.body;
    const fileUrl = req.file.path;

    if (!sessionId || !date || !fileUrl) {
      return res
        .status(400)
        .json({ message: "Required fields missing", body: req.body });
    }

    const material = new Material({
      sessionId,
      date: new Date(date),
      title,
      description,
      fileUrl,
      uploadedBy: req.session.user._id,
    });

    await material.save();

    res
      .status(201)
      .json({ message: "Material uploaded successfully", material });
  } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error });
  }
};

exports.getMaterialsForDate = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { date } = req.query;

    if (!sessionId || !date) {
      return res.status(400).json({ message: "Missing sessionId or date" });
    }

    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const materials = await Material.find({
      sessionId,
      date: {
        $gte: selectedDate,
        $lt: nextDay,
      },
    }).sort({ uploadedAt: -1 });

    res.status(200).json({ materials });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
