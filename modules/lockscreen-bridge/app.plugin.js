const { createRunOncePlugin } = require('@expo/config-plugins');
const withAppGroup = require('./src/withAppGroup');
const withAndroidWidget = require('./src/withAndroidWidget');
const withWidgetExtensionResources = require('./src/withWidgetExtensionResources');
const withWidgetExtensionTarget = require('./src/withWidgetExtensionTarget');

const pkg = require('./package.json');

const DEFAULT_APP_GROUP = 'group.com.echcomp.motoil.ice';

function withLockscreenBridge(config, props) {
  const options = {
    appGroupIdentifier: DEFAULT_APP_GROUP,
    androidWidgetReceiverClass: null,
    iosWidgetExtensionEnabled: false,
    ...(props || {}),
  };

  let next = withAppGroup(config, options);
  next = withAndroidWidget(next, options);
  // Resources mod runs BEFORE the Xcode-project mod so files exist on disk
  // before withWidgetExtensionTarget references them (and the warnIfSwiftMissing
  // check inside it returns clean).
  next = withWidgetExtensionResources(next, options);
  next = withWidgetExtensionTarget(next, options);
  return next;
}

module.exports = createRunOncePlugin(withLockscreenBridge, pkg.name, pkg.version);
