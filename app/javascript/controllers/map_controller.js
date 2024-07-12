import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ['myMap', 'lat', 'lng', 'locationName']

  connect() {
    let lat = 1.4247527338672488
    let lng = 103.8332382527072
    this.initMap(lat, lng)
  }


  async initMap(lat, lng) {
    // The location of Uluru
    const position = {lat: lat, lng: lng};
    let mapId = this.myMapTarget.id

    const {Map} = await google.maps.importLibrary("maps");

    let map = new Map(document.getElementById(mapId), {
      center: position,
      zoom: 16
    });


    this.addSingleMarker(position, map)
  }

  addSingleMarker(position, map) {
    const marker = new google.maps.Marker({
      position,
      map,
    });
  }

  updateCordinate() {
    if (event.currentTarget.dataset.googleMapTarget = 'lat') {
      this.initMap(parseFloat(event.currentTarget.value), parseFloat(this.lngTarget.value))
    } else {
      this.initMap(parseFloat(this.latTarget.value), parseFloat(event.currentTarget.value))
    }
  }
}