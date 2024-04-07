$(document).ready(function() {
    const amenityIds = {}; // Object to store Amenity IDs

    // Listen for changes on each input checkbox tag
    $('.amenities .popover ul li input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id'); // Get the Amenity ID from the data-id attribute
        const amenityName = $(this).data('name');

        // If the checkbox is checked, store the Amenity ID in the const iable
        if ($(this).is(':checked')) {
            amenityIds[amenityId] = amenityName;
        } else { // If the checkbox is unchecked, remove the Amenity ID from the const iable
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
const placesElement = $('.places');
const url = 'http://0.0.0.0:5001/api/v1/places_search';
$.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify({}),
    contentType: 'application/json',
    beforeSend: function () {
            console.log(url)
    },
    success: function(data) {
        console.log(data)
        // Assuming 'data' is an array of place objects
        data.forEach(function(place) {
            // Create a new article element
            const article = $('<article>');

            // Create the title_box div
            const titleBox = $('<div>').addClass('title_box');
            titleBox.append($('<h2>').text(place.name));
            titleBox.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));

            // Create the information div
            const information = $('<div>').addClass('information');
            information.append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')));
            information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')));
            information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')));
            let placeUser;
            const user = $('<div>').addClass('user')
            $.ajax({
                type: 'GET',
                url: "http://0.0.0.0:5001/api/v1/users/"+place.user_id,
                beforeSend: function (){
                    placeUser = "Loading user ..."
                },
                success: function (data) {
                    placeUser= data.first_name +" "+data.last_name;
                    console.log(placeUser);
                    // Create the user div
                user.html('<b>Owner:</b> ' + placeUser);
                }
            });
            // Create the user div

            // Create the description div
            const description = $('<div>').addClass('description').html(place.description);

            // Append all elements to the article
            article.append(titleBox, information, user, description);

            // Append the article to the container (replace 'containerID' with the actual ID of your container)
            placesElement.append(article);
        });
    }
});
});
