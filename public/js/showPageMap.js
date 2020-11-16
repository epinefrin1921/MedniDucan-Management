mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: store.geometry.coordinates, // starting position [lng, lat]
    zoom: 16// starting zoom
});
map.addControl(new mapboxgl.NavigationControl())


const marker = new mapboxgl.Marker()
    .setLngLat(store.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${store.title}</h3>`
            )
    )
    .addTo(map);

