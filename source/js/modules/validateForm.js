export const validateForm = function (form, configValidate) {

  const constraints = configValidate;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleFormSubmit(form);
  });

  const inputs = form.querySelectorAll("input, textarea, select");

  for (let i = 0; i < inputs.length; ++i) {

    inputs.item(i).addEventListener("change", function (ev) {
      const errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name]);
    });
  }

  function handleFormSubmit(form, input) {
    var errors = validate(form, constraints);
    showErrors(form, errors || {});
    if (!errors) {
      showSuccess();
    }
  }

  function showErrors(form, errors) {
    form.querySelectorAll("input[name], select[name]").forEach(function (input) {
      showErrorsForInput(input, errors && errors[input.name]);
    });
  }

  function showErrorsForInput(input, errors) {

    var formGroup = closestParent(input.parentElement, "input-wrapper");

    resetFormGroup(formGroup);
    if (errors) {
      formGroup.classList.add("input-wrapper--error");
    } else {
      formGroup.classList.add("input-wrapper--success");
    }
  }

  function closestParent(child, className) {

    if (!child || child === document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    } else {
      return closestParent(child.parentNode, className);
    }
  }

  function resetFormGroup(formGroup) {
    formGroup.classList.remove("input-wrapper--error");
    formGroup.classList.remove("input-wrapper--success");
  }

  async function showSuccess() {
    const data = new FormData(form);

   await fetch(form.getAttribute('action'), {
      method: form.getAttribute('method'),
      body: data,
    })
      .then(async response => {
        return response.text();
      })
      .then(async text => {
        $.fancybox.close();

        form.reset();

        $.fancybox.open({
          src: '#thanx-modal',
          type: 'inline',
        });

        setTimeout(() => {
          $.fancybox.close();
        }, 2000);
      }).catch(error => {
      console.error(error);
    });

    // $.ajax({
    //     type: form.getAttribute('method'),
    //     url: form.getAttribute('method'),
    //     dataType: 'text',
    //     data: data,
    //     success: function success(data) {
    //         $.fancybox.close()
    //
    //         $.fancybox.open({
    //             src: '#thanx-modal',
    //             type: 'inline'
    //         });
    //
    //         setTimeout(() => {
    //             $.fancybox.close()
    //         }, 2000)
    //
    //     },
    //     error: function error(xhr, ajaxOptions, thrownError) {
    //         console.log(xhr.status);
    //         console.log(thrownError);
    //     }
    // });
  }
};
