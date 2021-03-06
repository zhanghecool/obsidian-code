import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian';
import { type } from 'os';

interface MyPluginSettings {
  mySetting: string;
  hint: boolean;
  snippet: boolean;
  execute: boolean;
  format: boolean;
  copy: boolean;
  picture: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
  hint: false,
  snippet: false,
  execute: false,
  format: false,
  copy: false,
  picture: false,
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log('loading plugin');

    await this.loadSettings();

    this.addRibbonIcon('dice', 'Sample Plugin', () => {
      new Notice('This is a notice!');
    });

    this.addStatusBarItem().setText('Status Bar Text');

    this.addCommand({
      id: 'open-sample-modal',
      name: 'Open Sample Modal',
      // callback: () => {
      // 	console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new SampleModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log('codemirror', cm);
    });

    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      console.log('click', evt);
    });

    this.registerInterval(
      window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)
    );
  }

  onunload() {
    console.log('unloading plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText('Woah!');
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for code plugin.' });

    // new Setting(containerEl)
    //   .setName('Setting #1')
    //   .setDesc("It's a secret")
    //   .addText((text) =>
    //     text
    //       .setPlaceholder('Enter your secret')
    //       .setValue('')
    //       .onChange(async (value) => {
    //         console.log('Secret: ' + value);
    //         this.plugin.settings.mySetting = value;
    //         await this.plugin.saveSettings();
    //       })
    //   );
    new Setting(containerEl)
      .setName('Code hint')
      .setDesc('Code hint')
      .addToggle((toggel) => {
        toggel.setValue(false).onChange(async (value) => {
          console.info('Toggle is ', value);
          this.plugin.settings.hint = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
