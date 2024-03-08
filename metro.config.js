const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig('./');
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
