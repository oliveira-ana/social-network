var database = firebase.database();

$(document).ready(function() {
  $('.splash').delay('3000').slideUp('slow');
  $('.home').delay('3000').fadeIn('slow');

  $(".sign-up-button").click(function(event) {
    event.preventDefault();

    var email = $(".sign-up-email").val();
    var name = $(".sign-up-name").val();
    var password = $(".sign-up-password").val();

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(response) {
      var userId = response.user.uid;

      database.ref("users/" + userId).set({
        name: name,
        email: email
      });

      window.location = "posts.html?userId=" + userId

    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode, errorMessage);
    });
  })
});
