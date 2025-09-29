// API Configuration - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzu5QKzltIsLPhzQmXV0bd8_MGkxiEEN0TjfjdZZt4zG3KeQIPmwI8_3LcL66_uJlmp/exec';

// DOM Elements
const searchSection = document.getElementById('search-section');
const statsSection = document.getElementById('stats-section');
const householdListSection = document.getElementById('household-list-section');
const householdDetailsSection = document.getElementById('household-details-section');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const showAllBtn = document.getElementById('show-all-btn');
const viewDataBtn = document.getElementById('view-data-btn');
const viewStatsBtn = document.getElementById('view-stats-btn');

const householdList = document.getElementById('household-list');
const householdDetails = document.getElementById('household-details');
const statsContainer = document.getElementById('stats-container');

const editHouseholdBtn = document.getElementById('edit-household-btn');
const deleteHouseholdBtn = document.getElementById('delete-household-btn');
const printHouseholdBtn = document.getElementById('print-household-btn');
const backToListBtn = document.getElementById('back-to-list-btn');

// Global variables
let currentHouseholdId = null;
let allHouseholds = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load all households initially
    loadHouseholds();
    
    // Event listeners
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchHouseholds(searchTerm);
        } else {
            loadHouseholds();
        }
    });
    
    showAllBtn.addEventListener('click', loadHouseholds);
    
    viewDataBtn.addEventListener('click', function() {
        statsSection.classList.add('hidden');
        searchSection.classList.remove('hidden');
        householdListSection.classList.remove('hidden');
        householdDetailsSection.classList.add('hidden');
        loadHouseholds();
    });
    
    viewStatsBtn.addEventListener('click', function() {
        searchSection.classList.add('hidden');
        householdListSection.classList.add('hidden');
        householdDetailsSection.classList.add('hidden');
        statsSection.classList.remove('hidden');
        loadStatistics();
    });
    
    backToListBtn.addEventListener('click', function() {
        householdDetailsSection.classList.add('hidden');
        householdListSection.classList.remove('hidden');
    });
    
    deleteHouseholdBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this household? This action cannot be undone.')) {
            deleteHousehold(currentHouseholdId);
        }
    });
    
    printHouseholdBtn.addEventListener('click', function() {
        printHousehold(currentHouseholdId);
    });
    
    // Allow Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});

// Load all households
async function loadHouseholds() {
    try {
        const response = await fetch(`${API_URL}?action=getHouseholds`);
        const data = await response.json();
        
        if (data.success) {
            allHouseholds = data.data.households;
            displayHouseholds(allHouseholds);
        } else {
            throw new Error(data.message || 'Failed to load households');
        }
    } catch (error) {
        alert('Error loading households: ' + error.message);
    }
}

// Search households
async function searchHouseholds(searchTerm) {
    try {
        const response = await fetch(`${API_URL}?action=getHouseholds&search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.success) {
            displayHouseholds(data.data.households);
        } else {
            throw new Error(data.message || 'Search failed');
        }
    } catch (error) {
        alert('Error searching households: ' + error.message);
    }
}

// Display households in the list
function displayHouseholds(households) {
    householdList.innerHTML = '';
    
    if (households.length === 0) {
        householdList.innerHTML = '<p>No households found.</p>';
        return;
    }
    
    households.forEach(household => {
        const householdItem = document.createElement('div');
        householdItem.className = 'household-item';
        householdItem.innerHTML = `
            <h4>${household.blockName || 'No Block Name'}</h4>
            <p><strong>Address:</strong> ${household.residentialAddress || 'No Address'}</p>
            <p><strong>Contact:</strong> ${household.contactNo || 'No Contact'}</p>
            <p><strong>Members:</strong> ${household.members ? household.members.length : 0} | 
            <strong>Children:</strong> ${household.children ? household.children.length : 0}</p>
            <p><strong>Date Added:</strong> ${new Date(household.dateAdded).toLocaleDateString()}</p>
        `;
        
        householdItem.addEventListener('click', function() {
            viewHouseholdDetails(household.householdId);
        });
        
        householdList.appendChild(householdItem);
    });
}

// View household details
async function viewHouseholdDetails(householdId) {
    try {
        const response = await fetch(`${API_URL}?action=getHouseholds&householdId=${householdId}`);
        const data = await response.json();
        
        if (data.success && data.data.households.length > 0) {
            const household = data.data.households[0];
            currentHouseholdId = householdId;
            
            displayHouseholdDetails(household);
            
            householdListSection.classList.add('hidden');
            householdDetailsSection.classList.remove('hidden');
        } else {
            throw new Error('Household not found');
        }
    } catch (error) {
        alert('Error loading household details: ' + error.message);
    }
}

// Display household details
function displayHouseholdDetails(household) {
    householdDetails.innerHTML = `
        <div class="household-info">
            <h4>Household Information</h4>
            <p><strong>Block:</strong> ${household.blockName || 'Not provided'}</p>
            <p><strong>Address:</strong> ${household.residentialAddress || 'Not provided'}</p>
            <p><strong>Contact:</strong> ${household.contactNo || 'Not provided'}</p>
            <p><strong>Date Added:</strong> ${new Date(household.dateAdded).toLocaleDateString()}</p>
        </div>
        
        <div class="members-info">
            <h4>Household Members (${household.members ? household.members.length : 0})</h4>
            ${household.members && household.members.length > 0 ? 
                household.members.map(member => `
                    <div class="member-detail">
                        <h5>${member.firstName} ${member.lastName}</h5>
                        <p><strong>Date of Birth:</strong> ${member.dateOfBirth || 'Not provided'}</p>
                        <p><strong>Catholic:</strong> ${member.catholic || 'Not provided'}</p>
                        <p><strong>Occupation:</strong> ${member.occupation || 'Not provided'}</p>
                        <p><strong>Church Activities:</strong> ${member.churchActivities || 'Not provided'}</p>
                        <p><strong>Solidarity/Ministry:</strong> ${member.solidarityMinistry || 'Not provided'}</p>
                        <p><strong>Leadership:</strong> ${member.leadership || 'Not provided'}</p>
                        
                        <div class="subsection">
                            <h6>Sacraments</h6>
                            <p><strong>Baptised:</strong> ${member.baptised || 'Not provided'}</p>
                            ${member.baptised === 'Yes' ? `
                                <p><strong>Baptism Date:</strong> ${member.dateOfBaptism || 'Not provided'}</p>
                                <p><strong>Registration No:</strong> ${member.baptismRegistrationNo || 'Not provided'}</p>
                                <p><strong>Church of Baptism:</strong> ${member.baptismChurch || 'Not provided'}</p>
                                <p><strong>Location:</strong> ${member.baptismLocation || 'Not provided'}</p>
                            ` : ''}
                            
                            <p><strong>1st Communion:</strong> ${member.firstCommunion || 'Not provided'}</p>
                            ${member.firstCommunion === 'Yes' ? `
                                <p><strong>1st Communion Date:</strong> ${member.dateFirstCommunion || 'Not provided'}</p>
                                <p><strong>Church:</strong> ${member.firstCommunionChurch || 'Not provided'}</p>
                            ` : ''}
                            
                            <p><strong>Confirmed:</strong> ${member.confirmation || 'Not provided'}</p>
                            ${member.confirmation === 'Yes' ? `
                                <p><strong>Confirmation Date:</strong> ${member.dateOfConfirmation || 'Not provided'}</p>
                                <p><strong>Church:</strong> ${member.confirmationChurch || 'Not provided'}</p>
                            ` : ''}
                        </div>
                        
                        <div class="subsection">
                            <h6>Marital Status</h6>
                            <p><strong>Status:</strong> ${member.maritalStatus || 'Not provided'}</p>
                            ${member.maritalStatus === 'Married' ? `
                                <p><strong>Civil Marriage Date:</strong> ${member.civilCourtMarriageDate || 'Not provided'}</p>
                                <p><strong>Church Marriage Date:</strong> ${member.churchMarriageDate || 'Not provided'}</p>
                                <p><strong>Church Marriage Place:</strong> ${member.churchMarriagePlace || 'Not provided'}</p>
                            ` : ''}
                            <p><strong>Divorced:</strong> ${member.divorced || 'Not provided'}</p>
                        </div>
                        
                        <div class="subsection">
                            <h6>Dikabelo</h6>
                            <p><strong>Dikabelo:</strong> ${member.dikabelo || 'Not provided'}</p>
                            ${member.dikabelo === 'Yes' ? `
                                <p><strong>Last Dikabelo Date:</strong> ${member.dateLastDikabelo || 'Not provided'}</p>
                            ` : ''}
                        </div>
                    </div>
                `).join('') : 
                '<p>No members registered for this household.</p>'
            }
        </div>
        
        <div class="children-info">
            <h4>Children (${household.children ? household.children.length : 0})</h4>
            ${household.children && household.children.length > 0 ? 
                household.children.map(child => `
                    <div class="child-detail">
                        <h5>${child.firstName} ${child.lastName}</h5>
                        <p><strong>Date of Birth:</strong> ${child.dateOfBirth || 'Not provided'}</p>
                        <p><strong>Age:</strong> ${child.age || 'Not provided'}</p>
                        <p><strong>Catholic:</strong> ${child.catholic || 'Not provided'}</p>
                        <p><strong>Church Activities:</strong> ${child.churchActivities || 'Not provided'}</p>
                        
                        <div class="subsection">
                            <h6>Sacraments</h6>
                            <p><strong>Baptised:</strong> ${child.baptised || 'Not provided'}</p>
                            ${child.baptised === 'Yes' ? `
                                <p><strong>Baptism Date:</strong> ${child.dateOfBaptism || 'Not provided'}</p>
                                <p><strong>Registration No:</strong> ${child.baptismRegistrationNo || 'Not provided'}</p>
                                <p><strong>Church of Baptism:</strong> ${child.baptismChurch || 'Not provided'}</p>
                                <p><strong>Location:</strong> ${child.baptismLocation || 'Not provided'}</p>
                            ` : ''}
                            
                            <p><strong>1st Communion:</strong> ${child.firstCommunion || 'Not provided'}</p>
                            ${child.firstCommunion === 'Yes' ? `
                                <p><strong>1st Communion Date:</strong> ${child.dateFirstCommunion || 'Not provided'}</p>
                                <p><strong>Church:</strong> ${child.firstCommunionChurch || 'Not provided'}</p>
                            ` : ''}
                            
                            <p><strong>Confirmed:</strong> ${child.confirmation || 'Not provided'}</p>
                            ${child.confirmation === 'Yes' ? `
                                <p><strong>Confirmation Date:</strong> ${child.dateOfConfirmation || 'Not provided'}</p>
                                <p><strong>Church:</strong> ${child.confirmationChurch || 'Not provided'}</p>
                            ` : ''}
                        </div>
                    </div>
                `).join('') : 
                '<p>No children registered for this household.</p>'
            }
        </div>
    `;
}

// Delete household
async function deleteHousehold(householdId) {
    try {
        const response = await fetch(`${API_URL}?action=deleteHousehold&householdId=${householdId}`);
        const data = await response.json();
        
        if (data.success) {
            alert('Household deleted successfully');
            householdDetailsSection.classList.add('hidden');
            householdListSection.classList.remove('hidden');
            loadHouseholds();
        } else {
            throw new Error(data.message || 'Delete failed');
        }
    } catch (error) {
        alert('Error deleting household: ' + error.message);
    }
}

// Print household
function printHousehold(householdId) {
    const printWindow = window.open('', '_blank');
    const householdContent = householdDetails.innerHTML;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Household Record - Our Lady of Fatima Shrine</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1, h2, h3, h4, h5 { color: #4a6741; }
                    .subsection { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
                    .member-detail, .child-detail { margin: 15px 0; padding: 10px; border: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <h1>Our Lady of Fatima Shrine</h1>
                <h2>Household Record</h2>
                ${householdContent}
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}?action=getStats`);
        const data = await response.json();
        
        if (data.success) {
            displayStatistics(data.stats);
        } else {
            throw new Error(data.message || 'Failed to load statistics');
        }
    } catch (error) {
        alert('Error loading statistics: ' + error.message);
    }
}

// Display statistics
function displayStatistics(stats) {
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Total Households</h3>
            <p>${stats.totalHouseholds}</p>
        </div>
        <div class="stat-card">
            <h3>Total Members</h3>
            <p>${stats.totalMembers}</p>
        </div>
        <div class="stat-card">
            <h3>Total Children</h3>
            <p>${stats.totalChildren}</p>
        </div>
        
        <h4>Statistics by Block</h4>
        ${Object.keys(stats.blocks).length > 0 ? 
            Object.entries(stats.blocks).map(([block, data]) => `
                <div class="stat-card">
                    <h3>${block || 'Unassigned'}</h3>
                    <p>Households: ${data.households}</p>
                    <p>Members: ${data.members}</p>
                    <p>Children: ${data.children}</p>
                </div>
            `).join('') : 
            '<p>No block statistics available.</p>'
        }
    `;

}

