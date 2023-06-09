import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS
  app.enableCors();

  // Load the SSL certificate files
  const privateKey = fs.readFileSync(
    '/home/ec2-user/RLMap/server/certificates/privkey.pem',
    'utf8',
  );
  const certificate = fs.readFileSync(
    '/home/ec2-user/RLMap/server/certificates/fullchain.pem',
    'utf8',
  );

  const credentials = { key: privateKey, cert: certificate };

  // Create an HTTPS server with the SSL certificates and NestJS app
  const httpsServer = https.createServer(credentials, server);

  // Start the HTTPS server
  const PORT = process.env.PORT || 3000;
  await app.init();
  httpsServer.listen(PORT, () => {
    console.log(
      `Server is running on https://api.rlmap.ca:${PORT}`,
    );
  });
}
bootstrap();
