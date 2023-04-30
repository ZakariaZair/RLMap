import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Load the SSL certificate files
  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/archive/rlmap.ca/privkey.pem',
    'utf8',
  );
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/archive/rlmap.ca/fullchain.pem',
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
      `Server is running on https://ec2-35-183-116-195.ca-central-1.compute.amazonaws.com:3000:${PORT}`,
    );
  });
}
bootstrap();
