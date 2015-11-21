var PolymerLayout = function() {
    this.currentLayout = null;
};

// layout[String]
// opt[Object] one-level deep
// plugIn[Array] placeholder
// rerender[Array]

PolymerLayout.prototype.render = function(layout, opt, plugIn, rerender) {
    if (document.querySelector('mwc-layout[id="' + layout + '"]')) {
        if (opt && Object.prototype.toString.call(opt) == "[object Object]") {
            document.querySelector('mwc-layout[id="' + layout + '"]').render(opt, (Object.prototype.toString.call(plugIn) == "[object Array]" ? plugIn : []));
        } else {
            console.log("opt[object] required");
        }

        if (this.currentLayout != layout) {
            if (this.currentLayout) {
                document.querySelector('mwc-layout[id="' + this.currentLayout + '"]').active = false
            }

            document.querySelector('mwc-layout[id="' + layout + '"]').active = true;

            this.currentLayout = layout;
        } else {
            if (opt && Object.prototype.toString.call(opt) == "[object Object]") {
                if (rerender && Object.prototype.toString.call(rerender) == "[object Array]") {
                    document.querySelector('mwc-layout[id="' + layout + '"]').rerender(rerender);
                } else {
                    document.querySelector('mwc-layout[id="' + layout + '"]').rerender(Object.keys(opt));
                }
            } else {
                console.log("opt[object] required");
            }
        }
    }
};

mwcLayout = new PolymerLayout();
