const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Enable package.json "exports" field resolution
config.resolver.unstable_enablePackageExports = true;

// Make Metro aware of the library source outside this project
config.watchFolders = [monorepoRoot];

// Only resolve from the app's node_modules — never the library's
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

// Block Metro from crawling the library's node_modules entirely
config.resolver.blockList = [
  new RegExp(path.resolve(monorepoRoot, "node_modules").replace(/[/\\]/g, "[/\\\\]") + ".*"),
];

module.exports = config;
