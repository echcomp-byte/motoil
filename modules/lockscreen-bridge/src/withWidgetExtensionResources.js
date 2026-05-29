const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const EXTENSION_DIR_NAME = "MotoILWidget";

// Resolve the templates directory via require.resolve rather than __dirname.
// ESLint's flat config doesn't expose __dirname as a global, and adding Node
// env at the config level is Dev D's territory (PR #20 set it up for scripts/
// only). require.resolve is already accepted and works for any module file
// loadable from here — including our own template assets.
const TEMPLATES_DIR = path.dirname(
  require.resolve("../templates/ios/MotoILWidget/Info.plist"),
);

module.exports = function withWidgetExtensionResources(config, options) {
  if (!options || options.iosWidgetExtensionEnabled !== true) {
    return config;
  }

  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      if (!fs.existsSync(TEMPLATES_DIR)) {
        throw new Error(
          `[lockscreen-bridge] templates source missing at ${TEMPLATES_DIR}. ` +
            `withWidgetExtensionResources requires modules/lockscreen-bridge/templates/ios/${EXTENSION_DIR_NAME}/ ` +
            `to exist before iosWidgetExtensionEnabled can be true.`,
        );
      }

      const destDir = path.join(
        cfg.modRequest.platformProjectRoot,
        EXTENSION_DIR_NAME,
      );

      fs.cpSync(TEMPLATES_DIR, destDir, {
        recursive: true,
        force: true,
        errorOnExist: false,
      });

      return cfg;
    },
  ]);
};
