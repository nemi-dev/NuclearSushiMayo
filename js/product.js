/** @type {Product[]} */
let products;

let maxPrice = null
let minPrice = null
let hotOnly = false
let typesToView = new Set()

function dollar(v) {
  return Number(v).toLocaleString('en-us', { style: 'currency', currency: 'USD' })
}

const minPriceView = document.querySelector("#MinPriceView")
const selectMinPrice = document.querySelector("#SelectMinPrice")
selectMinPrice.addEventListener('input', function (e) {
  minPriceView.innerText = dollar(e.target.value)
})
selectMinPrice.addEventListener('change', function (e) {
  if (minPrice != null) {
    minPrice = e.target.value
    renderList()
  }
})
document.querySelector("#UseMinPrice").addEventListener('change', function (e) {
  const use = e.target.checked
  selectMinPrice.disabled = !use
  minPrice = use ? selectMinPrice.value : null
  renderList()
})

const maxPriceView = document.querySelector("#MaxPriceView")
const selectMaxPrice = document.querySelector("#SelectMaxPrice")
selectMaxPrice.addEventListener('input', function (e) {
  maxPriceView.innerText = dollar(e.target.value)
})
selectMaxPrice.addEventListener('change', function (e) {
  if (maxPrice != null) {
    maxPrice = e.target.value
    renderList()
  }
})
document.querySelector("#UseMaxPrice").addEventListener('change', function (e) {
  const use = e.target.checked
  selectMaxPrice.disabled = !use
  maxPrice = use ? selectMaxPrice.value : null
  renderList()
})

document.querySelector("#SelectHotOnly").addEventListener('change', function (e) {
  hotOnly = e.target.checked
  renderList()
})

function useType(e) {
  const use = e.target.checked
  const value = e.target.value
  console.log({ use, value })
  use? typesToView.add(value) : typesToView.delete(value)
  renderList()
}

document.querySelectorAll(".TypeSelector").forEach(function (el) {
  el.addEventListener('change', useType)
})


const productList = document.querySelector("#ProductList")

/**
 * @param {Product[]} pl 
 */
function renderList(pl) {
  pl = pl || products || []
  if (hotOnly) {
    pl = pl.filter(function (p) {
      return p.hot
    }) 
  }
  if (typesToView.size > 0) {
    pl = pl.filter(function (p) {
      return typesToView.has(p.type)
    })
  }
  if (minPrice != null) pl = pl.filter(function (p) {
    return p.price >= minPrice
  })
  if (maxPrice != null) pl = pl.filter(function (p) {
    return p.price <= maxPrice
  })
  
  productList.innerHTML = pl.map(function ({ name, img, price, description }) {
    price = dollar(price)
    return `<div class="ProductItem Card"><div class="ImageContainer"><img src="${img}"></div><h3>${name}</h3><h4>${price}</h4><p>${description}</p></div>`
  }).join('')
}

!((async() => {
  products = await (await fetch("/products.json")).json()
  renderList()
})())