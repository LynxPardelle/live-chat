/**
 * Validation middleware using express-validator
 * Defines validation rules for message-related requests
 */
const { body, query, param } = require("express-validator");

/**
 * Validation rules for creating a message
 */
const validateCreateMessage = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Username can only contain letters, numbers, and spaces"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Message content must be between 1 and 500 characters")
    .custom((value) => {
      if (value.trim().length === 0) {
        throw new Error("Message cannot be empty or contain only whitespace");
      }
      return true;
    }),
];

/**
 * Validation rules for pagination parameters
 */
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

/**
 * Validation rules for recent messages limit
 */
const validateRecentLimit = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
];

/**
 * Validation rules for message ID parameter
 */
const validateMessageId = [
  param("id")
    .notEmpty()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid message ID format"),
];

/**
 * General error handler for validation middleware
 * Can be used after validation rules to handle errors
 */
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errorDetails,
    });
  }

  next();
};

module.exports = {
  validateCreateMessage,
  validatePagination,
  validateRecentLimit,
  validateMessageId,
  handleValidationErrors,
};
