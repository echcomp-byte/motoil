const { withEntitlementsPlist } = require('@expo/config-plugins');

const ENTITLEMENT_KEY = 'com.apple.security.application-groups';

module.exports = function withAppGroup(config, options) {
  const { appGroupIdentifier } = options;
  if (!appGroupIdentifier) return config;

  return withEntitlementsPlist(config, (cfg) => {
    const existing = cfg.modResults[ENTITLEMENT_KEY];
    const groups = Array.isArray(existing) ? existing.slice() : [];
    if (!groups.includes(appGroupIdentifier)) {
      groups.push(appGroupIdentifier);
    }
    cfg.modResults[ENTITLEMENT_KEY] = groups;
    return cfg;
  });
};
