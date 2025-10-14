// Elements
const uploadView = document.getElementById('upload-view');
const resultView = document.getElementById('result-view');
const fileUpload = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const placeholderText = document.getElementById('placeholder-text');
const fileNameDisplay = document.getElementById('file-name');
const backToHomeButton = document.getElementById('back-to-home-button');
const analyzeDeeperButton = document.getElementById('analyze-deeper-button');

// --- Image Upload & Preview ---
let analyzeButton;

fileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
        placeholderText.classList.add('hidden');
    };
    reader.readAsDataURL(file);

    // Display file name
    fileNameDisplay.textContent = `Selected file: ${file.name}`;

    // Create "Analyze Image" button if it doesn't exist
    if (!analyzeButton) {
        analyzeButton = document.createElement('button');
        analyzeButton.textContent = 'Analyze Image';
        analyzeButton.id = 'analyze-image-button';
        analyzeButton.className = 'mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-transform transform hover:scale-105';
        
        // Insert button under file name
        fileNameDisplay.insertAdjacentElement('afterend', analyzeButton);

        // On click, open result.html
        analyzeButton.addEventListener('click', () => {
            window.location.href = '/analyze';
        });
    }
});

// --- Back to Home ---
backToHomeButton.addEventListener('click', () => {
    uploadView.classList.remove('hidden');
    resultView.classList.add('hidden');

    // Reset upload inputs
    fileUpload.value = '';
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    placeholderText.classList.remove('hidden');
    fileNameDisplay.textContent = '';

    // Remove analyze button
    if (analyzeButton) {
        analyzeButton.remove();
        analyzeButton = null;
    }
});

// --- Analyze Deeper Simulation ---
analyzeDeeperButton.addEventListener('click', () => {
    const detailsText = document.getElementById('details-text');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceText = document.getElementById('confidence-text');

    const deeperConfidence = (Math.random() * 10 + 90).toFixed(2); // 90-100%
    confidenceBar.style.width = `${deeperConfidence}%`;
    confidenceText.textContent = `${deeperConfidence}%`;
    detailsText.textContent += " | Deeper analysis completed: fracture edges and micro-cracks highlighted.";
});
