/**
 * form-handler.js — Contact Form Submission to Firestore
 * Handles form validation, submission, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Disable submit button and show loading state
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      // Check if Firebase is initialized
      if (typeof firebase === 'undefined' || !firebase.firestore) {
        throw new Error('Firebase not initialized');
      }

      const db = firebase.firestore();

      // Add submission to Firestore
      const docRef = await db.collection('formSubmissions').add({
        name,
        email,
        subject,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        referer: document.referrer,
      });

      // Success feedback
      showFormStatus('✓ Message sent successfully! Thank you for reaching out.', 'success');

      // Reset form
      form.reset();

      // Re-enable button after delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        document.getElementById('form-status').style.display = 'none';
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);

      // Fallback: show error message
      const errorMsg = error.message || 'Error sending message. Please try again later.';
      showFormStatus('✗ ' + errorMsg, 'error');

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFormStatus(message, type) {
    const statusEl = document.getElementById('form-status');
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.color = type === 'success' ? 'var(--accent-success, #22d3a0)' : 'var(--accent-error, #f87171)';
  }
});
