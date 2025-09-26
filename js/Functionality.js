
function validateAndSubmitForm(formElement) {
    let isValid = true;
    const errorMessages = formElement.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove()); // Clear previous errors

    const inputs = formElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === '') {
            isValid = false;
            displayError(input, 'This field is required.');
        }
        // Add more validation rules here as needed (e.g., email format, min/max length)
    });

    if (isValid) {
        const formData = new FormData(formElement);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch(formElement.action, {
            method: formElement.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submitted successfully:', data);
            alert('Form submitted successfully!');
            formElement.reset(); // Clear the form
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
        });
    }
    return false; // Prevent default form submission
}

function displayError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.textContent = message;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

// Example usage (assuming you have a form with id="myForm"):
// document.addEventListener('DOMContentLoaded', () => {
//     const myForm = document.getElementById('myForm');
//     if (myForm) {
//         myForm.addEventListener('submit', function(event) {
//             event.preventDefault(); // Prevent default HTML form submission
//             validateAndSubmitForm(this);
//         });
//     }
// });
