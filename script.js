// Toggle between For Sale and For Rent
let showingForSale = true;
// Throttle function to limit how often a function is called
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}
// Function to validate and filter properties
function validateAndFilter() {
    const searchInput = document.getElementById('search');
    const search = searchInput.value.trim().toLowerCase();
    const searchError = document.getElementById('searchError');
    const maxPriceInput = document.getElementById('maxPrice');
    const maxPrice = parseFloat(maxPriceInput.value);
    const priceError = document.getElementById('priceError');
    const minBedroomsSelect = document.getElementById('minBedrooms');
    const minBedrooms = parseInt(minBedroomsSelect.value);
    const bedroomsError = document.getElementById('bedroomsError');
    const locationSelect = document.getElementById('location');
    const location = locationSelect.value;
    const locationError = document.getElementById('locationError');
    if (!search) {
        searchError.textContent = 'Please enter a search term.';
        searchInput.classList.add('error-input');
    } else if (search.length < 3) {
        searchError.textContent = 'Search term must be at least 3 characters.';
        searchInput.classList.add('error-input');
    } else {
        searchError.textContent = '';
        searchInput.classList.remove('error-input');
    }
    if (!maxPriceInput.value) {
        priceError.textContent = 'Please enter a maximum price.';
        maxPriceInput.classList.add('error-input');
    } else if (isNaN(maxPrice) || maxPrice <= 0) {
        priceError.textContent = 'Please enter a positive number.';
        maxPriceInput.classList.add('error-input');
    } else {
        priceError.textContent = '';
        maxPriceInput.classList.remove('error-input');
    }
    if (!minBedroomsSelect.value) {
        bedroomsError.textContent = 'Please select a number of bedrooms.';
        minBedroomsSelect.classList.add('error-select');
    } else {
        bedroomsError.textContent = '';
        minBedroomsSelect.classList.remove('error-select');
    }
    if (!locationSelect.value) {
        locationError.textContent = 'Please select a location.';
        locationSelect.classList.add('error-select');
    } else {
        locationError.textContent = '';
        locationSelect.classList.remove('error-select');
    }
    updatePropertyVisibility();
}
const throttledValidateAndFilter = throttle(validateAndFilter, 300);
function toggleProperties() {
    const properties = document.querySelectorAll('.property-card');
    const toggleBtn = document.getElementById('toggleBtn');
    const searchInput = document.getElementById('search');
    const searchError = document.getElementById('searchError');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceError = document.getElementById('priceError');
    const minBedroomsSelect = document.getElementById('minBedrooms');
    const bedroomsError = document.getElementById('bedroomsError');
    const locationSelect = document.getElementById('location');
    const locationError = document.getElementById('locationError');
    showingForSale = !showingForSale;
    toggleBtn.textContent = showingForSale ? 'Show For Rent' : 'Show For Sale';
    searchInput.value = '';
    searchInput.classList.remove('error-input');
    searchError.textContent = '';
    maxPriceInput.value = '';
    maxPriceInput.classList.remove('error-input');
    priceError.textContent = '';
    minBedroomsSelect.value = '';
    minBedroomsSelect.classList.remove('error-select');
    bedroomsError.textContent = '';
    locationSelect.value = '';
    locationSelect.classList.remove('error-select');
    locationError.textContent = '';
    updatePropertyVisibility();
}
document.getElementById('search').addEventListener('input', throttledValidateAndFilter);
document.getElementById('maxPrice').addEventListener('input', throttledValidateAndFilter);
document.getElementById('minBedrooms').addEventListener('change', throttledValidateAndFilter);
document.getElementById('location').addEventListener('change', throttledValidateAndFilter);
document.getElementById('priceFilterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    validateAndFilter();
});
function updatePropertyVisibility() {
    const search = document.getElementById('search').value.trim().toLowerCase();
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const minBedrooms = parseInt(document.getElementById('minBedrooms').value);
    const location = document.getElementById('location').value;
    const properties = document.querySelectorAll('.property-card');
    properties.forEach(property => {
        const price = parseFloat(property.getAttribute('data-price'));
        const bedrooms = parseInt(property.getAttribute('data-bedrooms'));
        const propertyLocation = property.getAttribute('data-location');
        const type = property.getAttribute('data-type');
        const title = property.querySelector('h3').textContent.toLowerCase();
        const description = property.querySelector('p').textContent.toLowerCase();
        const matchesType = showingForSale ? type === 'sale' : type === 'rent';
        const matchesPrice = isNaN(maxPrice) || maxPrice <= 0 || price <= maxPrice;
        const matchesBedrooms = isNaN(minBedrooms) || bedrooms >= minBedrooms;
        const matchesLocation = !location || propertyLocation === location;
        const matchesSearch = !search || search.length < 3 || title.includes(search) || description.includes(search);
        property.classList.toggle('hidden', !matchesType || !matchesPrice || !matchesBedrooms || !matchesLocation || !matchesSearch);
    });
}
function resetFilter() {
    const searchInput = document.getElementById('search');
    const searchError = document.getElementById('searchError');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceError = document.getElementById('priceError');
    const minBedroomsSelect = document.getElementById('minBedrooms');
    const bedroomsError = document.getElementById('bedroomsError');
    const locationSelect = document.getElementById('location');
    const locationError = document.getElementById('locationError');
    const properties = document.querySelectorAll('.property-card');
    properties.forEach(property => {
        property.classList.add('fade-out');
    });
    setTimeout(() => {
        searchInput.value = '';
        searchInput.classList.remove('error-input');
        searchError.textContent = '';
        maxPriceInput.value = '';
        maxPriceInput.classList.remove('error-input');
        priceError.textContent = '';
        minBedroomsSelect.value = '';
        minBedroomsSelect.classList.remove('error-select');
        bedroomsError.textContent = '';
        locationSelect.value = '';
        locationSelect.classList.remove('error-select');
        locationError.textContent = '';
        updatePropertyVisibility();
        properties.forEach(property => {
            property.classList.remove('fade-out');
            property.classList.add('fade-in');
            setTimeout(() => {
                property.classList.remove('fade-in');
            }, 500);
        });
    }, 500);
}