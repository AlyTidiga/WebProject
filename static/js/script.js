document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('prediction-form');
    const inputs = {
        'Age': { min: 0, max: 100, step: 1, errorId: 'Age-error' },
        'Academic Pressure': { min: 1, max: 10, step: 0.1, errorId: 'Academic Pressure-error' },
        'Work Pressure': { min: 1, max: 10, step: 0.1, errorId: 'Work Pressure-error' },
        'CGPA': { min: 0, max: 4, step: 0.1, errorId: 'CGPA-error' },
        'Study Satisfaction': { min: 1, max: 10, step: 0.1, errorId: 'Study Satisfaction-error' },
        'Job Satisfaction': { min: 1, max: 10, step: 0.1, errorId: 'Job Satisfaction-error' },
        'Sleep Duration': { min: 0, max: 24, step: 0.1, errorId: 'Sleep Duration-error' },
        'Work/Study Hours': { min: 0, max: 24, step: 0.1, errorId: 'Work/Study Hours-error' }
    };

    // Calculer Total Pressure dynamiquement
    const academicPressureInput = document.getElementById('Academic Pressure');
    const workPressureInput = document.getElementById('Work Pressure');
    const totalPressureInput = document.getElementById('Total Pressure');

    function updateTotalPressure() {
        const academic = parseFloat(academicPressureInput.value) || 0;
        const work = parseFloat(workPressureInput.value) || 0;
        totalPressureInput.value = (academic + work).toFixed(1);
    }

    academicPressureInput.addEventListener('input', updateTotalPressure);
    workPressureInput.addEventListener('input', updateTotalPressure);

    // Validation des champs
    form.addEventListener('submit', function (event) {
        let isValid = true;

        for (const [name, constraints] of Object.entries(inputs)) {
            const input = document.getElementById(name);
            const errorElement = document.getElementById(constraints.errorId);
            const value = parseFloat(input.value);

            if (!input.value) {
                input.classList.add('error');
                errorElement.textContent = 'Ce champ est requis.';
                isValid = false;
            } else if (isNaN(value) || value < constraints.min || value > constraints.max) {
                input.classList.add('error');
                errorElement.textContent = `Veuillez entrer une valeur entre ${constraints.min} et ${constraints.max}.`;
                isValid = false;
            } else {
                input.classList.remove('error');
                errorElement.textContent = '';
            }
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    // Supprimer les erreurs à la saisie
    Object.keys(inputs).forEach(name => {
        const input = document.getElementById(name);
        input.addEventListener('input', function () {
            const errorElement = document.getElementById(inputs[name].errorId);
            input.classList.remove('error');
            errorElement.textContent = '';
        });
    });
});