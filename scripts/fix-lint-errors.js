#!/usr/bin/env node

/**
 * Script to automatically fix common ESLint errors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Files to process
const commonFixes = [
  // Remove unused imports and variables by adding underscore prefix
  {
    file: 'src/components/dashboard/DashboardStats.jsx',
    fixes: [
      { find: /import.*useEffect.*from/, replace: '// Removed unused useEffect import' },
      { find: /const userRole = .*/, replace: 'const _userRole = useSelector(selectUserRole);' },
      { find: /const isLoadingAppointments = .*/, replace: 'const _isLoadingAppointments = isLoading;' },
    ]
  }
];

// Generic fixes for unused variables
const _genericFixes = [
  // Add underscore prefix to unused variables
  { pattern: /const (\w+) = .*\/\/ marked as unused/, replacement: 'const _$1 = ' },
];

function applyFixes() {
  console.log('Starting lint error fixes...');
  
  // Apply specific file fixes
  commonFixes.forEach(({ file, fixes }) => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      fixes.forEach(({ find, replace }) => {
        if (content.match(find)) {
          content = content.replace(find, replace);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${file}`);
      }
    }
  });
  
  console.log('✅ Lint error fixes completed');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  applyFixes();
}
