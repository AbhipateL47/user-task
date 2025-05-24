const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isActive: Joi.boolean(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  isActive: Joi.boolean(),
});

module.exports = { createUserSchema, updateUserSchema };
