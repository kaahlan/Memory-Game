//Global varibales, including List of cards to populate the game deck.
const cards = ['key', 'key', 'trophy', 'trophy', 'flask', 'flask', 'bolt', 'bolt',
  'puzzle-piece', 'puzzle-piece', 'leaf', 'leaf', 'tint', 'tint', 'bomb', 'bomb'
];
let openCards = [];
let moves = 0;
let matches = 0;
let timer = 0;
let timerIncrement;
let starRating = '3';

//Creates the game deck using shuffle function and cards array.
function createDeck() {
  let deck = shuffle(cards);
  deck.forEach(function(card) {
    $('.deck').append('<li class="card"><i class="fa fa-' + card + '"></i></li>');
  });
}

// Shuffle function from http://stackoverflow.com/a/2450976.
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
  $('.card').on('click', function() {
    if ($(this).hasClass('open show')) {
      return;
    }
    $(this).toggleClass('flipInY open show');
    openCards.push($(this));
    checkMatch();
  });
}

/*
Matching function, checks once 2 cards are opened. Increments moves. Prevents further clicks
on unopened cards. Matches stay open, non-matches turn back over, calls win function once all matched. Delays added for clicks, animations, win modal.
*/
function checkMatch() {
  if (openCards.length === 2) {
    moves++;
    $('.card').off('click');
    if (openCards[0].children().attr('class') === openCards[1].children().attr('class')) {
      openCards.forEach(function(card) {
        card.addClass('match');
      });
      setTimeout(function() {
        matches++;
        if (matches === 8) {
          setTimeout(function() {
            return win();
          }, 800);
        }
        openCards = [];
        return showCard();
      }, 500);
    } else {
      openCards.forEach(function(card) {
        card.addClass('nomatch');
        setTimeout(function() {
          openCards.forEach(function(card) {
            card.removeClass('nomatch');
            card.toggleClass('open show');
          });
          openCards = [];
          return showCard();
        }, 500);
      });
    }
  }
  updateMoves();
}

//Updates Moves HTML and text. Calls updateStars function.
function updateMoves() {
  $('.moves').text(moves.toString());
  if (moves === 1) {
    $('.movesText').text(' Move');
  } else {
    $('.movesText').text(' Moves');
  }
  updateStars();
}

//Establishes Star Rating level parameters and updates HTML.
function updateStars() {
  if (moves >= 0 && moves < 18) {
    starRating = '3';
  }
  if (moves >= 18 && moves < 26) {
    $('#star3').remove();
    starRating = '2';
  }
  if (moves >= 26 && moves < 34) {
    $('#star2').remove();
    starRating = '1';
  }
  if (moves >= 34) {
    $('#star1').remove();
    starRating = '0';
  }
}

//Starts timer function, incrememnts seconds by 1 every 1000 milliseconds and updates HTML.
function timerStart() {
  timer++;
  $('.timer').html(timer);
  timerIncrement = setTimeout(timerStart, 1000);
  if (timer === 1) {
    $('.timerText').text(' Second');
  } else {
    $('.timerText').text(' Seconds');
  }
}

/*
Reset function, empties deck and stars HTML. Stops timer.
Resets openCards, moves, matches, timer, starRating, star icons,
and updates HTML where needed. Returns gameStart.
Used for reset button and in modal.
*/
function resetGame() {
  $('ul.deck').html('');
  $('.stars').html('');
  clearTimeout(timerIncrement);
  openCards = [];
  moves = 0;
  $('.moves').text(moves.toString());
  matches = 0;
  timer = 0;
  $('.timer').html(timer);
  starRating = '3';
  $('.starRating').html(starRating);
  let stars = ['1', '2', '3'];
  stars.forEach(function(star) {
    $('.stars').append('<li id="star' + star + '"><i class="fa fa-star"></i></li>\n');
  });
  gameStart();
}

/*
Win function. Stops timer, updates Star Rating HTML, pops up Modal annoucnement with
Time, moves made, amd star rating. Replay buttons, yes resets game, no updates modal message.
*/
function win() {
  clearTimeout(timerIncrement);
  $('.starRating').html(starRating);
  let modal = document.getElementById('myModal');
  modal.style.display = 'block';
  $("#yes").on("click", function() {
    modal.style.display = "none";
    resetGame();
  });
  $("#no").on("click", function() {
    $('.modal-content').html("<h1>Thanks for playing!</h1>");
  });
}

//Primary game function. Starts timer on first card clicked.
function gameStart() {
  createDeck();
  showCard();
  let firstClick = 0;
  $('.card').on('click', function() {
    firstClick += 1;
    if (firstClick === 1) {
      timerStart();
    }
  });
}

gameStart();
