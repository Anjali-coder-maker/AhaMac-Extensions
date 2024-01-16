import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Identify the existing system tray icon
        let systemTray = Main.panel.statusArea.quickSettings;

        // Remove the existing system tray icon
        systemTray.container.hide();

        // Create a new panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the new system tray icon to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        // Identify the existing system tray icon
        let systemTray = Main.panel.statusArea.quickSettings;

        // Show the original system tray icon
        systemTray.container.show();

        // Remove the new system tray icon
        this._indicator?.destroy();
        this._indicator = null;
    }
}
