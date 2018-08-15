$(document).ready(function() {
  $('.splash').delay('3000').slideUp('slow');
  $('.home').delay('3000').fadeIn('slow');

  $(".sign-up-button").click(signUpClick);
  $(".sign-in-button").click(signInClick);
});

function signUpClick(event) {
  event.preventDefault();

  var name = $(".sign-up-name").val();
  var email = $(".sign-up-email").val();
  var password = $(".sign-up-password").val();

  createUser(name, email, password);
}

function createUser(name, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(response) {
    var userId = response.user.uid;
    redirectToFeed(userId);
  })
  .catch(function(error) {
    handleError(error);
  });
}

function signInClick(event) {
  event.preventDefault();

  var email = $(".sign-in-email").val();
  var password = $(".sign-in-password").val();

  signInUser(email, password);
}

function signInUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(response) {
    var userId = response.user.uid;
    redirectToFeed(userId);
  })
  .catch(function(error) {
    handleError(error)
  });
}

function handleError(error) {
  var errorMessage = error.message;
  alert(errorMessage);
}

function redirectToFeed(userId) {
  window.location = "feed.html?id=" + userId;
}
