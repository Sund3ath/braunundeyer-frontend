#!/bin/bash

# Fix duplicate imports in admin panel components
cd /home/braunundeyer-frontend/admin-panel/src/cms/components

# Remove duplicate import lines
for file in *.jsx; do
  # Create a temporary file with unique imports
  awk '!seen[$0]++ || !/^import.*API_BASE_URL.*BACKEND_URL/' "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
done

echo "Fixed duplicate imports"