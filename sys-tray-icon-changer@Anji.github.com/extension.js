//    Power Profile Indicator
//    GNOME Shell extension
//    @fthx 2024


import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Shell from 'gi://Shell';
import {QuickSettingsMenu, SystemIndicator}  from 'resource:///org/gnome/shell/ui/quickSettings.js' ;
import * as Main from 'resource:///org/gnome/shell/ui/main.js';




const TweakIndicator = GObject.registerClass(
class TweakIndicator extends SystemIndicator {
    _init() {
        super._init();

        this._indicator = this._addIndicator();

        this._timeout = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
            this._power_profile_toggle = Main.panel.statusArea.quickSettings._powerProfiles.quickSettingsItems[0];
            if (this._power_profile_toggle) {
                this._power_profile_toggle._proxy.connectObject('g-properties-changed', this._set_icon.bind(this), this);
                this._set_icon();
            }

            return GLib.SOURCE_REMOVE;
        });
    }

    _set_icon() {
        // this._indicator.icon_name = this._power_profile_toggle.icon_name;
        this._indicator.icon_name = 'org.gnome.tweaks-symbolic';
    }

    _destroy() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }

        this._power_profile_toggle._proxy.disconnectObject(this);
        this._power_profile_toggle = null;

        this._indicator.destroy();
        this._indicator = null;

        super.destroy();
    }
});

export default class TweakIndicatorExtension {
    enable() {

       this._indicator = new TweakIndicator();
        
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
       
     
        Main.panel.statusArea.quickSettings._network.visible = false;
       
        
        Main.panel.statusArea.quickSettings._system.visible = false;
        
       
        //Main.panel.statusArea.quicksettings._volumeInput.visible = false
       }
        
       
        
    

    disable() {
     this._indicator._destroy();
     
        this._indicator = null;

       
            
            Main.panel.statusArea.quickSettings._network.visible = true;
           
           
            Main.panel.statusArea.quickSettings._system.visible = true;
            
           
           // Main.panel.statusArea.quicksettings._volumeInput.visible = true;
            
        
    }
    

    

}
