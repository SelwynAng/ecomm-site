import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ['myMap', 'lat', 'lng', 'locationName']

  connect() {
    const lat = 1.4247527338672488
    const lng = 103.8332382527072
    this.initMap(lat, lng)
  }


  async initMap(lat, lng) {
    const position = {lat: lat, lng: lng};
    const mapId = this.myMapTarget.id

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const map = new Map(document.getElementById(mapId), {
      center: position,
      zoom: 16,
      mapId: "myMap"
    });

    const marker = new AdvancedMarkerElement({
      map,
      position: position,
      title: 'VeGGies',
    });
  }
}