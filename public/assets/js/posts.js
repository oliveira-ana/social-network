var database = firebase.database();
var USER_ID = window.location.search.match(/\?userId=(.*)/)[1];

$(document).ready(function () {

  database.ref("users/" + USER_ID).once("value")
    .then(function (snapshot) {
      var userInfo = snapshot.val();
      $(".user-name").text(userInfo.name)
    })

  database.ref("users").once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        createUsers(childData.name, childKey);
      });
    })

  database.ref('posts/' + USER_ID).once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      createPost(childData.text, childKey);
    });
  });

  $(".send-button").click(function (event) {
    event.preventDefault();

    var text = $(".post-input").val();
    $(".post-input").val("");

    var newPostInDB = database.ref('posts/' + USER_ID).push({
      text: text
    });

    createPost(text, newPostInDB.key);

  })

  function createPostFriend(text, key) {
    $(".posts-list-friends").append(`
      <span class="text-content" data-text-id="${key}" >${text}></span>
      `);
  }

  function createPost(text, key) {
    $(".posts-list").append(`
      <div>
        <button class="edit" data-edit-id="${key}" >Editar</button>
        <button class="delete" data-delete-id="${key}" >Excluir</button>
      </div>
      <span class="text-content" data-text-id="${key}" >${text}</span>
      `);

    $(`button[data-delete-id=${key}]`).click(function () {
      $(this).parent().remove();
      database.ref('posts/' + USER_ID + "/" + key).remove();
    });

    $(`button[data-edit-id=${key}]`).click(function () {
      var newText = prompt(`Altere o seu texto: ${text}`);
      $(`span[data-text-id=${key}]`).text(newText);
      database.ref(`posts/${USER_ID}/${key}`).update({
        text: newText
      })

    });

  }

  function createUsers(name, key) {
    // console.log(name, key);
    if (key !== USER_ID) {
      $(".users-list").append(`
          <div>
          <span>${name}</span>
          <button class="follow" data-user-id="${key}">Seguir</button>
          </div>
          `);
      $(`button[data-user-id=${key}]`).click(function () {
        alert("Agora você me segue!");
        if (!$(this).disabled) {
          $(this).prop('disabled', true);
        }
        database.ref('friendship/' + USER_ID).push({
          friendId: key
        });
        database.ref('posts/' + key).once('value').then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            createPostFriend(childData.text, childKey);
          });
        });
      });
    }
  }
});