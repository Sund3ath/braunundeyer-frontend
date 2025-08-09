import fs from 'fs';
import path from 'path';

// Fix async/await in route files
const routesDir = './src/routes';
const files = fs.readdirSync(routesDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    let content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    
    // Add await to db.prepare() calls
    content = content.replace(/(\s+)(const \w+ = db\.prepare\([^)]+\)\.(get|all|run)\([^)]*\))/g, '$1const result = await db.prepare($2');
    content = content.replace(/(\s+)(db\.prepare\([^)]+\)\.(get|all|run)\([^)]*\))/g, '$1await db.prepare($2');
    
    // Fix specific patterns
    content = content.replace(/const user = db\.prepare/g, 'const user = await db.prepare');
    content = content.replace(/const project = db\.prepare/g, 'const project = await db.prepare');
    content = content.replace(/const existing = db\.prepare/g, 'const existing = await db.prepare');
    content = content.replace(/const session = db\.prepare/g, 'const session = await db.prepare');
    content = content.replace(/const media = db\.prepare/g, 'const media = await db.prepare');
    content = content.replace(/const content = db\.prepare/g, 'const content = await db.prepare');
    content = content.replace(/const users = db\.prepare/g, 'const users = await db.prepare');
    content = content.replace(/const projects = db\.prepare/g, 'const projects = await db.prepare');
    content = content.replace(/const \{ total \} = db\.prepare/g, 'const { total } = await db.prepare');
    content = content.replace(/const result = db\.prepare/g, 'const result = await db.prepare');
    content = content.replace(/const adminExists = db\.prepare/g, 'const adminExists = await db.prepare');
    content = content.replace(/const oldProject = db\.prepare/g, 'const oldProject = await db.prepare');
    content = content.replace(/const updatedProject = db\.prepare/g, 'const updatedProject = await db.prepare');
    
    // Fix standalone db.prepare().run() calls
    content = content.replace(/(\n\s+)db\.prepare\(/g, '$1await db.prepare(');
    
    fs.writeFileSync(path.join(routesDir, file), content);
    console.log(`Fixed ${file}`);
  }
});

// Fix middleware
const middlewareDir = './src/middleware';
const middlewareFiles = fs.readdirSync(middlewareDir);

middlewareFiles.forEach(file => {
  if (file === 'auth.middleware.js') {
    let content = fs.readFileSync(path.join(middlewareDir, file), 'utf8');
    content = content.replace(/const session = db\.prepare/g, 'const session = await db.prepare');
    fs.writeFileSync(path.join(middlewareDir, file), content);
    console.log(`Fixed ${file}`);
  }
});

console.log('Async/await fixes applied');