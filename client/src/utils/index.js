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