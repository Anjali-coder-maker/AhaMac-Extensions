

import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Calendar from 'resource:///org/gnome/shell/ui/calendar.js';
import * as DateMenu from 'resource:///org/gnome/shell/ui/dateMenu.js';

const FreezableBinLayout = GObject.registerClass(
    class FreezableBinLayout extends Clutter.BinLayout {
        _init() {
            super._init();
    
            this._frozen = false;
            this._savedWidth = [NaN, NaN];
            this._savedHeight = [NaN, NaN];
        }
    
        set frozen(v) {
            if (this._frozen === v)
                return;
    
            this._frozen = v;
            if (!this._frozen)
                this.layout_changed();
        }
    
        vfunc_get_preferred_width(container, forHeight) {
            if (!this._frozen || this._savedWidth.some(isNaN))
                return super.vfunc_get_preferred_width(container, forHeight);
            return this._savedWidth;
        }
    
        vfunc_get_preferred_height(container, forWidth) {
            if (!this._frozen || this._savedHeight.some(isNaN))
                return super.vfunc_get_preferred_height(container, forWidth);
            return this._savedHeight;
        }
    
        vfunc_allocate(container, allocation) {
            super.vfunc_allocate(container, allocation);
    
            let [width, height] = allocation.get_size();
            this._savedWidth = [width, width];
            this._savedHeight = [height, height];
        }
    });

    export default class NotificationExtension extends Extension {

    enable() {
        // Create a panel button
        
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
            
        
        const icon = new St.Icon({
            icon_name: 'notification-symbolic',
            icon_size:16,
            style_class: 'system-status-icon',
        });

        this._indicator.add_child(icon);

        let layout = new FreezableBinLayout();
        let bin = new St.Widget({
            layout_manager: layout , 
            width : 400,
            height : 160,
       });
        // For some minimal compatibility with PopupMenuItem
        bin._delegate = this;
        this._indicator.menu.box.add_child(bin);

        let hbox = new St.BoxLayout({name: 'calendarArea'});
        bin.add_actor(hbox);

        this._messageList = new Calendar.CalendarMessageList();
        
        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator, 0, 'right');

        this._indicator.connect('button-press-event',() => {
          
        //    Main.notify('hy','by');     // Custom notification checking
            hbox.add_child(this._messageList);
      });
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
 }
}

