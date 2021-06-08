import MenuService from "../service/menu.service"

export const capitalizeTheFirstLetterOfEachWord = (words) => {
  let separateWord = words.toLowerCase().split(' ')
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1)
  }
  return separateWord.join(' ')
}

export const findCategoryIndex = async (id) => {
  const menuService = new MenuService()
  const products = (await menuService.getProducts()).data.message
  const productsInCategory = products.filter(prod => {
    return prod.categories.some(cat => cat.id === id)
  })
  return productsInCategory.length + 1
}

export const saveChanges = async (categories, products) => {
  const menuService = new MenuService()
  const error = { category: null, product: null }

  if (categories) await Promise
    .all(categories.map((cat) => menuService.updateCategory(cat._id, cat)))
    .catch((err) => error.category = err)

  if (products) await Promise
    .all(products.map((prod) => menuService.updateProduct(prod._id, prod)))
    .catch((err) => error.product = err)

  const alert = (error.categry || error.product) &&
  {
    open: true,
    severity: "error",
    message: "Error de servidor",
    vertical: "bottom",
  }

  return alert
}

export const filterIsMenuProductInMenu = (products, menu) => {
  const InMenuProducts = menu.menuContent.map(cat => {
    return cat.products.map(prod => prod._id)
  }).flat()
  return products?.filter(elm => !InMenuProducts.includes(elm._id))
}
