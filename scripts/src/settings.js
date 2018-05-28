var settings_definition = [{
    key: 'tabCount',
    type: 'toggle',
    description: 'Display number of tabs',
    defaultValue: true
  },
  {
    key: 'includeManager',
    type: 'toggle',
    description: 'Include tab manager',
    defaultValue: true
  },
  {
    key: 'closeManagerWhenTabSelected',
    type: 'toggle',
    description: 'Close the tab manager when a tab is clicked',
    defaultValue: true
  },
  {
    key: 'limitTabGroupSize',
    type: 'toggle',
    description: 'Limit the number of tabs in a tab group',
    defaultValue: true
  },
  {
    key: 'maxTabsPerGroup',
    type: 'slider',
    description: 'Max number of tabs',
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
    description: 'Sort groups',
    options: [{
        id: 'mostTabs',
        description: 'Most tabs'
      },
      {
        id: 'leastTabs',
        description: 'Least tabs'
      },
      {
        id: 'alphabetically',
        description: 'Alphabetically'
      },
      {
        id: 'none',
        description: 'Window order'
      }
    ],
    defaultValue: 'alphabetically'
  },
  // {
  //   key: 'winSrc',
  //   type: 'slider',
  //   defaultValue: 1
  // },
  // {
  //   key: 'col',
  //   type: 'toggle',
  //   defaultValue: true
  // },
  // {
  //   key: 'querySettings',
  //   type: 'toggle',
  //   defaultValue: true
  // }
];

class Setting {

  constructor(key, type, defaultValue, description) {
    this.key = key;
    this.type = type;
    this.defaultValue = defaultValue;
    this.description = description;

    this.value = this.defaultValue;
  }

  render() {
    throw new Error("Abstract method not implemented");
  }
}

class ToggleSetting extends Setting {
  constructor(key, defaultValue, description) {
    super(key, "toggle", defaultValue, description);
  }

  get propertyName() {
    return 'checked';
  }

  render() {
    return `<div class="tab-count-settings">
      <h3>${this.description}:</h3>
      <label class="switch">
        <input type="checkbox" id="${this.key}">
        <span class="slider"></span>
      </label>
    </div>`
  }
}

class RadioButtonSetting extends Setting {
  constructor(key, defaultValue, options, description) {
    super(key, "radio-button", defaultValue, description);
    this.options = options || [];
  }

  get propertyName() {
    return 'checked';
  }

  render() {
    console.log(this.options);
    let render = `<div class="sort-settings">
        <h3>${this.description}:</h3>`;

    for (let option of this.options) {
      render += `<div class="radio">
                    <label><input class="sort-option" type="radio" name="optradio" id="${option.id}"> ${option.description} <span class="checkmark"></span></label>
                 </div>`;
    }

    render += `</div>`;
    return render;
  }

}

class SliderSetting extends Setting {
  constructor(key, defaultValue, description) {
    super(key, "slider", defaultValue, description);
    this.min = 1;
    this.max = 10;
  }

  get propertyName() {
    return 'valueAsNumber';
  }

  render() {
    return `<div class="limit-tab-group-size">
              <h3>${this.description}:</h3>
              <span id="slider-value"></span>
              <input type="range" min="${this.min}" max="${this.max}" step="1" id="${this.key}">
            </div>`;
  }
}

class SettingMothership {

  static importSettings(iterable_settings) {
    let this_mothership = new SettingMothership();

    for (let s of iterable_settings) {
      let setting = this_mothership.createSetting(s);
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

  createSetting(d) {
    var setting;

    if (d.type === "toggle") {
      setting = new ToggleSetting(d.key, d.defaultValue, d.description);
    } else if (d.type === "radio-button") {
      setting = new RadioButtonSetting(d.key, d.defaultValue, d.options, d.description);
    } else if (d.type === "slider") {
      setting = new SliderSetting(d.key, d.defaultValue, d.description);
    } else {
      setting = new Setting(d.key, d.type, d.defaultValue, d.description);
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

  refreshView()  {
    for (let setting of this.settingsAsList) {
      $("#" + setting.key)[setting.propertyName] = setting.value;
    }
  }

  restoreDefaults() {
    for (let setting of this.settingsAsList) {
      setting.value = setting.defaultValue;
    }
  }
}

let settings_mothership = SettingMothership.importSettings(settings_definition);
settings_mothership.loadSettings();
console.log(settings_mothership);
console.log(_.map(settings_mothership.settingsAsList, (s) => s.render()));
