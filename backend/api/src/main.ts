import fs, { read } from 'fs';
import path from 'path';
import { prisma } from "./lib/prismaclient";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.API_PORT!;

async function loadRoutes(dir: string, baseRoute: string = '') {  
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if(file.isDirectory()) {
      await loadRoutes(fullPath, path.join(baseRoute, file.name));
    } else {
      const routeModule = await import(`file://${fullPath}`);

      const fileName = file.name.split('.')[0];
      const defaultPath = path.join(baseRoute, fileName === 'index' ? '' : fileName!);
      
      const finalPath = (typeof routeModule.pathOverride === 'string')
        ? routeModule.pathOverride
        : `/${defaultPath.replace(/\\/g, '/')}`;

      if(routeModule.default && !routeModule.exclude) {
        app.use(finalPath, routeModule.default);
        console.log(`Runtime code ${file.parentPath}\\${file.name} loaded as ${finalPath}`);
      }
    }
  }
}

loadRoutes(path.join(__dirname, 'routes')).then(() => {
  console.log("INFO: Finished loading routes.");

  app.use('/static', express.static(path.join(__dirname, '../public')));

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
})