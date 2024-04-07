$(document).ready(function() {
    const amenityIds = {}; // Object to store Amenity IDs

    // Listen for changes on each input checkbox tag
    $('.amenities .popover ul li input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id'); // Get the Amenity ID from the data-id attribute
        const amenityName = $(this).data('name');

        // If the checkbox is checked, store the Amenity ID in the variable
        if ($(this).is(':checked')) {
            amenityIds[amenityId] = amenityName;
        } else { // If the checkbox is unchecked, remove the Amenity ID from the variable
            delete amenityIds[amenityId];
        }

        // Update the h4 tag inside the div Amenities with the list of Amenities checked
        const amenitiesList = Object.values(amenityIds).join(', '); // Create a comma-separated list of Amenity IDs
        $('.amenities h4').text('Amenities: ' + amenitiesList);
    });
});
