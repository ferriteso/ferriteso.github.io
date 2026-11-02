// GitHub Pages has no rewrite rules: give each route its own index.html so it returns 200,
// and keep 404.html as the app too so unknown paths render the in-app "Open circuit" page.
import { copyFileSync, mkdirSync } from 'node:fs'
for (const route of ['clusters', 'hardware', 'company']) {
  mkdirSync(`dist/${route}`, { recursive: true })
  copyFileSync('dist/index.html', `dist/${route}/index.html`)
}
copyFileSync('dist/index.html', 'dist/404.html')
