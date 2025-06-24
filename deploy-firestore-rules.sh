#!/bin/bash

echo "Deploying Firestore rules to Firebase..."
firebase deploy --only firestore:rules

echo "Done! Firestore rules have been updated."
