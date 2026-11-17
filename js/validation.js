(() => {
  const form = document.getElementById("feedbackForm");
  const dialog = document.getElementById("feedback-success");
  const closeButton = document.getElementById("feedback-success-close");
  const message = document.getElementById("feedback-message");

  if (
    !(form instanceof HTMLFormElement) ||
    !(dialog instanceof HTMLDialogElement) ||
    !(closeButton instanceof HTMLButtonElement) ||
    !(message instanceof HTMLTextAreaElement)
  ) {
    console.error("Feedback dialog setup failed: required form or dialog elements are missing.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  if (!(submitButton instanceof HTMLButtonElement)) {
    console.error("Feedback dialog setup failed: the form submit button is missing.");
    return;
  }

  const messageLengthError =
    "Повідомлення має містити щонайменше 10 символів; пробіли на початку й у кінці не враховуються.";
  const updateMessageValidity = () => {
    message.setCustomValidity(
      message.value.trim().length >= 10 ? "" : messageLengthError,
    );
  };

  message.addEventListener("input", updateMessageValidity);
  message.addEventListener("change", updateMessageValidity);
  message.addEventListener("blur", updateMessageValidity);
  message.addEventListener("invalid", updateMessageValidity);

  form.querySelectorAll("input, textarea").forEach((field) => {
    const updateInvalidState = () => {
      field.setAttribute("aria-invalid", String(!field.validity.valid));
    };

    field.addEventListener("invalid", () => {
      field.setAttribute("aria-invalid", "true");
    });
    field.addEventListener("input", updateInvalidState);
    field.addEventListener("change", updateInvalidState);
    field.addEventListener("blur", updateInvalidState);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateMessageValidity();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("close", () => {
    submitButton.focus();
  });
})();
