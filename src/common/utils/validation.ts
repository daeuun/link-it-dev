import * as Joi from 'joi';

export const validation: Joi.Schema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').required(),
  SERVER_PORT: Joi.number().required(),

  // Swagger
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
}).options({
  abortEarly: true,
});