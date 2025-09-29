// API Configuration - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwyxKmoc2N-hNxwNSyhVBoqjpE5J7tQzvdbVCYx02O66nXZm3bF9FCmPoGUX4eOJ1GJ/exec';

// DOM Elements
const censusForm = document.getElementById('censusForm');
const membersContainer = document.getElementById('members-container');
const childrenContainer = document.getElementById('children-container');
const addMemberBtn = document.getElementById('add-member-btn');
const addChildBtn = document.getElementById('add-child-btn');
const successMessage = document.getElementById('success-message');

// Templates
const memberTemplate = document.getElementById('member-template');
const childTemplate = document.getElementById('child-template');

// Initialize the form with one member and one child
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form initialized');
    addMemberForm();
    addChildForm();
    
    // Add event listeners for dynamic form interactions
    addMemberBtn.addEventListener('click', addMemberForm);
    addChildBtn.addEventListener('click', addChildForm);
    
    // Form submission
    censusForm.addEventListener('submit', handleFormSubmit);
    
    // Test connection
    testAPIConnection();
});

// [Keep all the other functions from the previous script.js the same, but update the error handling in handleFormSubmit:]

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submission started');
    
    // Validate required fields
    if (!validateForm()) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    
    // [Keep all the data collection code the same...]
    
    // Prepare data for API
    const submissionData = {
        ...householdData,
        members: JSON.stringify(membersData),
        children: JSON.stringify(childrenData)
    };
    
    console.log('Final submission data prepared');
    
    // Submit to API
    try {
        showLoading(true);
        console.log('Sending data to API...');
        
        const response = await submitToAPI(submissionData);
        console.log('API Response:', response);
        
        if (response.success) {
            console.log('Form submitted successfully');
            showSuccessMessage();
        } else {
            // Show detailed error message
            let errorMsg = response.message || 'Unknown error occurred';
            if (response.error) {
                errorMsg += '\n\nTechnical details: ' + response.error;
            }
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Submission error:', error);
        
        // Show user-friendly error message
        let userMessage = 'Error submitting form: ' + error.message;
        if (error.message.includes('appendRow') || error.message.includes('sheet')) {
            userMessage = 'Server configuration error. Please check that the Google Sheets are set up correctly.';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
            userMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        alert(userMessage);
    } finally {
        showLoading(false);
    }
}

// Test API connection with debug
async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(API_URL + '?action=debugSheets');
        const data = await response.json();
        console.log('API debug result:', data);
        
        if (data.success) {
            console.log('API connection test: SUCCESS');
            console.log('Available sheets:', data.sheets);
        } else {
            console.log('API connection test: FAILED - ' + data.message);
            alert('Warning: Cannot connect to server. Please check your API URL and Sheet ID configuration.');
        }
        return data.success;
    } catch (error) {
        console.error('API test failed:', error);
        alert('Error: Cannot connect to server. Please check:\n1. API URL is correct\n2. Google Apps Script is deployed\n3. Sheet ID is correct');
        return false;
    }
}
