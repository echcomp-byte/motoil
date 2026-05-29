const { createRunOncePlugin } = require('@expo/config-plugins');
const withAppGroup = require('./src/withAppGroup');
const withAndroidWidget = require('./src/withAndroidWidget');

const pkg = require('./package.json');

const DEFAULT_APP_GROUP = 'group.com.echcomp.motoil.ice';

function withLockscreenBridge(config, props) {
  const options = {
    appGroupIdentifier: DEFAULT_APP_GROUP,
    androidWidgetReceiverClass: null,
    ...(props || {}),
  };

  let next = withAppGroup(config, options);
  next = withAndroidWidget(next, options);
  return next;
}

module.exports = createRunOncePlugin(withLockscreenBridge, pkg.name, pkg.version);
