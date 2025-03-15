const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Document = require("../models/Document");
const path = require("path");

// @desc    Get all documents for a trucker
// @route   GET /api/truckers/documents
// @access  Private
exports.getDocuments = asyncHandler(async (req, res, next) => {
  const documents = await Document.find({ trucker: req.user.id });
  res.status(200).json({ success: true, data: documents });
});

// @desc    Upload a document
// @route   POST /api/truckers/documents
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = req.files.file;

  // Make sure the file is a valid type
  if (
    !file.mimetype.startsWith("image/") &&
    !file.mimetype.startsWith("application/pdf")
  ) {
    return next(new ErrorResponse("Please upload an image or PDF file", 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        }MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `doc_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  // Upload file to server
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    const document = await Document.create({
      trucker: req.user.id,
      type: req.body.type,
      title: req.body.title || file.name,
      fileUrl: file.name,
      expirationDate: req.body.expirationDate,
      status: "valid",
      verificationStatus: "pending",
    });

    res.status(200).json({ success: true, data: document });
  });
});

// @desc    Delete document
// @route   DELETE /api/truckers/documents/:id
// @access  Private
exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new ErrorResponse("Document not found", 404));
  }

  // Make sure user owns document
  if (document.trucker.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to access this document", 401)
    );
  }

  await document.remove();

  res.status(200).json({ success: true, data: {} });
});
