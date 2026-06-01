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

// Whitelist of file extensions the widget extension can legitimately ship.
// Anything else in templates/ is assumed to be tooling debris (Ruflo's
// ruvector.db, .DS_Store, editor swap files, etc.) and silently skipped.
const ALLOWED_EXTENSIONS = new Set([
  ".swift",
  ".plist",
  ".entitlements",
  ".json",
  ".png",
  ".pdf",
]);

function copyFilter(src) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    // .xcassets is itself a directory bundle Xcode treats as a unit; pass through.
    if (base.endsWith(".xcassets")) return true;
    // Skip hidden dirs and node_modules — common debris.
    if (base.startsWith(".")) return false;
    if (base === "node_modules") return false;
    return true;
  }
  const ext = path.extname(src).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

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
        filter: copyFilter,
      });

      return cfg;
    },
  ]);
};
