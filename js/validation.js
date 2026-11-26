(() => {
  const form = document.getElementById("feedbackForm");
  const dialog = document.getElementById("feedback-success");
  const closeButton = document.getElementById("feedback-success-close");
  const message = document.getElementById("feedback-message");
  const name = document.getElementById("feedback-name");
  const nameError = document.getElementById("feedback-name-error");

  if (
    !(form instanceof HTMLFormElement) ||
    !(dialog instanceof HTMLDialogElement) ||
    !(closeButton instanceof HTMLButtonElement) ||
    !(message instanceof HTMLTextAreaElement) ||
    !(name instanceof HTMLInputElement) ||
    !(nameError instanceof HTMLElement)
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
  const nameLengthError = "Ім’я має містити щонайменше 2 символи.";
  const nameRequiredError = "Будь ласка, введіть ім’я.";
  const updateNameValidity = (updateState = true) => {
    const trimmedName = name.value.trim();
    const error =
      trimmedName.length === 0
        ? nameRequiredError
        : trimmedName.length < 2
          ? nameLengthError
          : "";

    name.setCustomValidity(error);

    if (updateState) {
      const isValid = error === "";
      name.setAttribute("aria-invalid", String(!isValid));
      nameError.textContent = error || nameRequiredError;
      nameError.classList.toggle("hidden", isValid);
    }
  };

  updateNameValidity(false);
  name.addEventListener("input", () => updateNameValidity());
  name.addEventListener("change", () => updateNameValidity());
  name.addEventListener("blur", () => updateNameValidity());
  name.addEventListener("invalid", () => updateNameValidity());

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

  form.addEventListener("reset", () => {
    message.setCustomValidity("");
    name.setCustomValidity("");
    nameError.textContent = nameRequiredError;
    nameError.classList.add("hidden");
    form.querySelectorAll("input, textarea").forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
    name.setAttribute("aria-invalid", "false");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateNameValidity();
    updateMessageValidity();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    form.reset();
    dialog.close();
  });

  dialog.addEventListener("close", () => {
    submitButton.focus();
  });
})();
