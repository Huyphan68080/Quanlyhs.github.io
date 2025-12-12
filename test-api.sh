#!/bin/bash
# Script để xác nhận API endpoint

echo "Testing API endpoint..."
echo "API URL: $1"

curl -X POST "$1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -v
