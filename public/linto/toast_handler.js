Polymer("toast-handler", {

    text: null,

    undo_hidden_callback_opt: '',
    undo_hidden_display: 'none',

    textChanged: function() {
        var _this = this;

        if (_this.text) {
            _this.$.toast.dismiss();

            window.setTimeout(function() {
                _this.undo_hidden_display = (_this.undo_hidden_callback_opt == '') ? 'none' : 'block';

                _this.$.toast.show();
            }, 400);
        }
    }

});
