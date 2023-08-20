const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");


const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;

const contactSсhema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({ "any.required": "missing required name field" }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({ "any.required": "missing required email field" }),

  phone: Joi.string()
    .pattern(new RegExp(phoneRegexp))
    .required()
    .messages({
      messages:
        "Invalid phone number format. Please fill a valid phone number (000) 000-0000.",
    }),

  favorite: Joi.boolean(),
});


const addUpdSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(25)
    .messages({ "any.required": "missing required name field" }),

  email: Joi.string()
    .trim()
    .email()
    .messages({ "any.required": "missing required email field" }),

  phone: Joi.string()
    .pattern(new RegExp(phoneRegexp))
    .messages({
      messages:
        "Invalid phone number format. Please fill a valid phone number (000) 000-0000.",
    }),
   
  favorite: Joi.boolean(),
});


const favoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing required field favorite" }),
});


contactSсhema.post("save", handleMongooseError);

const Contact = model("contact", contactSсhema);

const schemas = {
  addSchema,
  addUpdSchema,
  favoriteSchema
};

module.exports = { Contact, schemas};