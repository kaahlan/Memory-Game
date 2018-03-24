//Global varibales, including List of cards to populate the game deck.
const cards = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor", "anchor",
  "bolt", "bolt", "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"
];
let openCards = [];
let moves = 0;
let matches = 0;
let timer = 0;
let starRating = "3";
let timerIncrement;

//Creates the game deck using shuffle function and cards array.
function createDeck() {
  let deck = shuffle(cards);
  deck.forEach(function(card) {
    $('.deck').append('<li class="card"><i class="fa fa-' + card + '"></i></li>');
  });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//On click function for cards, flips if not open and then calls match function.
function showCard() {
  $(".card").on("click", function() {
    if ($(this).hasClass("open show")) {
      return;
    }
    $(this).toggleClass("flipInY open show");
    openCards.push($(this));
    checkMatch();
  });
}

/*
Matching function, checks once 2 cards are opened. Prevents further clicks on unopened
cards. Matches stay open, non-matches turn back over, calls win function once all matched.
*/
function checkMatch() {
  if (openCards.length === 2) {
    moves++;
    $(".card").off("click");
    if (openCards[0].children().attr("class") === openCards[1].children().attr("class")) {
      openCards.forEach(function(card) {
        card.addClass("match");
      });
      setTimeout(function() {
        matches++;
        if (matches === 8) {
          return win();
        }
        openCards = [];
        return showCard();
      }, 1000);
    } else {
      setTimeout(function() {
        openCards.forEach(function(card) {
          card.toggleClass("open show");
        });
        openCards = [];
        return showCard();
      }, 1000);
    }
  }
  updateMoves();
}

//Updates Moves HTML and text.
function updateMoves() {
  $(".moves").text(moves.toString());
  if (moves === 1) {
    $(".movesText").text(" Move");
  } else {
    $(".movesText").text(" Moves");
  }
  updateStars();
}

//Establishes Star Rating levels and modifies HTML.
//TODO: Change star ratings back to correct values, lower for testing.
function updateStars() {
  if (moves >= 0 && moves < 2) {
    starRating = "3";
  } if (moves >= 2 && moves < 4) {
    $("#star3").remove();
    starRating = "2";
  } if (moves >= 4 && moves < 6) {
    $("#star2").remove();
    starRating = "1";
  } if (moves >= 6) {
    $("#star1").remove();
    starRating = "0";
  }
}

//Starts timer function, incrememnts seconds by 1 every 1000 milliseconds and updates HTML.
function timerStart() {
  timer++;
  $("#timer").html(timer);
  timerIncrement = setTimeout(timerStart, 1000);
  if (timer === 1) {
    $("#timerText").text(" Second");
  } else {
    $("#timerText").text(" Seconds");
  }
}

//TODO: Reset function, finish win modal.

/*
Basic win functionality.
TODO: Add time, star score, moves, replay button.
*/
function win() {
  let modal = document.getElementById('myModal');

  modal.style.display = "block";
}

//Primary game function.
function gameStart() {
  createDeck();
  showCard();
  let firstClick = 0;
  $(".card").on("click", function() {
    firstClick += 1;
    if (firstClick === 1) {
      timerStart();
    }
  });
}

gameStart();
