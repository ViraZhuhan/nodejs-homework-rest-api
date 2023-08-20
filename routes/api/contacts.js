const express = require("express");

const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", authenticate, isValidId, ctrl.deleteById);

router.put("/:id", authenticate, isValidId, validateBody(schemas.addUpdSchema), ctrl.updateById);

router.patch("/:id/favorite", authenticate, isValidId, validateBody(schemas.favoriteSchema), ctrl.updateStatusContact);

router.get("/:id", isValidId, ctrl.getById);


module.exports = router;
