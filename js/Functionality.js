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

document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const fadeinElements = document.querySelectorAll('.fade-in-element');
    if (fadeinElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        fadeinElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Image Slider Logic
    const slider = document.querySelector('.slider');
    if (slider) {
        const slides = Array.from(slider.children);
        const nextButton = document.querySelector('.slider-arrow.next');
        const prevButton = document.querySelector('.slider-arrow.prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slider.style.transform = 'translateX(' + (-index * 100) + '%)';
            currentIndex = index;
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0; // Loop to the first slide
            }
            goToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1; // Loop to the last slide
            }
            goToSlide(prevIndex);
        });

        goToSlide(0); // Initialize slider position
    }

    // Newsletter Modal Logic
    const newsletterModal = document.getElementById('newsletterModal');
    const studiosHeading = document.getElementById('our-studios');
    const closeButton = document.querySelector('.close-button');
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterModal && studiosHeading && closeButton && newsletterForm) {
        let modalShown = false;

        const modalObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !modalShown) {
                    newsletterModal.classList.add('show');
                    modalShown = true;
                    observer.unobserve(entry.target); // Only trigger once
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of the heading is visible
        });

        modalObserver.observe(studiosHeading);

        // Function to close the modal
        const closeModal = () => {
            newsletterModal.classList.remove('show');
        };

        // Close button event
        closeButton.addEventListener('click', closeModal);

        // Close when clicking outside the modal content
        newsletterModal.addEventListener('click', (event) => {
            if (event.target === newsletterModal) {
                closeModal();
            }
        });

        // Prevent form from submitting and reloading the page
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Thank you for subscribing!');
            closeModal();
        });
    }

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll to top on click
        backToTopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter Section Form Logic
    const newsletterSectionForm = document.getElementById('newsletterSectionForm');
    if (newsletterSectionForm) {
        newsletterSectionForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default HTML form submission
            validateAndSubmitForm(this);
        });
    }

    // Cookie Consent Banner Logic
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptCookieBtn = document.getElementById('acceptCookieBtn');

    if (cookieBanner && acceptCookieBtn) {
        // Check if user has already consented
        if (localStorage.getItem('cookieConsent') === 'true') {
            cookieBanner.style.display = 'none';
        }

        // Add event listener to the accept button
        acceptCookieBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // Page Transition Logic
    document.body.classList.remove('fade-out'); // Ensure body doesn't start faded out

    document.addEventListener('click', (event) => {
        let target = event.target;

        // Traverse up the DOM to find the nearest anchor tag
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }

        if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');

            // Check if it's an internal link and not an anchor or external link
            if (href && !href.startsWith('#') && !target.hasAttribute('download') &&
                (href.startsWith('/') || href.startsWith(window.location.origin) || !href.includes(':'))) {
                
                // Prevent default navigation
                event.preventDefault();

                // Add fade-out class to body
                document.body.classList.add('fade-out');

                // Wait for the fade-out transition to complete, then navigate
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Match CSS transition duration
            }
        }
    });

    // Search Functionality
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const mainContent = document.querySelector('main'); // Assuming main content is within <main>

    // Function to highlight text
    function highlightText(query) {
        if (!mainContent || !query) return;

        const walker = document.createTreeWalker(
            mainContent,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        const nodesToProcess = [];
        while ((node = walker.nextNode())) {
            nodesToProcess.push(node);
        }

        const lowerCaseQuery = query.toLowerCase();

        nodesToProcess.forEach(node => {
            const text = node.nodeValue;
            const lowerCaseText = text.toLowerCase();
            let lastIndex = 0;
            const fragment = document.createDocumentFragment();

            while (lastIndex < lowerCaseText.length) {
                const startIndex = lowerCaseText.indexOf(lowerCaseQuery, lastIndex);
                if (startIndex === -1) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                    break;
                }

                fragment.appendChild(document.createTextNode(text.substring(lastIndex, startIndex)));
                const mark = document.createElement('mark');
                mark.textContent = text.substring(startIndex, startIndex + query.length);
                fragment.appendChild(mark);
                lastIndex = startIndex + query.length;
            }
            if (fragment.hasChildNodes()) {
                node.parentNode.replaceChild(fragment, node);
            }
        });
    }

    // Function to clear highlights
    function clearHighlights() {
        if (!mainContent) return;
        const marks = mainContent.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.parentNode.replaceChild(document.createTextNode(mark.textContent), mark);
        });
    }

    if (searchForm && searchInput && mainContent) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value.trim();

            clearHighlights(); // Clear previous highlights first

            if (query) {
                highlightText(query);
            }
        });

        // Optional: Clear highlights when search input is cleared
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '') {
                clearHighlights();
            }
        });
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionContent = header.nextElementSibling; // Get the content div

            header.classList.toggle('active');

            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null; // Collapse
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px'; // Expand
            }
        });
    });
});
