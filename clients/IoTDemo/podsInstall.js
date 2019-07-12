#!/usr/bin/env node
const { execSync } = require('child_process');

execSync('cd ios && pod install');
