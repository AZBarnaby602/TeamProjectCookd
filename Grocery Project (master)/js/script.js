


let dataValueArray = []
let cards = $('.ingredients-card')
let button = document.getElementById('button')
let listOfRecipes = []

$.getJSON('./json/recipes.json', (recipesJSON) => {
  listOfRecipes = recipesJSON
})

//REIDS CODING---------------------------------------------------
//set localStorage
function storage() {

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i)

    for (let card of cards) {
      let cardValue = card.getAttribute('data-value')
      if (cardValue === key) {
        card.classList.add('button-active')
        dataValueArray.push(key)
      }
    }
  }//end for loop
  clearCard()
  checkRecipes()

  if (localStorage.recipe !== "") {
    $.getJSON('./json/recipes.json', (recipesJSON) => {
      listOfRecipes = recipesJSON
      callRecipe(localStorage.recipe)
    })
  }
}//end storage function

//-------------------------------------
//hides body of main bar thats clicked
//-------------------------------------
$('button.accordion').click((event) => {
  let targetId = event.target.id

  let target = targetId.replace("bar", 'body')

  var targetBody = document.getElementById(target);

  (!targetBody.classList.contains("w3-show")) ?
    targetBody.classList.add('w3-show') :
    targetBody.classList.remove('w3-show')

  if (target === 'welcome-body') {
    $('#ingredients-body').removeClass('w3-show')
    $('#meals-body').removeClass('w3-show')
    $('#recipes-body').removeClass('w3-show')
  } else if (target === 'ingredients-body') {
    $('#welcome-body').removeClass('w3-show')
  } else if (target === 'meals-body') {
    $('#welcome-body').removeClass('w3-show')
  } else if (target === 'recipes-body') {
    $('#welcome-body').removeClass('w3-show')
    $('#ingredients-body').removeClass('w3-show')
    $('#meals-body').removeClass('w3-show')
  }


})

// ==== Barnaby code below ======================================== 
// onClick of ingredients, changes background-color & text color,
//          adds "active" class;
//          pushes "data-value" into an array;
//          removes "hidden class from checkmark";
// IF already active, changes colors back to "unselected" css 
//           removes active class;
//           removes "data-value" from array;
//          "hides" checkmark.

cards.click(e => {
  let card = e.target

  let dataValue = card.getAttribute('data-value')

  if (card.classList.contains('button-active')) {
    localStorage.removeItem(dataValue)
    card.classList.remove('button-active')
    dataValueArray = dataValueArray.filter(item => item !== dataValue)
    clearCard()

  } else {
    localStorage.setItem(dataValue, 'yes')
    card.classList.add('button-active')
    dataValueArray.push(dataValue)
    clearCard()
  }// end else if

  //REIDS CODING---------------------------------------------------
  checkRecipes()

}) // end of cards.click function

// ==============================================================

//REIDS CODING---------------------------------------------------
function clearCard() {
  $('#partial-match').empty()
  $('#full-match').empty()
}

function checkRecipes() {

  $.getJSON('./json/recipes.json', (recipesJSON) => {
    listOfRecipes = recipesJSON
    let totalMatches = 0
    let primaryIngredients = 0

    for (let meal of listOfRecipes) {

      for (let ingredient of dataValueArray) {

        let regex = new RegExp(ingredient, 'i')

        for (let i = 0; i < meal.ingredients.length; i++) {

          if (regex.test(meal.ingredients[i])) {
            totalMatches++
            if (i <= (meal.ingredients.length) / 4) {
              primaryIngredients++
            }//end if i<(meal.ingredients.length) / 4)
          }//end regex if
        }//end meal.ingredients loop
      }//end dataValueArray loop



      if (totalMatches >= meal.ingredients.length) {
        createCard(meal, 'full-match')
      } else if (totalMatches < meal.ingredients.length && primaryIngredients >= (meal.ingredients.length) / 4) {
        createCard(meal, 'partial-match')
      }//end if to push meals

      //reset values for future checks
      totalMatches = 0
      primaryIngredients = 0

    }//end meal loop
  })//end  $getJSON call
}//end checkRecipes function

//-------------------------------------------------------
//function to create cards based onn selected ingredients
//-------------------------------------------------------
function createCard({ name, img, cook_time }, target) {

  let targetDiv = document.getElementById(target)

  //create recipe card
  let card = document.createElement('div')
  card.classList.add("w3-card-4")
  card.classList.add("recipe-card")
  card.setAttribute('data-name', name)
  //create recipe card title
  let cardTitle = document.createElement('div')
  cardTitle.classList.add("recipe-card-title")
  cardTitle.setAttribute('data-name', name)

  let cardName = name
  if (cardName.length > 16) {
    cardName = cardName.slice(0, 14) + "..."
  }
  cardTitle.textContent = cardName
  //create recipe card img
  let cardImg = new Image()
  cardImg.classList.add('recipe-card-img')
  cardImg.setAttribute('data-name', name)
  cardImg.src = img
  //create recipe card footer
  let cardFooter = document.createElement('div')
  cardFooter.classList.add("recipe-card-footer")
  cardFooter.setAttribute('data-name', name)
  cardFooter.textContent = cook_time
  //append child elements to main card div
  card.appendChild(cardTitle)
  card.appendChild(cardImg)
  card.appendChild(cardFooter)

  card.addEventListener('click', (event) => {

    let recipeCardName = event.target.getAttribute('data-name')


    $('#ingredients-body').removeClass('w3-show')
    $('#meals-body').removeClass('w3-show')
    $('#recipes-body').addClass('w3-show')

    localStorage.recipe = recipeCardName

    callRecipe(recipeCardName)
  })//end eventListener for cards

  //append card to target 
  targetDiv.appendChild(card)
}//end createCard()


//-------------------------------------------------------
//function to create recipe card thats displayed in recipe body
//-------------------------------------------------------
function callRecipe(recipeName) {

  $('#recipes-body').empty()


  let fullRecipe = {}

  for (let meal of listOfRecipes) {
    if (recipeName === meal.name) {
      fullRecipe = meal
    }
  }

  let { name: recipe_name, description: recipe_description, img: recipe_img, ingredients: recipe_ingredients,
    recipe: recipe_recipe, cook_time: recipe_cookTime, serves: recipe_serves } = fullRecipe

  let recipes_body = document.getElementById('recipes-body')

  //create large card
  let recipes_body_card = document.createElement('fieldset')
  recipes_body_card.classList.add('recipes-body-card')

  //create legend
  let recipes_body_legend = document.createElement('legend')
  recipes_body_legend.classList.add('recipes-body-legend')
  recipes_body_legend.innerText = recipe_name
  recipes_body_card.appendChild(recipes_body_legend)

  //create header block div
  let recipes_body_header = document.createElement('div')
  recipes_body_header.classList.add('recipes-body-header')

  //create img
  let recipes_body_img = new Image()
  recipes_body_img.classList.add('recipes-body-img')
  recipes_body_img.src = recipe_img

  //create header text block
  let recipes_body_header_text = document.createElement('div')
  recipes_body_header.classList.add('recipes-body-header-text')

  //create name
  let recipes_body_name = document.createElement('legend')
  recipes_body_name.classList.add('recipes-body-name')
  recipes_body_name.textContent = recipe_name

  //create description
  let recipes_body_description = document.createElement('p')
  recipes_body_description.classList.add('recipes-body-description')
  recipes_body_description.textContent = recipe_description

  //create serves
  let recipes_body_serves = document.createElement('p')
  recipes_body_serves.classList.add('recipes-body-serves')
  recipes_body_serves.innerHTML = '<span class="text">Serves: </span>' + recipe_serves
  
  //create cook time
  let recipes_body_cookTime = document.createElement('p')
  recipes_body_cookTime.classList.add('recipes-body-cookTime')
  recipes_body_cookTime.innerHTML = '<span class="text">Cook time: </span>' + recipe_cookTime
  recipes_body_header_text.appendChild(recipes_body_img)

  //create ingredients div
  let recipes_body_ingredients = document.createElement('fieldset')
  recipes_body_ingredients.classList.add('recipes-body-ingredients')
  let recipes_body_ingredients_legend = document.createElement('legend')
  let recipes_body_ingredients_ulDiv = document.createElement('div')
  recipes_body_ingredients_ulDiv.classList.add('recipes-body-ingredients-ulDiv')
  let recipes_body_ingredients_ul = document.createElement('ul')
  recipes_body_ingredients_ul.classList.add('recipes-body-ingredients-ul')
  recipes_body_ingredients_legend.classList.add('recipes-body-ingredients-legend')
  recipes_body_ingredients_legend.innerText = "Ingredients"
  recipes_body_ingredients.appendChild(recipes_body_ingredients_legend)

  for (let ingredient of recipe_ingredients) {

    let listItem = document.createElement('li')
    listItem.innerText = ingredient

    for (let i = 0; i < dataValueArray.length; i++) {
      let regex1 = new RegExp(dataValueArray[i], 'i')

      if (regex1.test(ingredient)) {
        listItem.classList.remove('missingItem')
        break
      } else {
        listItem.classList.add('missingItem')
      }//end if
    }//end 2nd for loop
    recipes_body_ingredients_ul.appendChild(listItem)
    // recipes_body_ingredients.appendChild(listItem)
  }//end 1st for loop; to color missing ingredients

  recipes_body_ingredients_ulDiv.appendChild(recipes_body_ingredients_ul)
  recipes_body_ingredients_ul.classList.add('recipes-body-ingredients-ul')
  recipes_body_ingredients.appendChild(recipes_body_ingredients_ulDiv)

  recipes_body_card.appendChild(recipes_body_description)
  recipes_body_header_text.appendChild(recipes_body_serves)
  recipes_body_header_text.appendChild(recipes_body_cookTime)
  recipes_body_header_text.appendChild(recipes_body_ingredients)
  recipes_body_header.appendChild(recipes_body_header_text)
  //end of header block *****

  recipes_body_card.appendChild(recipes_body_header)

  //create instruction list
  let recipes_body_instructions = document.createElement('div')
  let recipes_body_instructions_ol = document.createElement('ol')
  recipes_body_instructions_ol.classList.add('recipes-body-instructions')

  for (let instruction of recipe_recipe) {
    let step = document.createElement('li')
    step.innerText = instruction
    recipes_body_instructions_ol.appendChild(step)
  }
  recipes_body_instructions.append(recipes_body_instructions_ol)


  recipes_body_card.appendChild(recipes_body_instructions)

  //add tasty ad
  let tastyLink = document.createElement('a')
  tastyLink.href = "www.tasty.com"
  tastyLink.target = "_blank"

  let tastyImg = new Image()
  tastyImg.classList.add('tastyImg')
  tastyImg.src = "./images/Ads/Final Ads/recipeTasty/tasty-1.jpeg"
  tastyLink.appendChild(tastyImg)

  //timeout & interval for tasty images
  let i = 2
  setInterval(() => {
    tastyImg.src = "./images/Ads/Final Ads/recipeTasty/tasty-" + i + ".jpeg"
    if (i === 3) {
      i = 0
    }
    i++
  }, 2500)

  recipes_body.appendChild(tastyLink)
  recipes_body.appendChild(recipes_body_card) //append full recipe card to html page
}

//----------------------------------------------------------------------
//filter card section----------------------------------------------------
//----------------------------------------------------------------------
let filter = document.getElementById('filter')

filter.addEventListener('change', (event) => {
  let cards = $('.recipe-card')
  //if select element is set to All recipes
  if (event.target.value == "") {
    //map through displayed cards and display cards
    cards.map((card) => {
      cards[card].style.display = 'inline-block'
    })//end cards.map
  }//end if value in select is empty

  //if select element is set to a filter time
  if (event.target.value !== "") {

    let filter = parseInt(event.target.value) //could use +event.target.value to convert

    //map through cards displayed
    cards.map((card) => {
      //regex to grab the time at beginning of recipe
      let regex = /^[0-9]+/
      let text = cards[card].lastChild.textContent
      let time = parseInt(text.match(regex)[0])

      //if the time of recipe is less then or equal to the filter value
      if (time <= filter) {
        //display the card
        cards[card].style.display = 'inline-block'
      } else {
        //else hide the car
        cards[card].style.display = 'none'
      }//end if else
    })//end cards.map
  }//end if value is NOT empty
})//end filter.addEventListener

//-------------------------------------------------------
//select all ingredients button
//-------------------------------------------------------

$('#allRecipes').click(() => {
  $('.ingredients-card').addClass('button-active')
  $('.button-active span').removeClass('hidden')

  dataValueArray = ['steak', 'ground beef', 'chicken breast', 'pork chop', 'italian sausage', 'bacon', 'onion', 'broccoli', 'potato', 'fresh tomato',
    'peas', 'mushroom', 'carrot', 'red bell pepper', 'lettuce', 'milk', 'heavy cream', 'fresh egg', 'cream cheese', 'sour cream', 'cheddar cheese', 'egg noodles', 'bread', 'rice', 'spaghetti pasta',
    'fettuccini', 'elbow macaroni', 'beef broth', 'crushed tomatoes', 'chicken broth', 'tomato paste', 'tomato sauce', 'chicken stock', 'garlic', 'pepper',
    'basil leaves', 'sesame oil', 'olive oil', 'mayonnaise', 'flour', 'oregano', 'vinegar', 'butter', 'worcestershire sauce', 'ginger',
    'parsley', 'vegetable oil', 'thyme', 'paprika', 'baking powder', 'vanilla extract', 'salt', 'sugar', 'sesame seed', 'parmesan cheese', 'ketchup', 'soy sauce', 'brown sugar', 'chili powder', 'cocoa powder']

  checkRecipes()
})

//-------------------------------------------------------
//toggle Bars
//-------------------------------------------------------

//display meats in ingredients
$('#ingredients-meats-bar').click(() => {
  let meatBar = document.getElementById('ingredients-meats-body')
  if (meatBar.classList.contains('w3-hide')) {
    meatBar.classList.remove('w3-hide')
  } else {
    meatBar.classList.add('w3-hide')
  }
})

//toggle main bars
// let welcomeBar = $('#welcome-bar')
// let ingredientsBar = $('#ingredients-bar')
// let mealsBar = $('#meals-bar')
// let recipes = $('#recipes-bar')


//display modal for hover over legend of partial match
let partialMatchLegend = document.getElementById('partial-match-legend')
let partialMatchTitle = document.getElementById('partial-match-title')

partialMatchLegend.addEventListener('mouseover', () => {
  partialMatchTitle.style.display = "block"
})
partialMatchLegend.addEventListener('mouseout', () => {
  partialMatchTitle.style.display = "none"
})

//btn in ingredients body to clear all selected ingredients
$('#clearAll').click((event) => {
  $("#clearAllTitle").toggle()
})

//if moused off the confirm modal, the modal will fade out
$('#clearAllTitle').on({
  mouseleave: function () {
    $(this).fadeOut(700);
  },
  mouseenter: function () {
    $(this).stop().fadeIn(100)
  }
})

//btn to confirm clearing of all ingredients
$('#clearAllConfirm').click(() => {
  dataValueArray = []
  let recipe = localStorage.recipe
  localStorage.clear()
  $('.button-active span').addClass('hidden')
  $('.button-active').removeClass('button-active')
  clearCard()

  $('#clearAllTitle').hide()

  localStorage.recipe = recipe
})


//slider function
//needs to be cleaned up ******

// let sliders = $('.slider')
// let grabbed = false
// let startX;
// let scrollLeft;

// sliders.on({
//   mousedown: function (e) {
//     e.preventDefault()
//     grabbed = true

//     this.classList.add('grabbed')
//     startX = e.pageX - this.offsetLeft;
//     scrollLeft = this.scrollLeft

//   },
//   mouseleave: function () {
//     grabbed = false
//     this.classList.remove('grabbed')

//   },
//   mouseup: function (e) {
//     e.preventDefault()
//     grabbed = false
//     this.classList.remove('grabbed')

//   },
//   mousemove: function (e) {
//     if (!grabbed) return; //stop from running
//     e.preventDefault()
//     const x = e.pageX - this.offsetLeft;
//     const walk = x - startX
//     this.scrollLeft = scrollLeft - walk
//   }
// })