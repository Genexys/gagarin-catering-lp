(function () {
    var validator = new FormValidator('consult-form', [{
        name: 'name',
        display: 'required',
        rules: 'required'
    }, {
        name: 'phone',
        display: 'required',
        rules: 'required'
    }], function(errors, event) {
        if (errors.length > 0) {
            // Show the errors

            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (event) {
                event.returnValue = false;
            }
        }
    });
})();