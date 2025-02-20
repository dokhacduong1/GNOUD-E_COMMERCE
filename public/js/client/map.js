async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
        center: { lat: 37.39094933041195, lng: -122.02503913145092 },
        zoom: 14,
        mapId: "4504f8b37365c3d0",
    });
    // console.log(document.getElementById("map"));
    // const infoWindow = new InfoWindow();
    // const draggableMarker = new AdvancedMarkerElement({
    //     map,
    //     position: { lat: 37.39094933041195, lng: -122.02503913145092 },
    //     gmpDraggable: true,
    //     title: "This marker is draggable.",
    // });
    //
    // draggableMarker.addListener("dragend", (event) => {
    //     const position = draggableMarker.position;
    //
    //     infoWindow.close();
    //     infoWindow.setContent(`Pin dropped at: ${position.lat}, ${position.lng}`);
    //     infoWindow.open(draggableMarker.map, draggableMarker);
    // });
}

initMap();