#!/bin/bash

echo "Deploying Firebase Storage rules..."

# Deploy only storage rules
firebase deploy --only storage

echo "Storage rules have been updated!"
