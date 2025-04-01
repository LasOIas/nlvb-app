const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const validExtensions = [".js", ".jsx", ".ts", ".tsx"];
const importRegex = /import\s+[^'"]+['"]([^'"]+)['"]/g;

function getAllFiles(dir) {
  return fs.readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    return fs.statSync(fullPath).isDirectory()
      ? getAllFiles(fullPath)
      : fullPath;
  });
}

function isRelative(importPath) {
  return importPath.startsWith(".");
}

function existsCaseSensitive(filePath) {
  const segments = filePath.split(path.sep);
  let currentPath = path.isAbsolute(filePath) ? path.parse(filePath).root : "";

  for (const segment of segments) {
    if (!fs.existsSync(currentPath)) return false;
    const entries = fs.readdirSync(currentPath);
    if (!entries.includes(segment)) return false;
    currentPath = path.join(currentPath, segment);
  }

  return fs.existsSync(currentPath);
}

function checkImports() {
  const files = getAllFiles(projectRoot).filter((f) =>
    validExtensions.includes(path.extname(f))
  );

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let match;

    while ((match = importRegex.exec(content))) {
      const importPath = match[1];

      if (isRelative(importPath)) {
        const fullImportPath = path.resolve(path.dirname(file), importPath);
        const possibleExtensions = ["", ".js", ".jsx", ".ts", ".tsx"];

        const exists = possibleExtensions.some((ext) =>
          existsCaseSensitive(fullImportPath + ext)
        );

        if (!exists) {
          console.warn(
            `❌ Import in ${file} -> '${importPath}' could break on Vercel (case mismatch or missing file)`
          );
        }
      }
    }
  }

  console.log("✅ Import check complete.");
}

checkImports();
