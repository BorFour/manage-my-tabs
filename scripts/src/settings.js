var settings_definition = [{
    key: 'closeManagerWhenTabSelected',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'limitTabGroupSize',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'maxTabsPerGroup',
    type: 'slider',
    defaultValue: 5
  },
  {
    key: 'searchScope',
    type: 'radio-button',
    defaultValue: true
  },
  {
    key: 'sortMethod',
    type: 'radio-button',
    defaultValue: 'window-order'
  },
  {
    key: 'winSrc',
    type: 'slider',
    defaultValue: 1
  },
  {
    key: 'tabCount',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'includeManager',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'limitTabGroupSize',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'col',
    type: 'toggle',
    defaultValue: true
  },
  {
    key: 'querySettings',
    type: 'toggle',
    defaultValue: true
  }
];


class Setting {

  constructor(key, type, defaultValue) {
    this.key = key;
    this.type = type;
    this.defaultValue = defaultValue;
    this.value = defaultValue;
  }

  render() {
    throw new Error("Abstract method not implemented");
  }
}

class ToggleSetting extends Setting {
  constructor(key, defaultValue) {
    super(key, "toggle", defaultValue);
  }
}

class RadioButtonSetting extends Setting {
  constructor(key, defaultValue) {
    super(key, "radio-button", defaultValue);
  }
}

class SliderSetting extends Setting {
  constructor(key, defaultValue) {
    super(key, "slider", defaultValue);
  }
}

class SettingMothership {

  static importSettings(iterable_settings) {
    let this_mothership = new SettingMothership();

    for (let s of iterable_settings) {
      let setting = this_mothership.createSetting(s.key, s.type, s.defaultValue);
      this_mothership.add(setting);
    }

    return this_mothership;
  }

  constructor(settings) {
    this.settings = settings || {};
  }

  get settingsAsList() {
    return _.values(this.settings);
  }

  add(element) {
    console.assert(element instanceof Setting);
    this.settings[element.key] = element;
  }

  createSetting(key, type, defaultValue) {
    var setting;

    if (type === "toggle") {
      setting = new ToggleSetting(key, defaultValue);
    } else if (type === "radio-button") {
      setting = new RadioButtonSetting(key, defaultValue);
    } else if (type === "slider") {
      setting = new SliderSetting(key, defaultValue);
    } else {
      setting = new Setting(key, type, defaultValue);
    }

    return setting;
  }

  loadSettings() {
    let keys = _.map(this.settingsAsList, (s) => s.key);
    chrome.storage.local.get(keys, (settings) => {
      for (let setting_key in settings) {
        this.settings[setting_key].value = settings[setting_key];
      }
    });
  }
}

let settings_mothership = SettingMothership.importSettings(settings_definition);
settings_mothership.loadSettings();
console.log(settings_mothership);
