import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  static targets = ["itemCount"]

  connect() {
    console.log("connected!")
    this.renderCartItems()
    this.updateTotal()
  }

  renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    if (!cart) {
      return
    }

    const cartItemsContainer = document.getElementById("cartItemsContainer")

    cart.forEach(item => {
      const div = document.createElement("div")
      div.classList.add("mt-2")
      div.setAttribute("data-id", item.id)
      div.setAttribute("data-size", item.size)
      div.innerText = `Item: ${item.name} - $${item.price / 100.0} - Size: ${item.size} - Quantity: ${item.quantity}`
      
      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Remove"
      deleteButton.value = JSON.stringify({ id: item.id, size: item.size })
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")
      deleteButton.addEventListener("click", (event) => this.removeFromCart(event))

      div.appendChild(deleteButton)
      cartItemsContainer.appendChild(div)
    })
  }

  clear() {
    localStorage.removeItem("cart")
    window.location.reload()
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const values = JSON.parse(event.target.value)
    const { id, size } = values
    const index = cart.findIndex(item => item.id === id && item.size === size)
    if (index >= 0) {
      cart.splice(index, 1)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    event.target.parentElement.remove()
    this.updateTotal()
  }

  updateTotal() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    let total = 0
    if (cart) {
      cart.forEach(item => {
        total += item.price * item.quantity
      })
    }
    const totalContainer = document.getElementById("total")
    totalContainer.innerText = `Total: $${total / 100.0}`
  }

  checkout() {
    // Handle checkout logic here
    console.log("Checkout clicked!")
  }
}
