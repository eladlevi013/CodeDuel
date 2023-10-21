import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeDuel API',
      version: '1.0.0',
      description: 'API documentation for CodeDuel server'
    }
  },
  apis: [path.join(__dirname, '../controllers/*.ts')]
};

const specs = swaggerJsdoc(options);

export const swaggerMiddleware = () => {
  const router = express.Router();
  router.use('/api-docs', swaggerUi.serve);
  router.get('/api-docs', swaggerUi.setup(specs));

  return router;
};
