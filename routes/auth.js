const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: signup for users.
 *     description: Optional extended description in Markdown.
 *     responses:
 *       200:
 *         description: A JSON array of user names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
