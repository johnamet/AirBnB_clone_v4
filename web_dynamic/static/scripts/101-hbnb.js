$(document).ready(function () {
    // Object to store Amenity IDs
    const amenityIds = {};
    // Object to store State IDs
    const stateIds = {};
    // Object to store City IDs
    const cityIds = {};

    // Checkboxes
    const amenityChecks = $('.amenities .popover ul li input[type="checkbox"]');
    const cityChecks = $('.locations .popover ul li ul li input[type="checkbox"]');
    const stateChecks = $('.locations .popover ul li input[type="checkbox"]');

    // Headers for displaying selected amenities and locations
    const amenitiesHeader = $('.amenities h4');
    const locationHeader = $('.locations h4');

    // Function to listen for changes in checkboxes and update corresponding objects and headers
    function listenCheckBoxes(element, object, header, label) {
        element.change(function () {
            const objId = $(this).data('id');
            const objName = $(this).data('name');

            // If the checkbox is checked, store the ID in the object; otherwise, remove it
            if ($(this).is(':checked')) {
                object[objId] = objName;
            } else {
                delete object[objId];
            }

            // Update the header with the list of selected items
            const objList = Object.values(object).join(', ');
            header.text(label + ": " + objList);
        });
    };

    // Listen for changes in checkboxes for amenities, states, and cities
    listenCheckBoxes(amenityChecks, amenityIds, amenitiesHeader, "Amenities");
    listenCheckBoxes(cityChecks, cityIds, locationHeader, "Cities");
    listenCheckBoxes(stateChecks, stateIds, locationHeader, "States");

    // Function to fetch and display places based on selected filters
    function fetchPlaces() {
        const url = 'http://0.0.0.0:5001/api/v1/places_search';
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify({
                "amenities": Object.keys(amenityIds),
                "cities": Object.keys(cityIds),
                "states": Object.keys(stateIds)
            }),
            contentType: 'application/json',
            success: function (data) {
                // Empty the places container before appending new places
                $('.places').empty();
                // Iterate through the retrieved places and create HTML elements to display them
                data.forEach(function (place) {
                    const article = createPlaceElement(place);
                    $('.places').append(article);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching places:', error);
                // Handle error here
            }
        });
    };

    // Function to create HTML elements for displaying a single place
    function createPlaceElement(place) {
        const article = $('<article>');
        const titleBox = $('<div>').addClass('title_box');
        titleBox.append($('<h2>').text(place.name));
        titleBox.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));
        const information = $('<div>').addClass('information');
        information.append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')));
        information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')));
        information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')));
        const user = $('<div>').addClass('user');
        $.ajax({
            type: 'GET',
            url: "http://0.0.0.0:5001/api/v1/users/" + place.user_id,
            beforeSend: function () {
                user.text("Loading user ...");
            },
            success: function (userData) {
                const userName = userData.first_name + " " + userData.last_name;
                user.html('<b>Owner:</b> ' + userName);
            }
        });
        const description = $('<div>').addClass('description').html(place.description);
        const amenities = $('<div>').addClass('box_amenities');
        amenities.append($('<h3>').text("Amenities"));
        const amenitiesList = $('<ul>');
        $.ajax({
            type: 'GET',
            url: 'http://0.0.0.0:5001/api/v1/places/' + place.id + '/amenities',
            success: function (data) {
                data.forEach(function (amenity) {
                    amenitiesList.append($('<li>').text(amenity.name));
                });
            }
        });
        amenities.append(amenitiesList);
        const reviews = $('<div>').addClass('reviews');
        const reviewsList = $('<ul>');
        $.ajax({
            type: 'GET',
            url: "http://0.0.0.0:5001/api/v1/places/" + place.id + "/reviews",
            success: function (data) {
                reviews.append($('<h2>').text(data.length + ' Reviews'));
                data.forEach(function (review) {
                    $.ajax({
                        type: 'GET',
                        url: "http://0.0.0.0:5001/api/v1/users/" + place.user_id,
                        beforeSend: function () {
                            user.text("Loading user ...");
                        },
                        success: function (userData) {
                            const userName = userData.first_name + " " + userData.last_name;
                            reviewsList.append($('<li>')).append($('<h3>').text('From ' + userName + ' the ' + review.updated_at));
                        }
                    });
                    reviewsList.append($('<li>')).append($('<p>').text(review.comment));
                });
            }
        });
        reviews.append(reviewsList);
        article.append(titleBox, information, user, description, amenities, reviews);
        return article;
    };

    // Fetch places when the page loads
    fetchPlaces();

    // Listen for clicks on the search button to fetch places based on selected filters
    $('#search_button').click(function () {
        if (Object.keys(amenityIds).length !== 0 ||
            Object.keys(cityIds).length !== 0 ||
            Object.keys(stateIds).length !== 0) {
            fetchPlaces();
        }
    });
});