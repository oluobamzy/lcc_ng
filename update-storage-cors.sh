#!/bin/bash

echo "Updating Firebase Storage CORS configuration..."

# Make sure the gsutil command is available
if ! command -v gsutil &> /dev/null; then
  echo "Error: gsutil command not found. Please install Google Cloud SDK first."
  echo "Visit: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

# Ask user for bucket name
echo "Please enter your Firebase Storage bucket name (e.g., your-project-id.appspot.com):"
read BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
  echo "Error: No bucket name provided."
  exit 1
fi

echo "Detected storage bucket: $BUCKET_NAME"
echo "Applying CORS configuration from cors.json..."

# Apply CORS configuration
gsutil cors set cors.json gs://$BUCKET_NAME

echo "CORS configuration updated successfully!"
echo "If you still see CORS issues, make sure to check the Firebase Storage rules as well."
