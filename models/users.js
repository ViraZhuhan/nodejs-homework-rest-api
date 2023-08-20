const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: { type: String, default: false },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  password: Joi.string().min(4).max(25).required().messages({ "any.required": "Ошибка от Joi или другой библиотеки валидации" }),
  email: Joi.string().pattern(new RegExp(emailRegexp)).required().messages({ "any.required": "Ошибка от Joi или другой библиотеки валидации" }),
});

const loginSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const schemas = { registerSchema, loginSchema };

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User, schemas };
