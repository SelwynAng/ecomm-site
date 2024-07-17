import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  static targets = ["itemCount"]

  connect() {
    console.log("connected!")
    this.updateItemCount()
  }

  updateItemCount() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const itemCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0
    this.itemCountTarget.innerText = itemCount
  }
}
