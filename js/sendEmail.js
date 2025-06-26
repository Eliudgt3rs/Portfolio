// sendEmail.js
function sendEmailViaClient(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  // Basic validation
  if (!name || !email || !phone || !message) {
    showError("Please fill in all fields.");
    return;
  }

  // Use EmailJS (client-side)
  emailjs.send("service_8mq5ecx", "template_ppaej1v", {
    from_name: name,
    from_email: email,
    phone: phone,
    message: message,
  })
  .then(() => {
    showSuccess();
    clearForm();
  })
  .catch(() => {
    showError("Something went wrong. Please try WhatsApp.");
  });
}

function showSuccess() {
  document.getElementById("submitSuccessMessage").classList.remove("d-none");
  document.getElementById("submitErrorMessage").classList.add("d-none");
}

function showError(msg) {
  const errorBox = document.getElementById("submitErrorMessage");
  errorBox.classList.remove("d-none");
  errorBox.innerText = msg;
  document.getElementById("submitSuccessMessage").classList.add("d-none");
}

function clearForm() {
  document.getElementById("contactForm").reset();
}
