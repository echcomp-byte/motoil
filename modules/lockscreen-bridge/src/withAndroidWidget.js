const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

const META_NAME = 'android.appwidget.provider';
const META_RESOURCE = '@xml/motoil_ice_widget_info';

module.exports = function withAndroidWidget(config, options) {
  const { androidWidgetReceiverClass } = options;
  if (!androidWidgetReceiverClass) return config;

  return withAndroidManifest(config, (cfg) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);

    app.receiver = app.receiver || [];
    const already = app.receiver.find(
      (r) => r.$ && r.$['android:name'] === androidWidgetReceiverClass,
    );
    if (already) return cfg;

    app.receiver.push({
      $: {
        'android:name': androidWidgetReceiverClass,
        'android:exported': 'false',
        'android:label': 'MotoIL ICE',
      },
      'intent-filter': [
        {
          action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }],
        },
      ],
      'meta-data': [
        {
          $: { 'android:name': META_NAME, 'android:resource': META_RESOURCE },
        },
      ],
    });

    return cfg;
  });
};
