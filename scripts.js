// ============================
// Healthcare Cost Prediction Dashboard
// Main JavaScript Functionality
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize table search
    initTableSearch();
});

// ============================
// Dashboard Initialization
// ============================

function initDashboard() {
    // Set the last updated timestamp
    updateLastUpdated();
    
    // Initialize date pickers
    const today = new Date();
    document.getElementById('startDate').valueAsDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    document.getElementById('endDate').valueAsDate = today;
    
    // Initialize active filters
    updateActiveFilters();
}

function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const now = new Date();
    lastUpdatedElement.textContent = formatTimeAgo(now);
    
    // Update every minute
    setInterval(() => {
        lastUpdatedElement.textContent = formatTimeAgo(now);
    }, 60000);
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// ============================
// Event Listeners
// ============================

function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });
    
    // Theme switcher
    const themeSwitcher = document.getElementById('themeSwitcher');
    themeSwitcher.addEventListener('click', toggleTheme);
    
    // Help button
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const helpModalClose = helpModal.querySelector('.close');
    
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });
    
    helpModalClose.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    const exportModal = document.getElementById('exportModal');
    const exportModalClose = exportModal.querySelector('.close');
    const exportOptions = document.querySelectorAll('.export-option');
    const confirmExport = document.getElementById('confirmExport');
    
    exportBtn.addEventListener('click', () => {
        exportModal.style.display = 'block';
    });
    
    exportModalClose.addEventListener('click', () => {
        exportModal.style.display = 'none';
    });
    
    exportOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            exportOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
    
    confirmExport.addEventListener('click', exportData);
    
    // Date range selection
    const dateRangeSelect = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    
    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
        }
    });
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Filter tags (remove individual filters)
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.remove();
            // Re-apply filters without this one
            applyFilters();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
        if (event.target === document.getElementById('chartExpandModal')) {
            document.getElementById('chartExpandModal').style.display = 'none';
        }
        if (event.target === document.getElementById('exportProgressModal')) {
            document.getElementById('exportProgressModal').style.display = 'none';
        }
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', refreshDashboard);
    
    // Collapse filters button
    const collapseFiltersBtn = document.getElementById('collapseFilters');
    collapseFiltersBtn.addEventListener('click', toggleFilters);
    
    // Chart action buttons (download, expand)
    const chartActions = document.querySelectorAll('.chart-action');
    chartActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('title');
            const chartContainer = this.closest('.chart-card').querySelector('.chart-container');
            const chartId = chartContainer.querySelector('canvas').id;
            const chartTitle = this.closest('.chart-card').querySelector('.chart-title').textContent.trim();
            
            if (action === 'Download') {
                downloadChart(chartId, chartTitle);
            } else if (action === 'Expand') {
                expandChart(chartId, chartTitle);
            }
        });
    });
    
    // Table action buttons
    const tableActions = document.querySelectorAll('.table-action');
    tableActions.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            const patientId = cells[2].textContent;
            const procedure = cells[1].textContent;
            
            showNotification(`Viewing details for Patient ${patientId} - ${procedure}`, 'info');
            // In a real application, this would open a detailed view
        });
    });
    
    // Pagination buttons
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Remove active class from all pagination buttons
                paginationBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real application, this would load the corresponding page data
                // For this demo, just update the page info text
                const page = this.textContent;
                if (!isNaN(page)) {
                    document.querySelector('.page-info').textContent = `Showing ${(parseInt(page) - 1) * 4 + 1}-${parseInt(page) * 4} of 24 claims`;
                }
            });
        }
    });
}

// ============================
// Table Search Functionality
// ============================

function initTableSearch() {
    const claimsSearch = document.getElementById('claimsSearch');
    if (claimsSearch) {
        claimsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const claimsTableRows = document.querySelectorAll('#claimsTableBody tr');
            
            claimsTableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// ============================
// View Switching
// ============================

function switchView(viewId) {
    // Hide all views
    const allViews = document.querySelectorAll('.content-view');
    allViews.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the selected view
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewId) {
            link.classList.add('active');
        }
    });
    
    // Reinitialize charts for the current view
    initCharts();
}

// ============================
// Theme Switching
// ============================

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#themeSwitcher i');
    const themeText = document.querySelector('#themeSwitcher span');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
    
    // Redraw charts to update colors
    initCharts();
}

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    const themeIcon = document.querySelector('#themeSwitcher i');
    const themeText = document.querySelector('#themeSwitcher span');
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = 'Light Mode';
}

// ============================
// Filter Functionality
// ============================

function applyFilters() {
    // Show loading overlay
    showLoading();
    
    // Get filter values
    const ageGroup = document.getElementById('ageGroup').value;
    const gender = document.getElementById('gender').value;
    const race = document.getElementById('race').value;
    const condition = document.getElementById('condition').value;
    const location = document.getElementById('location').value;
    const dateRange = document.getElementById('dateRange').value;
    
    // Build filters object
    const filters = {
        ageGroup,
        gender,
        race,
        condition,
        location,
        dateRange
    };
    
    // If custom date range is selected, include those dates
    if (dateRange === 'custom') {
        filters.startDate = document.getElementById('startDate').value;
        filters.endDate = document.getElementById('endDate').value;
    }
    
    // Update active filters display
    updateActiveFilters();
    
    // In a real application, this would fetch filtered data from a backend
    // For this demo, we'll just reload the charts with some adjusted data
    setTimeout(() => {
        initCharts(true);
        updateTableData(filters);
        hideLoading();
        showNotification('Filters applied successfully', 'success');
    }, 800);
}

function resetFilters() {
    // Reset all filter selects to first option
    const filterSelects = document.querySelectorAll('.styled-select');
    filterSelects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Hide custom date range
    document.getElementById('customDateRange').style.display = 'none';
    
    // Clear active filters
    document.querySelector('.filter-tags').innerHTML = '';
    
    // Show loading overlay
    showLoading();
    
    // Reload charts with default data
    setTimeout(() => {
        initCharts();
        updateTableData({});
        hideLoading();
        showNotification('Filters have been reset', 'success');
    }, 800);
}

function updateActiveFilters() {
    const filterTagsContainer = document.querySelector('.filter-tags');
    filterTagsContainer.innerHTML = '';
    
    // Check each filter and add tags for non-default values
    const filters = [
        { id: 'ageGroup', label: 'Age', defaultValue: 'all' },
        { id: 'gender', label: 'Gender', defaultValue: 'all' },
        { id: 'race', label: 'Race', defaultValue: 'all' },
        { id: 'condition', label: 'Condition', defaultValue: 'all' },
        { id: 'location', label: 'City', defaultValue: 'all' },
        { id: 'dateRange', label: 'Date', defaultValue: 'all' }
    ];
    
    filters.forEach(filter => {
        const element = document.getElementById(filter.id);
        if (element && element.value !== filter.defaultValue) {
            const optionText = element.options[element.selectedIndex].text;
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.innerHTML = `${filter.label}: ${optionText} <i class="fas fa-times"></i>`;
            
            tag.addEventListener('click', function() {
                // Reset this filter
                element.value = filter.defaultValue;
                this.remove();
                // Re-apply remaining filters
                applyFilters();
            });
            
            filterTagsContainer.appendChild(tag);
        }
    });
    
    // Handle custom date range
    if (document.getElementById('dateRange').value === 'custom') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (startDate && endDate) {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.innerHTML = `Date: ${startDate} to ${endDate} <i class="fas fa-times"></i>`;
            
            tag.addEventListener('click', function() {
                document.getElementById('dateRange').value = 'all';
                document.getElementById('customDateRange').style.display = 'none';
                this.remove();
                applyFilters();
            });
            
            filterTagsContainer.appendChild(tag);
        }
    }
}

function updateTableData(filters) {
    // Update Claims Table with filtered data
    if (document.getElementById('claimsTableBody')) {
        const filteredClaims = window.dashboardData.getFilteredClaims(filters);
        const tableBody = document.getElementById('claimsTableBody');
        
        // Clear existing table rows
        tableBody.innerHTML = '';
        
        // Add filtered claims (limit to first 4 for this demo)
        const displayClaims = filteredClaims.slice(0, 4);
        displayClaims.forEach(claim => {
            const row = document.createElement('tr');
            
            // Create badge based on coverage percentage
            let badgeClass = 'success';
            if (claim.coveragePercent < 75) {
                badgeClass = 'warning';
            }
            if (claim.coveragePercent < 50) {
                badgeClass = 'danger';
            }
            
            row.innerHTML = `
                <td>${claim.date}</td>
                <td>${claim.procedure}</td>
                <td>${claim.patientId.substring(0, 6)}...</td>
                <td>$${claim.baseCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>$${claim.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td><span class="badge ${badgeClass}">${claim.coveragePercent}%</span></td>
                <td>
                    <button class="btn icon-btn table-action" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            // Add event listener to the new action button
            const actionBtn = row.querySelector('.table-action');
            actionBtn.addEventListener('click', function() {
                const cells = row.querySelectorAll('td');
                const patientId = cells[2].textContent;
                const procedure = cells[1].textContent;
                
                showNotification(`Viewing details for Patient ${patientId} - ${procedure}`, 'info');
            });
            
            tableBody.appendChild(row);
        });
        
        // Update pagination info
        const pageInfo = document.querySelector('.page-info');
        if (pageInfo) {
            pageInfo.textContent = `Showing 1-${displayClaims.length} of ${filteredClaims.length} claims`;
        }
    }
}

function toggleFilters() {
    const dataDimensions = document.querySelector('.data-dimensions');
    const filterBody = document.querySelector('.filter-body');
    const collapseBtn = document.getElementById('collapseFilters');
    
    if (filterBody.style.display === 'none') {
        filterBody.style.display = 'block';
        dataDimensions.classList.remove('collapsed');
        collapseBtn.innerHTML = '<i class="fas fa-compress-alt"></i>';
    } else {
        filterBody.style.display = 'none';
        dataDimensions.classList.add('collapsed');
        collapseBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
    }
}

// ============================
// Chart Initialization and Data
// ============================

function initCharts(filtered = false) {
    // Get the active view
    const activeView = document.querySelector('.content-view.active');
    if (!activeView) return;
    
    const viewId = activeView.id;
    
    // Generate charts based on the active view
    if (viewId === 'overview') {
        initExpensesChart(filtered);
        initProceduresChart(filtered);
        initPayerCoverageChart(filtered);
        initCoverageRatioChart(filtered);
    } 
    else if (viewId === 'claims-analysis') {
        initClaimsByProcedureChart(filtered);
        initClaimsByConditionChart(filtered);
    } 
    else if (viewId === 'cost-drivers') {
        initCostTrendChart(filtered);
        initChronicConditionImpactChart(filtered);
    } 
    else if (viewId === 'payer-analysis') {
        initPayerComparisonChart(filtered);
        initCoveragePremiumChart(filtered);
    }
}

// Get varied data based on filters
function getFilteredData(baseData, filtered) {
    if (!filtered) return baseData;
    
    // Apply a random variance to simulate filtered data
    return baseData.map(value => {
        const variance = Math.random() * 0.3 + 0.85; // 85-115% variance
        return Math.round(value * variance);
    });
}

// Chart initialization functions
function initExpensesChart(filtered = false) {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [
        [4500, 5600, 7200, 9500, 12000], // White
        [4200, 5100, 6800, 9000, 11500], // Black
        [3800, 4800, 6500, 8700, 11000], // Asian
        [4100, 5300, 7000, 9200, 11700], // Hispanic
        [4300, 5500, 7100, 9300, 11800]  // Other
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(dataset => getFilteredData(dataset, filtered));
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
            datasets: [
                {
                    label: 'White',
                    data: baseData[0],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                },
                {
                    label: 'Black',
                    data: baseData[1],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)'
                },
                {
                    label: 'Asian',
                    data: baseData[2],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                },
                {
                    label: 'Hispanic',
                    data: baseData[3],
                    backgroundColor: 'rgba(255, 206, 86, 0.7)'
                },
                {
                    label: 'Other',
                    data: baseData[4],
                    backgroundColor: 'rgba(153, 102, 255, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Age Group'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Cost ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initProceduresChart(filtered = false) {
    const ctx = document.getElementById('proceduresChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [14500, 12800, 11200, 9800, 8500];
    
    // Apply filters if needed
    if (filtered) {
        baseData = getFilteredData(baseData, filtered);
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Combined chemotherapy and radiation therapy',
                'Heart bypass surgery',
                'Spinal fusion surgery',
                'Hip replacement surgery',
                'Knee replacement surgery'
            ],
            datasets: [{
                data: baseData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.x.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Cost ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initPayerCoverageChart(filtered = false) {
    const ctx = document.getElementById('payerCoverageChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [42, 32, 15, 11];
    
    // Apply filters if needed
    if (filtered) {
        baseData = getFilteredData(baseData, filtered);
        // Ensure percentages still add up to 100
        const total = baseData.reduce((a, b) => a + b, 0);
        baseData = baseData.map(value => Math.round(value / total * 100));
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Medicare', 'Medicaid', 'Commercial', 'Uninsured'],
            datasets: [{
                data: baseData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

function initCoverageRatioChart(filtered = false) {
    const ctx = document.getElementById('coverageRatioChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data for different payers
    let baseData = [
        [85, 15],   // Medicare
        [67, 33],   // Medicaid
        [75, 25],   // Commercial
        [0, 100]    // Uninsured
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(set => {
            const covered = set[0];
            const uncovered = set[1];
            
            // Apply variance to covered portion but maintain total of 100%
            const variance = Math.random() * 10 - 5; // -5% to +5% variance
            const newCovered = Math.max(0, Math.min(100, covered + variance));
            return [newCovered, 100 - newCovered];
        });
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Medicare', 'Medicaid', 'Commercial', 'Uninsured'],
            datasets: [
                {
                    label: 'Covered',
                    data: baseData.map(set => set[0]),
                    backgroundColor: 'rgba(75, 192, 192, 0.8)'
                },
                {
                    label: 'Uncovered',
                    data: baseData.map(set => set[1]),
                    backgroundColor: 'rgba(255, 99, 132, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initClaimsByProcedureChart(filtered = false) {
    const ctx = document.getElementById('claimsByProcedureChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [250, 175, 150, 125, 100, 95, 90, 85, 80, 75];
    
    // Apply filters if needed
    if (filtered) {
        baseData = getFilteredData(baseData, filtered);
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Office Visit',
                'Medication Review',
                'Vaccination',
                'Diagnostic Lab',
                'Physical Therapy',
                'Emergency Visit',
                'Surgery',
                'Radiology',
                'Mental Health',
                'Preventive Care'
            ],
            datasets: [{
                label: 'Number of Claims',
                data: baseData,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Claims'
                    }
                }
            }
        }
    });
}

function initClaimsByConditionChart(filtered = false) {
    const ctx = document.getElementById('claimsByConditionChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [
        {
            condition: 'Hypertension',
            claimCount: 180,
            avgCost: 2500
        },
        {
            condition: 'Diabetes',
            claimCount: 150,
            avgCost: 3200
        },
        {
            condition: 'Arthritis',
            claimCount: 120,
            avgCost: 1800
        },
        {
            condition: 'Asthma',
            claimCount: 100,
            avgCost: 1500
        },
        {
            condition: 'Depression',
            claimCount: 95,
            avgCost: 2100
        },
        {
            condition: 'Heart Disease',
            claimCount: 85,
            avgCost: 4500
        },
        {
            condition: 'Cancer',
            claimCount: 60,
            avgCost: 12000
        }
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(item => {
            const variance = Math.random() * 0.3 + 0.85; // 85-115% variance
            return {
                condition: item.condition,
                claimCount: Math.round(item.claimCount * variance),
                avgCost: Math.round(item.avgCost * variance)
            };
        });
    }
    
    // Sort by claim count (descending)
    baseData.sort((a, b) => b.claimCount - a.claimCount);
    
    ctx.chart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Medical Conditions',
                data: baseData.map(item => ({
                    x: item.claimCount,
                    y: item.avgCost,
                    r: Math.sqrt(item.claimCount) / 2
                })),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return [
                                `Condition: ${baseData[index].condition}`,
                                `Claims: ${baseData[index].claimCount}`,
                                `Avg. Cost: $${baseData[index].avgCost.toLocaleString()}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Claims'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Cost per Claim ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initCostTrendChart(filtered = false) {
    const ctx = document.getElementById('costTrendChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data - 12 months of costs for 5 age groups
    let baseData = [
        // 0-18
        [1200, 1250, 1270, 1300, 1320, 1340, 1350, 1370, 1390, 1410, 1430, 1450],
        // 19-35
        [1800, 1850, 1890, 1920, 1950, 1980, 2010, 2040, 2070, 2100, 2130, 2160],
        // 36-50
        [2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950],
        // 51-65
        [3200, 3270, 3340, 3410, 3480, 3550, 3620, 3690, 3760, 3830, 3900, 3970],
        // 65+
        [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600]
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(dataset => getFilteredData(dataset, filtered));
    }
    
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '0-18',
                    data: baseData[0],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '19-35',
                    data: baseData[1],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '36-50',
                    data: baseData[2],
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '51-65',
                    data: baseData[3],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '65+',
                    data: baseData[4],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Cost per Patient ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initChronicConditionImpactChart(filtered = false) {
    const ctx = document.getElementById('chronicConditionImpactChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Cancer'];
    let chronicsData = [2.4, 1.8, 1.5, 3.2, 4.5]; // Cost multipliers
    
    // Apply filters if needed
    if (filtered) {
        chronicsData = getFilteredData(chronicsData, filtered);
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: conditions,
            datasets: [
                {
                    label: 'Cost Multiplier',
                    data: chronicsData,
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value + 'x';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.r}x cost multiplier`;
                        }
                    }
                }
            }
        }
    });
}

function initPayerComparisonChart(filtered = false) {
    const ctx = document.getElementById('payerComparisonChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [
        {
            payer: 'Medicare',
            coverage: 85,
            responseTime: 12,
            denialRate: 7.5,
            satisfaction: 79
        },
        {
            payer: 'Medicaid',
            coverage: 67,
            responseTime: 18,
            denialRate: 12.3,
            satisfaction: 81
        },
        {
            payer: 'Humana',
            coverage: 46,
            responseTime: 9,
            denialRate: 9.8,
            satisfaction: 91
        },
        {
            payer: 'Dual Eligible',
            coverage: 54,
            responseTime: 15,
            denialRate: 5.2,
            satisfaction: 36
        }
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(item => {
            const variance = Math.random() * 0.2 + 0.9; // 90-110% variance
            return {
                payer: item.payer,
                coverage: Math.min(100, Math.round(item.coverage * variance)),
                responseTime: Math.max(1, Math.round(item.responseTime * (2 - variance))), // Inverse for response time (lower is better)
                denialRate: Math.max(0, Math.round(item.denialRate * (2 - variance) * 10) / 10), // Inverse for denial rate
                satisfaction: Math.min(100, Math.round(item.satisfaction * variance))
            };
        });
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: baseData.map(item => item.payer),
            datasets: [
                {
                    label: 'Coverage %',
                    data: baseData.map(item => item.coverage),
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                },
                {
                    label: 'Customer Satisfaction %',
                    data: baseData.map(item => item.satisfaction),
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initCoveragePremiumChart(filtered = false) {
    const ctx = document.getElementById('coveragePremiumChart');
    if (!ctx) return;
    
    // Clear existing chart if any
    if (ctx.chart) ctx.chart.destroy();
    
    // Base data
    let baseData = [
        { payer: 'Medicare', coverage: 85, premium: 240 },
        { payer: 'Medicaid', coverage: 67, premium: 0 },
        { payer: 'Humana', coverage: 46, premium: 380 },
        { payer: 'Blue Cross', coverage: 78, premium: 420 },
        { payer: 'Kaiser', coverage: 82, premium: 450 },
        { payer: 'United', coverage: 75, premium: 400 },
        { payer: 'Aetna', coverage: 72, premium: 390 }
    ];
    
    // Apply filters if needed
    if (filtered) {
        baseData = baseData.map(item => {
            const variance = Math.random() * 0.2 + 0.9; // 90-110% variance
            return {
                payer: item.payer,
                coverage: Math.min(100, Math.round(item.coverage * variance)),
                premium: Math.round(item.premium * variance)
            };
        });
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Payers',
                data: baseData.map(item => ({
                    x: item.premium,
                    y: item.coverage
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return [
                                `Payer: ${baseData[index].payer}`,
                                `Premium: $${baseData[index].premium}/month`,
                                `Coverage: ${baseData[index].coverage}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Monthly Premium ($)'
                    },
                    suggestedMin: 0,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Coverage Percentage'
                    },
                    suggestedMin: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ============================
// Data Export Functions
// ============================

function exportData() {
    const activeFormat = document.querySelector('.export-option.active');
    if (!activeFormat) {
        showNotification('Please select an export format', 'error');
        return;
    }
    
    const format = formatToExtension(activeFormat.getAttribute('data-format'));
    const settings = getExportSettings();
    
    // Show export progress modal
    const exportProgressModal = document.getElementById('exportProgressModal');
    const progressBar = document.getElementById('exportProgressBar');
    const progressText = document.getElementById('exportProgressText');
    exportProgressModal.style.display = 'block';
    
    // Update progress bar and text
    progressBar.style.width = '0%';
    progressText.textContent = 'Preparing data...';
    
    // Hide export options modal
    document.getElementById('exportModal').style.display = 'none';
    
    // Simulate export process
    setTimeout(() => {
        progressBar.style.width = '30%';
        progressText.textContent = 'Collecting dashboard data...';
        
        setTimeout(() => {
            progressBar.style.width = '60%';
            progressText.textContent = 'Formatting data...';
            
            setTimeout(() => {
                progressBar.style.width = '90%';
                progressText.textContent = 'Creating export file...';
                
                setTimeout(() => {
                    progressBar.style.width = '100%';
                    progressText.textContent = 'Export complete!';
                    
                    // Generate appropriate export based on format
                    generateExport(format, settings);
                    
                    // Hide export progress modal after a delay
                    setTimeout(() => {
                        exportProgressModal.style.display = 'none';
                    }, 1000);
                }, 800);
            }, 700);
        }, 600);
    }, 500);
}

function formatToExtension(format) {
    switch(format) {
        case 'csv': return 'csv';
        case 'excel': return 'xlsx';
        case 'pdf': return 'pdf';
        case 'image': return 'png';
        default: return 'csv';
    }
}

function getExportSettings() {
    const settings = {};
    
    // Get checkbox values
    settings.includeCharts = document.getElementById('includeCharts').checked;
    settings.includeTables = document.getElementById('includeTables').checked;
    settings.includeFilters = document.getElementById('includeFilters').checked;
    
    // Get date range
    settings.dateRange = document.getElementById('exportDateRange').value;
    
    return settings;
}

function generateExport(format, settings) {
    // Get current view data
    const activeView = document.querySelector('.content-view.active');
    const viewName = activeView.id;
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `healthcare_dashboard_${viewName}_${timestamp}.${format}`;
    
    let data;
    
    // Generate export content based on format
    switch(format) {
        case 'csv':
            // Generate CSV data based on current view
            data = generateCSV(viewName);
            downloadFile(data, fileName, 'text/csv');
            break;
            
        case 'xlsx':
            // In a real app, you would use a library like SheetJS to create Excel files
            // For this demo, we'll just show a notification
            showNotification('Excel export is not implemented in this demo', 'info');
            break;
            
        case 'pdf':
            // In a real app, you would use a library like jsPDF to create PDF files
            // For this demo, we'll just show a notification
            showNotification('PDF export is not implemented in this demo', 'info');
            break;
            
        case 'png':
            // Export the first chart in the active view as an image
            const firstCanvas = activeView.querySelector('canvas');
            if (firstCanvas) {
                // In a real app, this would download the chart as an image
                const imageURL = firstCanvas.toDataURL('image/png');
                
                // Create a temporary link and trigger download
                const link = document.createElement('a');
                link.href = imageURL;
                link.download = fileName;
                link.click();
            } else {
                showNotification('No chart available to export as image', 'error');
            }
            break;
            
        default:
            showNotification('Unknown export format', 'error');
    }
    
    showNotification(`Data exported successfully as ${fileName}`, 'success');
}

function generateCSV(viewName) {
    let csvContent = '';
    let headers = [];
    let rows = [];
    
    // Generate different CSV content based on view
    switch(viewName) {
        case 'overview':
            headers = ['Age Group', 'White', 'Black', 'Asian', 'Hispanic', 'Other'];
            rows = [
                ['0-18', '4500', '4200', '3800', '4100', '4300'],
                ['19-35', '5600', '5100', '4800', '5300', '5500'],
                ['36-50', '7200', '6800', '6500', '7000', '7100'],
                ['51-65', '9500', '9000', '8700', '9200', '9300'],
                ['65+', '12000', '11500', '11000', '11700', '11800']
            ];
            break;
            
        case 'claims-analysis':
            // Get claims table data if available
            const table = document.getElementById('claimsTable');
            if (table) {
                // Get headers
                const headerRow = table.querySelector('thead tr');
                headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                
                // Get rows
                const tableRows = table.querySelectorAll('tbody tr');
                rows = Array.from(tableRows).map(row => {
                    return Array.from(row.querySelectorAll('td')).map(td => {
                        // Clean up the text content (remove unnecessary whitespace)
                        return td.textContent.trim().replace(/\s+/g, ' ');
                    });
                });
            } else {
                // Fallback data
                headers = ['Date', 'Procedure', 'Patient ID', 'Base Cost', 'Total Cost', 'Coverage'];
                rows = window.dashboardData.claimsData.slice(0, 10).map(claim => [
                    claim.date,
                    claim.procedure,
                    claim.patientId,
                    `$${claim.baseCost.toFixed(2)}`,
                    `$${claim.totalCost.toFixed(2)}`,
                    `${claim.coveragePercent}%`
                ]);
            }
            break;
            
        case 'cost-drivers':
            headers = ['Condition', 'Cost Multiplier', 'Average Cost', 'Claim Count'];
            rows = window.dashboardData.conditionsData.map(condition => [
                condition.name,
                condition.costMultiplier.toFixed(1) + 'x',
                '$' + condition.avgCost.toLocaleString(),
                condition.claimCount
            ]);
            break;
            
        case 'payer-analysis':
            headers = ['Payer', 'Coverage %', 'Response Time (days)', 'Denial Rate %', 'Customer Satisfaction %'];
            rows = window.dashboardData.payerData.map(payer => [
                payer.name,
                payer.coverageAvg.toFixed(1) + '%',
                payer.responseTime,
                payer.denialRate.toFixed(1) + '%',
                payer.satisfaction + '%'
            ]);
            break;
            
        default:
            // Default export with basic healthcare data
            headers = ['Category', 'Value'];
            rows = [
                ['Total Patients', '100'],
                ['Average Claim Cost', '$1,842'],
                ['Total Healthcare Expenses', '$28.5M'],
                ['Prediction Accuracy', '86.4%']
            ];
    }
    
    // Build CSV content
    csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
}

// ============================
// Chart Interaction
// ============================

function downloadChart(chartId, chartTitle) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    try {
        // Convert canvas to image and download
        const imageURL = canvas.toDataURL('image/png');
        const timestamp = new Date().toISOString().slice(0, 10);
        const fileName = `${chartId}_${timestamp}.png`;
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`Chart downloaded as ${fileName}`, 'success');
    } catch (error) {
        console.error('Error downloading chart:', error);
        showNotification('Failed to download chart', 'error');
    }
}

function expandChart(chartId, chartTitle) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    const expandModal = document.getElementById('chartExpandModal');
    const expandedChart = document.getElementById('expandedChart');
    const expandedTitle = document.getElementById('expandedChartTitle');
    
    // Set modal title
    expandedTitle.innerHTML = `<i class="fas fa-chart-bar"></i> ${chartTitle}`;
    
    // Show the modal
    expandModal.style.display = 'block';
    
    // Clone the chart configuration to the expanded canvas
    if (expandedChart && canvas.chart) {
        const expandedCtx = expandedChart.getContext('2d');
        
        // Destroy existing chart if any
        if (expandedChart.chart) {
            expandedChart.chart.destroy();
        }
        
        // Clone the chart configuration
        const chartConfig = canvas.chart.config;
        
        // Create a new chart with the same configuration
        expandedChart.chart = new Chart(expandedCtx, {
            type: chartConfig.type,
            data: JSON.parse(JSON.stringify(chartConfig.data)),
            options: JSON.parse(JSON.stringify(chartConfig.options))
        });
    }
}

// ============================
// Dashboard Utilities
// ============================

function refreshDashboard() {
    // Show loading overlay
    showLoading();
    
    // Simulate data refresh (network delay)
    setTimeout(() => {
        // Reload charts with "new" data
        initCharts(true);
        
        // Update table data
        updateTableData({});
        
        // Update last updated timestamp
        document.getElementById('lastUpdated').textContent = 'just now';
        
        // Hide loading overlay
        hideLoading();
        
        // Show success message
        showNotification('Dashboard data refreshed successfully', 'success');
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification type class (info, success, error)
    notification.className = `notification ${type}`;
    
    // Set notification message
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}