const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { schemas } = require("../../models/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/verify", validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);

router.post("/login", validateBody(schemas.registerSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/", authenticate, validateBody(schemas.loginSchema), ctrl.updateSubscriptionUser);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
