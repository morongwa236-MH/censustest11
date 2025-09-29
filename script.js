// API Configuration - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzu5QKzltIsLPhzQmXV0bd8_MGkxiEEN0TjfjdZZt4zG3KeQIPmwI8_3LcL66_uJlmp/exec';

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
});

// Add a new member form
function addMemberForm() {
    const memberClone = memberTemplate.content.cloneNode(true);
    const memberForm = memberClone.querySelector('.member-form');
    
    // Add event listeners for conditional fields
    setupMemberFormEvents(memberForm);
    
    membersContainer.appendChild(memberForm);
    console.log('Member form added');
}

// Setup event listeners for member form conditional fields
function setupMemberFormEvents(memberForm) {
    const baptismSelect = memberForm.querySelector('.member-baptised');
    const communionSelect = memberForm.querySelector('.member-firstCommunion');
    const confirmationSelect = memberForm.querySelector('.member-confirmation');
    const maritalSelect = memberForm.querySelector('.member-maritalStatus');
    const dikabeloSelect = memberForm.querySelector('.member-dikabelo');
    
    baptismSelect.addEventListener('change', function() {
        const baptismDetails = memberForm.querySelector('.baptism-details');
        baptismDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    communionSelect.addEventListener('change', function() {
        const communionDetails = memberForm.querySelector('.communion-details');
        communionDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    confirmationSelect.addEventListener('change', function() {
        const confirmationDetails = memberForm.querySelector('.confirmation-details');
        confirmationDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    maritalSelect.addEventListener('change', function() {
        const maritalDetails = memberForm.querySelector('.marital-details');
        maritalDetails.classList.toggle('hidden', this.value !== 'Married');
    });
    
    dikabeloSelect.addEventListener('change', function() {
        const dikabeloDetails = memberForm.querySelector('.dikabelo-details');
        dikabeloDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    // Remove button functionality
    const removeBtn = memberForm.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
        if (membersContainer.children.length > 1) {
            memberForm.remove();
            console.log('Member form removed');
        } else {
            alert('At least one member is required.');
        }
    });
}

// Add a new child form
function addChildForm() {
    const childClone = childTemplate.content.cloneNode(true);
    const childForm = childClone.querySelector('.child-form');
    
    // Add event listeners for conditional fields
    setupChildFormEvents(childForm);
    
    childrenContainer.appendChild(childForm);
    console.log('Child form added');
}

// Setup event listeners for child form conditional fields
function setupChildFormEvents(childForm) {
    const baptismSelect = childForm.querySelector('.child-baptised');
    const communionSelect = childForm.querySelector('.child-firstCommunion');
    const confirmationSelect = childForm.querySelector('.child-confirmation');
    
    baptismSelect.addEventListener('change', function() {
        const baptismDetails = childForm.querySelector('.child-baptism-details');
        baptismDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    communionSelect.addEventListener('change', function() {
        const communionDetails = childForm.querySelector('.child-communion-details');
        communionDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    confirmationSelect.addEventListener('change', function() {
        const confirmationDetails = childForm.querySelector('.child-confirmation-details');
        confirmationDetails.classList.toggle('hidden', this.value !== 'Yes');
    });
    
    // Remove button functionality
    const removeBtn = childForm.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
        childForm.remove();
        console.log('Child form removed');
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submission started');
    
    // Validate required fields
    if (!validateForm()) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    
    // Collect household data
    const householdData = {
        blockName: document.getElementById('blockName').value,
        residentialAddress: document.getElementById('residentialAddress').value,
        contactNo: document.getElementById('contactNo').value
    };
    
    console.log('Household data collected:', householdData);
    
    // Collect members data
    const membersData = [];
    const memberForms = document.querySelectorAll('.member-form');
    
    memberForms.forEach((form, index) => {
        const member = {
            firstName: form.querySelector('.member-firstName').value,
            lastName: form.querySelector('.member-lastName').value,
            dateOfBirth: form.querySelector('.member-dateOfBirth').value,
            catholic: form.querySelector('.member-catholic').value,
            occupation: form.querySelector('.member-occupation').value,
            churchActivities: form.querySelector('.member-churchActivities').value,
            solidarityMinistry: form.querySelector('.member-solidarityMinistry').value,
            leadership: form.querySelector('.member-leadership').value,
            baptised: form.querySelector('.member-baptised').value,
            dateOfBaptism: form.querySelector('.member-dateOfBaptism').value,
            baptismRegistrationNo: form.querySelector('.member-baptismRegistrationNo').value,
            baptismChurch: form.querySelector('.member-baptismChurch').value,
            baptismLocation: form.querySelector('.member-baptismLocation').value,
            firstCommunion: form.querySelector('.member-firstCommunion').value,
            dateFirstCommunion: form.querySelector('.member-dateFirstCommunion').value,
            firstCommunionChurch: form.querySelector('.member-firstCommunionChurch').value,
            confirmation: form.querySelector('.member-confirmation').value,
            dateOfConfirmation: form.querySelector('.member-dateOfConfirmation').value,
            confirmationChurch: form.querySelector('.member-confirmationChurch').value,
            maritalStatus: form.querySelector('.member-maritalStatus').value,
            civilCourtMarriageDate: form.querySelector('.member-civilCourtMarriageDate').value,
            churchMarriageDate: form.querySelector('.member-churchMarriageDate').value,
            churchMarriagePlace: form.querySelector('.member-churchMarriagePlace').value,
            divorced: form.querySelector('.member-divorced').value,
            dikabelo: form.querySelector('.member-dikabelo').value,
            dateLastDikabelo: form.querySelector('.member-dateLastDikabelo').value
        };
        membersData.push(member);
        console.log(`Member ${index + 1} data collected:`, member);
    });
    
    // Collect children data
    const childrenData = [];
    const childForms = document.querySelectorAll('.child-form');
    
    childForms.forEach((form, index) => {
        const child = {
            firstName: form.querySelector('.child-firstName').value,
            lastName: form.querySelector('.child-lastName').value,
            dateOfBirth: form.querySelector('.child-dateOfBirth').value,
            age: form.querySelector('.child-age').value,
            catholic: form.querySelector('.child-catholic').value,
            churchActivities: form.querySelector('.child-churchActivities').value,
            baptised: form.querySelector('.child-baptised').value,
            dateOfBaptism: form.querySelector('.child-dateOfBaptism').value,
            baptismRegistrationNo: form.querySelector('.child-baptismRegistrationNo').value,
            baptismChurch: form.querySelector('.child-baptismChurch').value,
            baptismLocation: form.querySelector('.child-baptismLocation').value,
            firstCommunion: form.querySelector('.child-firstCommunion').value,
            dateFirstCommunion: form.querySelector('.child-dateFirstCommunion').value,
            firstCommunionChurch: form.querySelector('.child-firstCommunionChurch').value,
            confirmation: form.querySelector('.child-confirmation').value,
            dateOfConfirmation: form.querySelector('.child-dateOfConfirmation').value,
            confirmationChurch: form.querySelector('.child-confirmationChurch').value
        };
        childrenData.push(child);
        console.log(`Child ${index + 1} data collected:`, child);
    });
    
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
            throw new Error(response.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting form: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Validate form
function validateForm() {
    // Check household fields
    const blockName = document.getElementById('blockName').value;
    const residentialAddress = document.getElementById('residentialAddress').value;
    const contactNo = document.getElementById('contactNo').value;
    
    if (!blockName || !residentialAddress || !contactNo) {
        console.log('Validation failed: Missing household fields');
        return false;
    }
    
    // Check member fields
    const memberForms = document.querySelectorAll('.member-form');
    for (let form of memberForms) {
        const firstName = form.querySelector('.member-firstName').value;
        const lastName = form.querySelector('.member-lastName').value;
        const dateOfBirth = form.querySelector('.member-dateOfBirth').value;
        const catholic = form.querySelector('.member-catholic').value;
        
        if (!firstName || !lastName || !dateOfBirth || !catholic) {
            console.log('Validation failed: Missing member fields');
            return false;
        }
    }
    
    console.log('Form validation passed');
    return true;
}

// Show loading state
function showLoading(show) {
    const submitBtn = document.querySelector('.btn-primary');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        console.log('Loading state: ON');
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Census Data';
        console.log('Loading state: OFF');
    }
}

// Show success message
function showSuccessMessage() {
    censusForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    console.log('Success message shown');
    
    // Reset form after 5 seconds
    setTimeout(() => {
        censusForm.reset();
        censusForm.classList.remove('hidden');
        successMessage.classList.add('hidden');
        
        // Reset dynamic forms to one each
        while (membersContainer.children.length > 1) {
            membersContainer.lastChild.remove();
        }
        while (childrenContainer.children.length > 1) {
            childrenContainer.lastChild.remove();
        }
        
        // Re-initialize events for the remaining forms
        setupMemberFormEvents(membersContainer.querySelector('.member-form'));
        if (childrenContainer.querySelector('.child-form')) {
            setupChildFormEvents(childrenContainer.querySelector('.child-form'));
        }
        
        console.log('Form reset completed');
    }, 5000);
}

// API call function - FIXED with better error handling
async function submitToAPI(data) {
    try {
        console.log('Making API call to:', API_URL);
        
        const formData = new URLSearchParams();
        
        // Add all data to formData
        for (const key in data) {
            formData.append(key, data[key]);
            console.log(`Added form data: ${key} = ${data[key]}`);
        }
        formData.append('action', 'addHousehold');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API call successful, result:', result);
        return result;
        
    } catch (error) {
        console.error('API call failed:', error);
        throw new Error(`Failed to connect to server: ${error.message}`);
    }
}

// Test API connection
async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(API_URL + '?action=getStats');
        const data = await response.json();
        console.log('API test result:', data);
        return data.success;
    } catch (error) {
        console.error('API test failed:', error);
        return false;
    }
}

// Test connection on load
window.addEventListener('load', function() {
    console.log('Page loaded, testing API connection...');
    testAPIConnection().then(success => {
        if (success) {
            console.log('API connection test: SUCCESS');
        } else {
            console.log('API connection test: FAILED');
            alert('Warning: Cannot connect to server. Please check your API URL configuration.');
        }
    });
});
