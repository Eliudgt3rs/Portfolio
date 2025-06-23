/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const handleCall = async () => {
    const phoneNumber = "+254719790026";
    try {
      await navigator.clipboard.writeText(phoneNumber);
      
      window.location.href = `tel:${phoneNumber}`;
    } catch (err) {
      console.error("Failed to copy number: ", err);
      alert("Failed to copy phone number.");
    }
  };