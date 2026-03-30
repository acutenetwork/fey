const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Enable package.json "exports" field resolution
config.resolver.unstable_enablePackageExports = true;

// Make Metro aware of the library source outside this project
config.watchFolders = [monorepoRoot];

// Ensure node_modules resolve correctly — app's node_modules first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Deduplicate React — force all imports to resolve to the app's copy
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "react-native-svg": path.resolve(projectRoot, "node_modules/react-native-svg"),
};

module.exports = config;
