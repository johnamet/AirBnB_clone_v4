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

    $.ajax({
        type: 'GET',
        url: 'http://0.0.0.0:5001/api/v1/status',
        success: function (data) {
            const initialColor = $('#api_status').css("background-color");

            const status = data["status"];
            if (status === "OK") {
                console.log(status === "OK");
                if ( $('#api_status').css("background-color") === initialColor) {
                    $('#api_status').css("background-color", "#ff545f");
                }
            }else {
                $('.available').remove();
            }
        }
    });
});
