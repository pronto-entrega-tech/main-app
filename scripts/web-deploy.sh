#!/usr/bin/env bash

EXCLUDED=".env, .expo, .expo-shared, .vscode, https_cert, pages, src, styles, .eslintignore, .eslintrc.json, .git, .gitignore, .prettierrc, app.json, App.tsx, babel.config.js, next-env.d.ts, next-force-swc.js, next.config.js, server.js, tsconfig.json, web-deploy.sh, yarn.lock"
rsycn -az --delete --exclude="${EXCLUDED}" ./ "${DEPLOY_USER}@${DEPLOY_SERVER}:deploy-cache"

ssh "${DEPLOY_USER}@${DEPLOY_SERVER}" "bash ./deploy.sh"
