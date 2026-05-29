const { withXcodeProject } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

const EXTENSION_NAME = "MotoILWidget";
const EXTENSION_DIR_NAME = "MotoILWidget";
const EXTENSION_BUNDLE_SUFFIX = ".widget";
const FRAMEWORKS = ["WidgetKit.framework", "SwiftUI.framework"];

const REQUIRED_FILES_HINT = [
  `ios/${EXTENSION_DIR_NAME}/Info.plist`,
  `ios/${EXTENSION_DIR_NAME}/${EXTENSION_NAME}.entitlements`,
  `ios/${EXTENSION_DIR_NAME}/${EXTENSION_NAME}.swift`,
];

// Templates live at ../templates/ios/MotoILWidget/. Step 3 enhancement will
// wire withDangerousMod to copy them into cfg.modRequest.platformProjectRoot
// at prebuild time. See modules/lockscreen-bridge/templates/README.md.

function findExtensionTargetKey(project, name) {
  const targets = project.pbxNativeTargetSection();
  for (const key of Object.keys(targets)) {
    const t = targets[key];
    if (t && t.name === name) return key;
  }
  return null;
}

function warnIfSwiftMissing(projectRoot) {
  const missing = REQUIRED_FILES_HINT.filter(
    (rel) => !fs.existsSync(path.join(projectRoot, rel)),
  );
  if (missing.length === 0) return;
  console.warn(
    `[lockscreen-bridge] Widget extension target registered, but these expected files are missing:\n` +
      missing.map((m) => `  - ${m}`).join("\n") +
      `\nThe Xcode project will reference an empty target. Step 3 of the lockscreen` +
      ` workstream is expected to land them. Until then \`xcodebuild\` will fail` +
      ` on the extension target — main app builds remain unaffected.`,
  );
}

function addExtensionTarget(project, extensionName, extensionBundleId) {
  const existingKey = findExtensionTargetKey(project, extensionName);
  if (existingKey) return null;

  const target = project.addTarget(
    extensionName,
    "app_extension",
    extensionName,
    extensionBundleId,
  );

  project.addBuildPhase(
    [],
    "PBXSourcesBuildPhase",
    "Sources",
    target.uuid,
  );

  project.addBuildPhase(
    FRAMEWORKS,
    "PBXFrameworksBuildPhase",
    "Frameworks",
    target.uuid,
  );

  project.addBuildPhase(
    [],
    "PBXResourcesBuildPhase",
    "Resources",
    target.uuid,
  );

  const sourceGroup = project.pbxCreateGroup(extensionName, extensionName);
  const mainGroupKey =
    project.getFirstProject().firstProject.mainGroup;
  project.addToPbxGroup(sourceGroup, mainGroupKey);

  return target;
}

function embedExtensionInMainApp(project, extensionTarget) {
  const mainTarget = project.getFirstTarget();
  if (!mainTarget) {
    throw new Error(
      "[lockscreen-bridge] could not locate main app target to embed widget extension into",
    );
  }

  const embedPhase = project.addBuildPhase(
    [],
    "PBXCopyFilesBuildPhase",
    "Embed App Extensions",
    mainTarget.uuid,
    "app_extension",
  );

  project.addToPbxBuildFileSection({
    uuid: extensionTarget.uuid,
    pbxNativeTarget: {
      productReference: extensionTarget.pbxNativeTarget?.productReference,
    },
    fileRef: extensionTarget.pbxNativeTarget?.productReference,
    isa: "PBXBuildFile",
    settings: { ATTRIBUTES: ["RemoveHeadersOnCopy"] },
  });

  return embedPhase;
}

module.exports = function withWidgetExtensionTarget(config, options) {
  if (!options || options.iosWidgetExtensionEnabled !== true) {
    return config;
  }

  return withXcodeProject(config, (cfg) => {
    const mainBundleId = cfg.ios?.bundleIdentifier;
    if (!mainBundleId) {
      throw new Error(
        "[lockscreen-bridge] cfg.ios.bundleIdentifier is required to derive the widget extension bundle id",
      );
    }
    const extensionBundleId = `${mainBundleId}${EXTENSION_BUNDLE_SUFFIX}`;

    warnIfSwiftMissing(cfg.modRequest.projectRoot);

    const target = addExtensionTarget(
      cfg.modResults,
      EXTENSION_NAME,
      extensionBundleId,
    );

    if (target) {
      embedExtensionInMainApp(cfg.modResults, target);
    }

    return cfg;
  });
};
