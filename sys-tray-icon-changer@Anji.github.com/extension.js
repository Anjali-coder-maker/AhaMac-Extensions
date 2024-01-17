//    Power Profile Indicator
//    GNOME Shell extension
//    @fthx 2024


// 

// SYS-tray_extension.js
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const TIMEOUT_INTERVAL = 1000; // 1 second
let tweakIndicatorInstance = null;

const TweakIndicator = GObject.registerClass(
  class TweakIndicator extends SystemIndicator {
    _init() {
      super._init();
      this._indicator = this._addIndicator();
      this._disposed = false;
      this._initPowerProfileToggle();
    }

    _initPowerProfileToggle() {
      GLib.timeout_add(GLib.PRIORITY_DEFAULT_IDLE, TIMEOUT_INTERVAL, () => {
        this._powerProfileToggle = Main.panel.statusArea.quickSettings._powerProfiles.quickSettingsItems[0];
        if (this._powerProfileToggle) {
          this._powerProfileToggle._proxy.connectObject(
            "g-properties-changed",
            this._set_icon.bind(this),
            this
          );
          this._set_icon();
        }
        if (this._disposed) return GLib.SOURCE_REMOVE;
      });
    }
  
    _set_icon() {
      if (this._disposed || !this._indicator) return; // Check if disposed
      this._indicator.icon_name = "org.gnome.tweaks-symbolic";
    }

    _destroy() {
      this._disposed = true;
      if (this._powerProfileToggle) {
        this._powerProfileToggle._proxy.disconnectObject(this);
        this._powerProfileToggle = null;
      }

      if (this._indicator) {
        this._indicator.destroy();
        this._indicator = null;
      }

      super.destroy();
    }
  }
);

export default class TweakIndicatorExtension extends Extension {
  enable() {
    if (!tweakIndicatorInstance) {
      tweakIndicatorInstance = new TweakIndicator();
      Main.panel.statusArea.quickSettings.addExternalIndicator(tweakIndicatorInstance);
    }

    this._toggleSystemComponents(false);
  }

  disable() {
    if (tweakIndicatorInstance) {
      tweakIndicatorInstance._destroy();
      tweakIndicatorInstance = null;
    }

    this._toggleSystemComponents(true);
  }

  _toggleSystemComponents(visible) {
    GLib.timeout_add(GLib.PRIORITY_DEFAULT_IDLE, TIMEOUT_INTERVAL, () => {
      try {
        Main.panel.statusArea.quickSettings._network.visible = visible;
        Main.panel.statusArea.quickSettings._system.visible = visible;
      } catch (e) {
        console.log("Error toggling system components in sys-tray-extesions", e);
      }
      return GLib.SOURCE_REMOVE;
    });
  }
}
