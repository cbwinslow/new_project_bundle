#!/bin/bash

#
# Bundle Download Examples
# 
# This file contains practical examples of using the bundle downloader system
#

# Example 1: Download CI/CD workflows for a new project
echo "Example 1: Setting up CI/CD workflows"
echo "======================================"
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Example 2: Get all GitHub configuration for a new repository
echo ""
echo "Example 2: Complete GitHub setup"
echo "================================"
npx github:cbwinslow/new_project_bundle bundle-downloader download all-github

# Example 3: Download just Docker files
echo ""
echo "Example 3: Docker configuration"
echo "=============================="
npx github:cbwinslow/new_project_bundle bundle-downloader download docker

# Example 4: Get all documentation templates
echo ""
echo "Example 4: Documentation templates"
echo "=================================="
npx github:cbwinslow/new_project_bundle bundle-downloader download all-templates --output ./docs

# Example 5: Download Node.js package files
echo ""
echo "Example 5: Node.js project setup"
echo "================================"
npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs

# Example 6: Interactive mode (commented out as it requires user input)
# echo ""
# echo "Example 6: Interactive selection"
# echo "==============================="
# npx github:cbwinslow/new_project_bundle bundle-downloader

# Example 7: Using shell script instead of Node.js
echo ""
echo "Example 7: Using shell script"
echo "============================="
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh | \
  bash -s -- github-core

# Example 8: Download from a fork
echo ""
echo "Example 8: Download from custom repository"
echo "=========================================="
# NPB_REPO=myuser/my-fork ./scripts/download-bundle.sh docker

# Example 9: List all available bundles
echo ""
echo "Example 9: List available bundles"
echo "================================="
npx github:cbwinslow/new_project_bundle bundle-downloader list

echo ""
echo "All examples completed!"
