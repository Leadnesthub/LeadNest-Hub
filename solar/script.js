// Enhanced user type toggle functionality with accessibility
document.addEventListener('DOMContentLoaded', function() {
    const userButtons = document.querySelectorAll('.user-btn');
    
    userButtons.forEach(button => {
        button.addEventListener('click', function() {
            userButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
        });
    });
    
    // Enhanced form validation and submission
    const form = document.getElementById('solarForm');
    const submitBtn = form.querySelector('.submit-btn');
    const submitStatus = document.getElementById('submit-status');
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    function validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.id + '-error');
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\-\(\)\s\+]{10,}$/;
            if (!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        } else if (field.id === 'zipCode' && field.value) {
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid ZIP code';
            }
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
        }
        
        field.classList.toggle('error', !isValid);
        return isValid;
    }
    
    function clearError(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }
    
    // Form submission with enhanced UX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                submitStatus.textContent = 'Please correct the errors above';
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitStatus.textContent = 'Submitting your request...';
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add user type
        const activeUserType = document.querySelector('.user-btn.active').dataset.type;
        data.user_type = activeUserType;
        data.timestamp = new Date().toISOString();
        data.page_source = 'solar';
        
        // Submit to Formspree (replace with your endpoint)
        fetch('https://formspree.io/f/myzpogeb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
                submitStatus.textContent = 'Thank you! Your request has been submitted successfully.';
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            submitStatus.textContent = 'There was an error submitting your form. Please try again.';
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });
});

// Scroll to form function
function scrollToForm() {
    const form = document.querySelector('.form-container');
    form.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Success message
function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #10b981; margin-bottom: 15px;">Thank You!</h2>
            <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 20px;">
                Your solar quote request has been submitted successfully.
            </p>
            <p style="color: #64748b;">
                A local solar expert will contact you within 24 hours with your personalized quote.
            </p>
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                <p style="color: #166534; font-weight: 600;">
                    ⚡ Don't forget: The 30% federal tax credit expires December 31, 2025!
                </p>
            </div>
        </div>
    `;
}

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to submit button
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('.submit-btn');
    const form = document.getElementById('solarForm');
    
    form.addEventListener('submit', function() {
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                SUBMITTING...
            </span>
        `;
        submitBtn.disabled = true;
    });
});

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

