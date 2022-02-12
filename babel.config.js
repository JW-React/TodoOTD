module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          "moduleName": "dotenv",
          "path": ".env",
          "safe": false,
          "allowUndefined": true,
        }
      ],
    ],
  };
};
