Polymer({

  is: 'polymer-spinner',

  properties: {
    opened: {
      type: Boolean,
      value: true,
    },
  },

  toggle() {
    if (this.opened) {
      this.async(() => {
        this.opened = !this.opened;
      }, 400);
    } else {
      this.opened = !this.opened;
    }
  },

});
