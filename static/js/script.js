// Client-side validation for the login form
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    let isValid = true;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Reset error messages
    document.getElementById('username-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // Validate username
    if (!username) {
        document.getElementById('username-error').textContent = 'Username is required.';
        isValid = false;
    }

    // Validate password
    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required.';
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
});

// Client-side validation for the registration form
document.getElementById('register-form')?.addEventListener('submit', function (e) {
    let isValid = true;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Reset error messages
    document.getElementById('username-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // Validate username
    if (!username) {
        document.getElementById('username-error').textContent = 'Username is required.';
        isValid = false;
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email-error').textContent = 'Valid email is required.';
        isValid = false;
    }

    // Validate password
    if (!password || password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters.';
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
});

// Client-side validation for the prediction form
document.getElementById('prediction-form')?.addEventListener('submit', function (e) {
    let isValid = true;

    // Reset error messages
    const fields = [
        'Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
        'Study Satisfaction', 'Job Satisfaction', 'Sleep Duration', 'Work/Study Hours'
    ];

    fields.forEach(field => {
        document.getElementById(`${field}-error`).textContent = '';
    });

    // Validate Age
    const age = parseFloat(document.getElementById('Age').value);
    if (isNaN(age) || age < 0 || age > 100) {
        document.getElementById('Age-error').textContent = 'Age must be between 0 and 100.';
        isValid = false;
    }

    // Validate Academic Pressure
    const academicPressure = parseFloat(document.getElementById('Academic Pressure').value);
    if (isNaN(academicPressure) || academicPressure < 1 || academicPressure > 10) {
        document.getElementById('Academic Pressure-error').textContent = 'Academic Pressure must be between 1 and 10.';
        isValid = false;
    }

    // Validate Work Pressure
    const workPressure = parseFloat(document.getElementById('Work Pressure').value);
    if (isNaN(workPressure) || workPressure < 1 || workPressure > 10) {
        document.getElementById('Work Pressure-error').textContent = 'Work Pressure must be between 1 and 10.';
        isValid = false;
    }

    // Validate CGPA
    const cgpa = parseFloat(document.getElementById('CGPA').value);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
        document.getElementById('CGPA-error').textContent = 'CGPA must be between 0 and 4.';
        isValid = false;
    }

    // Validate Study Satisfaction
    const studySatisfaction = parseFloat(document.getElementById('Study Satisfaction').value);
    if (isNaN(studySatisfaction) || studySatisfaction < 1 || studySatisfaction > 10) {
        document.getElementById('Study Satisfaction-error').textContent = 'Study Satisfaction must be between 1 and 10.';
        isValid = false;
    }

    // Validate Job Satisfaction
    const jobSatisfaction = parseFloat(document.getElementById('Job Satisfaction').value);
    if (isNaN(jobSatisfaction) || jobSatisfaction < 1 || jobSatisfaction > 10) {
        document.getElementById('Job Satisfaction-error').textContent = 'Job Satisfaction must be between 1 and 10.';
        isValid = false;
    }

    // Validate Sleep Duration
    const sleepDuration = parseFloat(document.getElementById('Sleep Duration').value);
    if (isNaN(sleepDuration) || sleepDuration < 0 || sleepDuration > 24) {
        document.getElementById('Sleep Duration-error').textContent = 'Sleep Duration must be between 0 and 24 hours.';
        isValid = false;
    }

    // Validate Work/Study Hours
    const workStudyHours = parseFloat(document.getElementById('Work/Study Hours').value);
    if (isNaN(workStudyHours) || workStudyHours < 0 || workStudyHours > 24) {
        document.getElementById('Work/Study Hours-error').textContent = 'Work/Study Hours must be between 0 and 24 hours.';
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
});