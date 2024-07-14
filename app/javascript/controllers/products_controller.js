import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="products"
export default class extends Controller {
  static values = { 
    size: String,
    product: Object 
  }
  
  addToCart() {
    console.log(this.productValue);
    const cart = localStorage.getItem("cart")
    
    if (cart) {
      const cartArray = JSON.parse(cart);
      const index = cartArray.findIndex(item => 
        item.id === this.productValue.id && item.size === this.sizeValue);
        
      console.log(index);
        if (index >= 0) {
          cartArray[index].quantity = parseInt(cartArray[index].quantity) + 1;
        } else {
        cartArray.push({
          id: this.productValue.id,
          name: this.productValue.name,
          price: this.productValue.price,
          size: this.sizeValue,
          quantity: 1
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(cartArray));
    } else {
      const cartArray = [];
      
      cartArray.push({
        id: this.productValue.id,
        name: this.productValue.name,
        price: this.productValue.price,
        size: this.sizeValue,
        quantity: 1
      });

      localStorage.setItem("cart", JSON.stringify(cartArray));
    }
  }

  selectSize(e) {
    this.sizeValue = e.target.value;
    const selectedSizeEl = document.getElementById("selected-size");
    selectedSizeEl.innerText = `Selected Size: ${this.sizeValue}`
  }
}
