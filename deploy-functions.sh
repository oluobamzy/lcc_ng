#!/bin/bash

echo "🚀 Building and deploying Firebase Functions..."
echo ""

# Navigate to functions directory
cd functions

# Build the functions
echo "Building functions..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy functions
    echo "Deploying functions to Firebase..."
    cd ..
    firebase deploy --only functions
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Functions deployed successfully!"
        echo ""
        echo "Your contact form is now ready to send emails!"
        echo "The sendEmail function is available at:"
        echo "https://us-central1-[YOUR-PROJECT-ID].cloudfunctions.net/sendEmail"
    else
        echo "❌ Deployment failed. Please check the error messages above."
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
fi
