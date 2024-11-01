const groceryItems = [
  {
    "item": "apple",
    "food_group": "fruits",
    "price_in_usd": 0.3,
    "quantity": 100,
    "calories_per_100g": 52
  },
  {
    "item": "broccoli",
    "food_group": "vegetables",
    "price_in_usd": 1.1,
    "quantity": 50,
    "calories_per_100g": 34,
    "organic": true
  },
  {
    "item": "salmon",
    "food_group": "proteins",
    "price_in_usd": 8.5,
    "quantity": 20,
    "calories_per_100g": 208,
    "wild_caught": true
  },
  {
    "item": "almonds",
    "food_group": "nuts",
    "price_in_usd": 12.0,
    "quantity": 10,
    "calories_per_100g": 579,
    "organic": false
  },
  {
    "item": "milk",
    "food_group": "dairy",
    "price_in_usd": 2.0,
    "quantity": 60,
    "calories_per_100ml": 42,
    "fat_content": "2%"
  },
  {
    "item": "bread",
    "food_group": "grains",
    "price_in_usd": 1.5,
    "quantity": 40,
    "calories_per_slice": 80,
    "gluten_free": false
  },
  {
    "item": "chicken breast",
    "food_group": "proteins",
    "price_in_usd": 5.0,
    "quantity": 25,
    "calories_per_100g": 165,
    "free_range": true
  },
  {
    "item": "spinach",
    "food_group": "vegetables",
    "price_in_usd": 2.5,
    "quantity": 30,
    "calories_per_100g": 23,
    "organic": true
  },
  {
    "item": "yogurt",
    "food_group": "dairy",
    "price_in_usd": 0.9,
    "quantity": 80,
    "calories_per_100g": 59,
    "fat_content": "0%"
  },
  {
    "item": "banana",
    "food_group": "fruits",
    "price_in_usd": 0.2,
    "quantity": 150,
    "calories_per_100g": 96
  }
]

const sortByPrice = (data) => {
  return [...data].sort((a, b) => {
    a.price_in_usd - b.price_in_usd;
  })
}
const priceSortedItems = sortByPrice(groceryItems);
console.log(priceSortedItems);