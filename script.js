const contactForm = document.getElementById('contactForm');
const statusOutput = document.getElementById('statusOutput');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prepare data (Key names must match your backend req.body)
    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // UI Feedback
    submitBtn.innerText = "> UPLOADING...";
    submitBtn.disabled = true;
    statusOutput.classList.add('hidden');

    try {
        // Replace with your actual backend URL in production
        const response = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        statusOutput.classList.remove('hidden');
        
        if (result.success) {
            statusOutput.style.color = "#00ff41";
            statusOutput.innerText = "[SUCCESS]: Message injected into database.";
            contactForm.reset();
        } else {
            throw new Error(result.error || "Unknown server error");
        }

    } catch (error) {
        statusOutput.classList.remove('hidden');
        statusOutput.style.color = "#ff5f56";
        statusOutput.innerText = `[ERROR]: ${error.message}`;
    } finally {
        submitBtn.innerText = "./EXECUTE_SUBMIT";
        submitBtn.disabled = false;
    }
});