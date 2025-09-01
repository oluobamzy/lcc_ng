#!/bin/bash

echo "🔧 Setting up Firebase email configuration..."
echo ""
echo "This will configure your Gmail credentials for the contact form."
echo "You'll need:"
echo "1. Your Gmail address (bunmiakinyosolaministries@gmail.com)"
echo "2. A Gmail App Password (not your regular password)"
echo ""
echo "To create a Gmail App Password:"
echo "1. Go to your Google Account settings"
echo "2. Navigate to Security > 2-Step Verification"
echo "3. Scroll down to 'App passwords'"
echo "4. Generate a new app password for 'Mail'"
echo ""

# Set the email configuration
firebase functions:config:set email.user="bunmiakinyosolaministries@gmail.com"

echo ""
echo "Now enter your Gmail App Password (16 characters, no spaces):"
read -s APP_PASSWORD

firebase functions:config:set email.password="$APP_PASSWORD"

echo ""
echo "✅ Email configuration set successfully!"
echo ""
echo "Next steps:"
echo "1. Build the functions: cd functions && npm run build"
echo "2. Deploy the functions: firebase deploy --only functions"
echo ""
