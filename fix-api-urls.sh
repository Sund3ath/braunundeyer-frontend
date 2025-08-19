#!/bin/bash

# Fix all hardcoded localhost URLs in admin panel components

cd /home/braunundeyer-frontend/admin-panel/src/cms/components

# Add import statement to files that don't have it yet
for file in *.jsx; do
  if ! grep -q "import { API_BASE_URL, BACKEND_URL }" "$file"; then
    if grep -q "http://localhost:3001" "$file"; then
      # Add import after the last import statement
      sed -i '/^import.*from/{ 
        h
        s/.*/import { API_BASE_URL, BACKEND_URL } from "..\/..\/config\/api";/
        H
        g
        }' "$file" 2>/dev/null || true
      
      # If no imports exist, add at the beginning after React import
      if ! grep -q "import { API_BASE_URL, BACKEND_URL }" "$file"; then
        sed -i '1a\import { API_BASE_URL, BACKEND_URL } from "../../config/api";' "$file"
      fi
    fi
  fi
done

# Replace all API URLs
find . -name "*.jsx" -exec sed -i "s|'http://localhost:3001/api|API_BASE_URL + '|g" {} \;
find . -name "*.jsx" -exec sed -i 's|"http://localhost:3001/api|`${API_BASE_URL}|g' {} \;
find . -name "*.jsx" -exec sed -i 's|`http://localhost:3001/api|`${API_BASE_URL}|g' {} \;

# Replace backend URLs for media/uploads
find . -name "*.jsx" -exec sed -i "s|'http://localhost:3001|BACKEND_URL + '|g" {} \;
find . -name "*.jsx" -exec sed -i 's|"http://localhost:3001|`${BACKEND_URL}|g' {} \;
find . -name "*.jsx" -exec sed -i 's|`http://localhost:3001|`${BACKEND_URL}|g' {} \;

# Fix template literals that were broken
find . -name "*.jsx" -exec sed -i "s|BACKEND_URL + '\${|BACKEND_URL}\${|g" {} \;
find . -name "*.jsx" -exec sed -i "s|API_BASE_URL + '\${|API_BASE_URL}\${|g" {} \;

echo "Fixed API URLs in admin panel components"