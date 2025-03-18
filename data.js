// ============================
// Healthcare Cost Prediction Dashboard
// Sample Dataset and Data Handling
// ============================

// This file contains sample data and utility functions for the dashboard

// Sample patients data
const patientsData = [
    { id: "8d4c43a1", age: 67, gender: "F", race: "white", city: "San Diego", condition: "Chronic Sinusitis" },
    { id: "10339b2c", age: 42, gender: "M", race: "black", city: "Hayward", condition: "Viral Sinusitis" },
    { id: "f5dcd4e3", age: 29, gender: "F", race: "asian", city: "Burlingame", condition: "Acute Viral Pharyngitis" },
    { id: "72a91f4d", age: 55, gender: "M", race: "white", city: "Los Angeles", condition: "Hypertension" },
    { id: "e38f2c5a", age: 38, gender: "F", race: "hispanic", city: "Menifee", condition: "Diabetes" },
    { id: "9b4d7c6e", age: 71, gender: "M", race: "white", city: "San Diego", condition: "Heart Disease" },
    { id: "5a3e8d2f", age: 32, gender: "F", race: "black", city: "Indio", condition: "Asthma" },
    { id: "c7b9e1a4", age: 61, gender: "M", race: "asian", city: "Hayward", condition: "Arthritis" },
    { id: "d2e6f8a3", age: 45, gender: "F", race: "white", city: "Los Angeles", condition: "Depression" },
    { id: "b4c8d7e6", age: 59, gender: "M", race: "hispanic", city: "Menifee", condition: "Cancer" },
    // Additional patients for more data
    { id: "7f2e5d1a", age: 24, gender: "F", race: "white", city: "San Diego", condition: "Asthma" },
    { id: "3c9b8a7d", age: 51, gender: "M", race: "black", city: "Los Angeles", condition: "Hypertension" },
    { id: "6e5d4c3b", age: 37, gender: "F", race: "asian", city: "Indio", condition: "Diabetes" },
    { id: "2a1b3c4d", age: 63, gender: "M", race: "hispanic", city: "Burlingame", condition: "Heart Disease" },
    { id: "8g7f6e5d", age: 28, gender: "F", race: "white", city: "Hayward", condition: "Acute Bronchitis" },
    { id: "9h8g7f6e", age: 49, gender: "M", race: "asian", city: "Menifee", condition: "Chronic Sinusitis" },
    { id: "4d5e6f7g", age: 72, gender: "F", race: "black", city: "San Diego", condition: "Cancer" },
    { id: "1a2b3c4d", age: 35, gender: "M", race: "white", city: "Los Angeles", condition: "Viral Sinusitis" },
    { id: "5e6f7g8h", age: 41, gender: "F", race: "hispanic", city: "Indio", condition: "Depression" },
    { id: "9i8h7g6f", age: 58, gender: "M", race: "asian", city: "Hayward", condition: "Arthritis" }
];

// Sample claims data
const claimsData = [
    {
        id: "CL001",
        date: "2011-04-30",
        procedure: "Insertion of subcutaneous contraceptive",
        patientId: "8d4c43a1",
        baseCost: 14896.56,
        totalCost: 15890.32,
        coveragePercent: 85
    },
    {
        id: "CL002",
        date: "2010-07-27",
        procedure: "Medication Reconciliation",
        patientId: "10339b2c",
        baseCost: 726.51,
        totalCost: 842.30,
        coveragePercent: 92
    },
    {
        id: "CL003",
        date: "2011-02-07",
        procedure: "Throat culture (procedure)",
        patientId: "f5dcd4e3",
        baseCost: 2070.44,
        totalCost: 2583.05,
        coveragePercent: 73
    },
    {
        id: "CL004",
        date: "2010-11-20",
        procedure: "Medication Reconciliation",
        patientId: "f5dcd4e3",
        baseCost: 788.50,
        totalCost: 942.18,
        coveragePercent: 87
    },
    {
        id: "CL005",
        date: "2011-05-15",
        procedure: "Office Visit",
        patientId: "72a91f4d",
        baseCost: 165.75,
        totalCost: 195.20,
        coveragePercent: 85
    },
    {
        id: "CL006",
        date: "2011-03-22",
        procedure: "Combined chemotherapy and radiation therapy",
        patientId: "b4c8d7e6",
        baseCost: 12850.32,
        totalCost: 14520.75,
        coveragePercent: 78
    },
    {
        id: "CL007",
        date: "2011-06-08",
        procedure: "Vaccination",
        patientId: "5a3e8d2f",
        baseCost: 125.50,
        totalCost: 155.30,
        coveragePercent: 95
    },
    {
        id: "CL008",
        date: "2011-01-17",
        procedure: "Diagnostic Lab",
        patientId: "e38f2c5a",
        baseCost: 350.25,
        totalCost: 412.80,
        coveragePercent: 80
    },
    {
        id: "CL009",
        date: "2011-04-05",
        procedure: "Physical Therapy",
        patientId: "c7b9e1a4",
        baseCost: 520.75,
        totalCost: 615.90,
        coveragePercent: 70
    },
    {
        id: "CL010",
        date: "2011-02-28",
        procedure: "Mental Health Consultation",
        patientId: "d2e6f8a3",
        baseCost: 210.35,
        totalCost: 245.80,
        coveragePercent: 65
    },
    {
        id: "CL011",
        date: "2011-05-30",
        procedure: "Heart bypass surgery",
        patientId: "9b4d7c6e",
        baseCost: 11250.45,
        totalCost: 12845.30,
        coveragePercent: 83
    },
    {
        id: "CL012",
        date: "2011-03-12",
        procedure: "Emergency Visit",
        patientId: "8d4c43a1",
        baseCost: 1580.60,
        totalCost: 1895.70,
        coveragePercent: 75
    },
    // Additional claims for more data
    {
        id: "CL013",
        date: "2011-06-18",
        procedure: "Spinal fusion surgery",
        patientId: "c7b9e1a4",
        baseCost: 10450.20,
        totalCost: 11250.40,
        coveragePercent: 82
    },
    {
        id: "CL014",
        date: "2011-04-22",
        procedure: "Hip replacement surgery",
        patientId: "9b4d7c6e",
        baseCost: 9050.75,
        totalCost: 9820.30,
        coveragePercent: 79
    },
    {
        id: "CL015",
        date: "2011-05-10",
        procedure: "Knee replacement surgery",
        patientId: "3c9b8a7d",
        baseCost: 8120.40,
        totalCost: 8750.20,
        coveragePercent: 81
    },
    {
        id: "CL016",
        date: "2011-03-05",
        procedure: "Office Visit",
        patientId: "7f2e5d1a",
        baseCost: 145.30,
        totalCost: 168.75,
        coveragePercent: 90
    },
    {
        id: "CL017",
        date: "2011-02-14",
        procedure: "Vaccination",
        patientId: "6e5d4c3b",
        baseCost: 132.60,
        totalCost: 148.90,
        coveragePercent: 92
    },
    {
        id: "CL018",
        date: "2011-01-25",
        procedure: "Diagnostic Lab",
        patientId: "2a1b3c4d",
        baseCost: 325.40,
        totalCost: 385.20,
        coveragePercent: 76
    },
    {
        id: "CL019",
        date: "2011-06-30",
        procedure: "Physical Therapy",
        patientId: "8g7f6e5d",
        baseCost: 485.30,
        totalCost: 560.15,
        coveragePercent: 72
    },
    {
        id: "CL020",
        date: "2011-05-22",
        procedure: "Mental Health Consultation",
        patientId: "9h8g7f6e",
        baseCost: 195.50,
        totalCost: 230.80,
        coveragePercent: 68
    },
    {
        id: "CL021",
        date: "2011-04-17",
        procedure: "Emergency Visit",
        patientId: "4d5e6f7g",
        baseCost: 1420.75,
        totalCost: 1750.20,
        coveragePercent: 77
    },
    {
        id: "CL022",
        date: "2011-03-29",
        procedure: "Medication Reconciliation",
        patientId: "5e6f7g8h",
        baseCost: 698.40,
        totalCost: 820.15,
        coveragePercent: 85
    },
    {
        id: "CL023",
        date: "2011-02-11",
        procedure: "Throat culture (procedure)",
        patientId: "1a2b3c4d",
        baseCost: 1985.30,
        totalCost: 2350.45,
        coveragePercent: 76
    },
    {
        id: "CL024",
        date: "2011-01-03",
        procedure: "Office Visit",
        patientId: "9i8h7g6f",
        baseCost: 150.60,
        totalCost: 175.80,
        coveragePercent: 88
    }
];

// Sample payer data
const payerData = [
    {
        id: "P001",
        name: "Medicare",
        type: "Government",
        coverageAvg: 85.2,
        responseTime: 12,
        denialRate: 7.5,
        satisfaction: 79
    },
    {
        id: "P002",
        name: "Medicaid",
        type: "Government",
        coverageAvg: 66.7,
        responseTime: 18,
        denialRate: 12.3,
        satisfaction: 81
    },
    {
        id: "P003",
        name: "Humana",
        type: "Commercial",
        coverageAvg: 45.9,
        responseTime: 9,
        denialRate: 9.8,
        satisfaction: 91
    },
    {
        id: "P004",
        name: "Blue Cross",
        type: "Commercial",
        coverageAvg: 78.3,
        responseTime: 8,
        denialRate: 6.2,
        satisfaction: 87
    },
    {
        id: "P005",
        name: "Dual Eligible",
        type: "Mixed",
        coverageAvg: 54.3,
        responseTime: 15,
        denialRate: 5.2,
        satisfaction: 36
    },
    {
        id: "P006",
        name: "Kaiser",
        type: "Commercial",
        coverageAvg: 82.1,
        responseTime: 7,
        denialRate: 4.8,
        satisfaction: 94
    },
    {
        id: "P007",
        name: "United",
        type: "Commercial",
        coverageAvg: 75.4,
        responseTime: 10,
        denialRate: 8.1,
        satisfaction: 82
    },
    {
        id: "P008",
        name: "Aetna",
        type: "Commercial",
        coverageAvg: 72.8,
        responseTime: 11,
        denialRate: 7.9,
        satisfaction: 85
    }
];

// Sample procedures data with costs
const proceduresData = [
    {
        id: "PR001",
        name: "Combined chemotherapy and radiation therapy",
        avgCost: 14500,
        frequency: 125
    },
    {
        id: "PR002",
        name: "Heart bypass surgery",
        avgCost: 12800,
        frequency: 78
    },
    {
        id: "PR003",
        name: "Spinal fusion surgery",
        avgCost: 11200,
        frequency: 92
    },
    {
        id: "PR004",
        name: "Hip replacement surgery",
        avgCost: 9800,
        frequency: 134
    },
    {
        id: "PR005",
        name: "Knee replacement surgery",
        avgCost: 8500,
        frequency: 156
    },
    {
        id: "PR006",
        name: "Office Visit",
        avgCost: 180,
        frequency: 1250
    },
    {
        id: "PR007",
        name: "Medication Reconciliation",
        avgCost: 750,
        frequency: 875
    },
    {
        id: "PR008",
        name: "Vaccination",
        avgCost: 140,
        frequency: 780
    },
    {
        id: "PR009",
        name: "Diagnostic Lab",
        avgCost: 380,
        frequency: 950
    },
    {
        id: "PR010",
        name: "Physical Therapy",
        avgCost: 560,
        frequency: 680
    }
];

// Sample health conditions data with costs
const conditionsData = [
    {
        id: "C001",
        name: "Hypertension",
        claimCount: 180,
        avgCost: 2500,
        costMultiplier: 1.8
    },
    {
        id: "C002",
        name: "Diabetes",
        claimCount: 150,
        avgCost: 3200,
        costMultiplier: 2.4
    },
    {
        id: "C003",
        name: "Arthritis",
        claimCount: 120,
        avgCost: 1800,
        costMultiplier: 1.5
    },
    {
        id: "C004",
        name: "Asthma",
        claimCount: 100,
        avgCost: 1500,
        costMultiplier: 1.5
    },
    {
        id: "C005",
        name: "Depression",
        claimCount: 95,
        avgCost: 2100,
        costMultiplier: 1.6
    },
    {
        id: "C006",
        name: "Heart Disease",
        claimCount: 85,
        avgCost: 4500,
        costMultiplier: 3.2
    },
    {
        id: "C007",
        name: "Cancer",
        claimCount: 60,
        avgCost: 12000,
        costMultiplier: 4.5
    },
    {
        id: "C008",
        name: "Chronic Sinusitis",
        claimCount: 75,
        avgCost: 1200,
        costMultiplier: 1.2
    },
    {
        id: "C009",
        name: "Viral Sinusitis",
        claimCount: 65,
        avgCost: 850,
        costMultiplier: 1.1
    },
    {
        id: "C010",
        name: "Acute Viral Pharyngitis",
        claimCount: 85,
        avgCost: 750,
        costMultiplier: 1.0
    }
];

// Sample monthly costs data by age group
const monthlyCostsData = {
    "0-18": [1200, 1250, 1270, 1300, 1320, 1340, 1350, 1370, 1390, 1410, 1430, 1450],
    "19-35": [1800, 1850, 1890, 1920, 1950, 1980, 2010, 2040, 2070, 2100, 2130, 2160],
    "36-50": [2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950],
    "51-65": [3200, 3270, 3340, 3410, 3480, 3550, 3620, 3690, 3760, 3830, 3900, 3970],
    "65+": [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600]
};

// Sample healthcare expenses by age group and race
const healthcareExpensesData = {
    "0-18": {
        "White": 4500,
        "Black": 4200,
        "Asian": 3800,
        "Hispanic": 4100,
        "Other": 4300
    },
    "19-35": {
        "White": 5600,
        "Black": 5100,
        "Asian": 4800,
        "Hispanic": 5300,
        "Other": 5500
    },
    "36-50": {
        "White": 7200,
        "Black": 6800,
        "Asian": 6500,
        "Hispanic": 7000,
        "Other": 7100
    },
    "51-65": {
        "White": 9500,
        "Black": 9000,
        "Asian": 8700,
        "Hispanic": 9200,
        "Other": 9300
    },
    "65+": {
        "White": 12000,
        "Black": 11500,
        "Asian": 11000,
        "Hispanic": 11700,
        "Other": 11800
    }
};

// Helper functions to get data based on filters
function getFilteredPatients(filters = {}) {
    if (!Object.keys(filters).length) return patientsData;
    
    return patientsData.filter(patient => {
        if (filters.ageGroup && filters.ageGroup !== 'all') {
            const ageRange = filters.ageGroup.split('-');
            if (ageRange.length === 2) {
                const minAge = parseInt(ageRange[0]);
                const maxAge = parseInt(ageRange[1]);
                if (patient.age < minAge || patient.age > maxAge) return false;
            } else if (filters.ageGroup === '65+') {
                if (patient.age < 65) return false;
            }
        }
        
        if (filters.gender && filters.gender !== 'all' && patient.gender.toLowerCase() !== filters.gender.toLowerCase()[0]) return false;
        if (filters.race && filters.race !== 'all' && patient.race.toLowerCase() !== filters.race.toLowerCase()) return false;
        if (filters.location && filters.location !== 'all' && patient.city.toLowerCase() !== filters.location.toLowerCase()) return false;
        if (filters.condition && filters.condition !== 'all' && !patient.condition.toLowerCase().includes(filters.condition.toLowerCase())) return false;
        
        return true;
    });
}


function getFilteredClaims(filters = {}) {
    if (!Object.keys(filters).length) return claimsData;
    
    let filteredClaims = claimsData;
    
    // Filter by date range if specified
    if (filters.dateRange && filters.dateRange !== 'all') {
        const today = new Date();
        let startDate;
        
        switch (filters.dateRange) {
            case 'last30':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                break;
            case 'last90':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 90);
                break;
            case 'last180':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 180);
                break;
            case 'last365':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 365);
                break;
            case 'custom':
                if (filters.startDate && filters.endDate) {
                    startDate = new Date(filters.startDate);
                    const endDate = new Date(filters.endDate);
                    
                    filteredClaims = filteredClaims.filter(claim => {
                        const claimDate = new Date(claim.date);
                        return claimDate >= startDate && claimDate <= endDate;
                    });
                    
                    // Skip the default date filtering
                    break;
                }
                // Fall through to default if custom dates aren't provided
            default:
                // No date filtering
                break;
        }
        
        if (startDate) {
            filteredClaims = filteredClaims.filter(claim => {
                const claimDate = new Date(claim.date);
                return claimDate >= startDate;
            });
        }
    }
    
    // Filter by patient characteristics if needed
    if (filters.ageGroup || filters.gender || filters.race || filters.city || filters.condition) {
        const filteredPatientIds = getFilteredPatients(filters).map(p => p.id);
        filteredClaims = filteredClaims.filter(claim => filteredPatientIds.includes(claim.patientId));
    }
    
    return filteredClaims;
}

// Export the functions and data for use in the main script
window.dashboardData = {
    getFilteredPatients,
    getFilteredClaims,
    patientsData,
    claimsData,
    payerData,
    proceduresData,
    conditionsData,
    monthlyCostsData,
    healthcareExpensesData
};