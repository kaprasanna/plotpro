document.addEventListener('DOMContentLoaded', function() {
    console.log("Registration JS loaded successfully");
    // DOM Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step1Indicator = document.getElementById('step1-indicator');
    const step2Indicator = document.getElementById('step2-indicator');
    const step3Indicator = document.getElementById('step3-indicator');
    const step1Next = document.getElementById('step1-next');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const completeRegistration = document.getElementById('complete-registration');
    const successMessage = document.getElementById('success-message');
    const displayPhone = document.getElementById('display-phone');
    const resendOtp = document.getElementById('resend-otp');
    const resendTimer = document.getElementById('resend-timer');
    
    // Form inputs
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const companyNameInput = document.getElementById('company-name');
    const roleInput = document.getElementById('role');
    
    // Error messages
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const otpError = document.getElementById('otp-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    
    // Validation functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone); // Indian mobile number validation
    }
    
    function isValidPassword(password) {
        return password.length >= 8;
    }
    
    // Step 1 validation
    step1Next.addEventListener('click', function() {
        let isValid = true;
        
        // Validate name
        if (!fullNameInput.value.trim()) {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }
        
        // Validate email
        if (!isValidEmail(emailInput.value)) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }
        
        // Validate phone
        if (!isValidPhone(phoneInput.value)) {
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            phoneError.style.display = 'none';
        }
        
        if (isValid) {
            // Move to step 2
            step1.classList.remove('active');
            step2.classList.add('active');
            step1Indicator.classList.remove('active');
            step1Indicator.classList.add('completed');
            step2Indicator.classList.add('active');
            
            // Display phone number
            displayPhone.textContent = '+91 ' + phoneInput.value;
            
            // Focus on first OTP input
            otpInputs[0].focus();
        }
    });
    
    // Send OTP button
    sendOtpBtn.addEventListener('click', function() {
        if (isValidPhone(phoneInput.value)) {
            phoneError.style.display = 'none';
            
            // Simulate OTP sending
            sendOtpBtn.textContent = 'Sending...';
            sendOtpBtn.disabled = true;
            sendOtpBtn.classList.add('btn-disabled');
            
            // Send OTP API call
            fetch('/api/auth/send-otp?mobile=' + phoneInput.value, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                sendOtpBtn.textContent = 'OTP Sent';
                startResendTimer();
                
                // For testing only - in production don't show OTP
                if (data.otp) {
                    alert('OTP for testing: ' + data.otp);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                sendOtpBtn.textContent = 'Send OTP';
                sendOtpBtn.disabled = false;
                sendOtpBtn.classList.remove('btn-disabled');
                alert('Failed to send OTP. Please try again.');
            });
        } else {
            phoneError.style.display = 'block';
        }
    });
    
    // OTP input handling
    otpInputs.forEach(function(input, index) {
        input.addEventListener('input', function() {
            if (input.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // Verify OTP button
    verifyOtpBtn.addEventListener('click', function() {
        let enteredOtp = '';
        otpInputs.forEach(function(input) {
            enteredOtp += input.value;
        });
        
        if (enteredOtp.length === 6) {
            otpError.style.display = 'none';
            
            // Verify OTP API call
            fetch(`/api/auth/verify-otp?mobile=${phoneInput.value}&otp=${enteredOtp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.verified) {
                    // Move to step 3
                    step2.classList.remove('active');
                    step3.classList.add('active');
                    step2Indicator.classList.remove('active');
                    step2Indicator.classList.add('completed');
                    step3Indicator.classList.add('active');
                } else {
                    otpError.textContent = 'Invalid OTP. Please try again.';
                    otpError.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                otpError.textContent = 'Failed to verify OTP. Please try again.';
                otpError.style.display = 'block';
            });
        } else {
            otpError.textContent = 'Please enter all 6 digits.';
            otpError.style.display = 'block';
        }
    });
    
    // Resend OTP
    function startResendTimer() {
        let seconds = 30;
        resendOtp.style.display = 'none';
        resendTimer.style.display = 'inline';
        
        const countdown = setInterval(function() {
            seconds--;
            resendTimer.textContent = `Resend in ${seconds}s`;
            
            if (seconds <= 0) {
                clearInterval(countdown);
                resendTimer.style.display = 'none';
                resendOtp.style.display = 'inline';
                sendOtpBtn.textContent = 'Send OTP';
                sendOtpBtn.disabled = false;
                sendOtpBtn.classList.remove('btn-disabled');
            }
        }, 1000);
    }
    
    resendOtp.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Resend OTP API call
        fetch('/api/auth/send-otp?mobile=' + phoneInput.value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            startResendTimer();
            
            // For testing only
            if (data.otp) {
                alert('New OTP for testing: ' + data.otp);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to resend OTP. Please try again.');
        });
    });
    
    // Complete registration
    completeRegistration.addEventListener('click', function() {
        let isValid = true;
        
        // Validate password
        if (!isValidPassword(passwordInput.value)) {
            passwordError.style.display = 'block';
            isValid = false;
        } else {
            passwordError.style.display = 'none';
        }
        
        // Validate password confirmation
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.style.display = 'block';
            isValid = false;
        } else {
            confirmPasswordError.style.display = 'none';
        }
        
        if (isValid) {
            // Prepare registration data
            const userData = {
                name: fullNameInput.value,
                email: emailInput.value,
                mobile: phoneInput.value,
                companyName: companyNameInput.value,
                role: roleInput.value,
                password: passwordInput.value
            };
            
            // Send registration request
            completeRegistration.textContent = 'Processing...';
            completeRegistration.disabled = true;
            
            fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.userId) {
                    // Hide all steps
                    step3.classList.remove('active');
                    step3Indicator.classList.remove('active');
                    step3Indicator.classList.add('completed');
                    
                    // Show success message
                    successMessage.style.display = 'block';
                } else {
                    alert('Registration failed: ' + data.message);
                    completeRegistration.textContent = 'Complete Registration';
                    completeRegistration.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed. Please try again.');
                completeRegistration.textContent = 'Complete Registration';
                completeRegistration.disabled = false;
            });
        }
    });
    
    // Input formatting and validation
    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/\D/g, '');
    });
});