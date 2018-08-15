var database = firebase.database();
var USER_ID = window.location.search.match(/\?userId=(.*)/)[1];


$(document).ready(function() {
  database.ref("users/" + USER_ID).once("value")
  .then(function(snapshot) {
    var userInfo = snapshot.val();
    $(".user-name").text(userInfo.name)
  })

  database.ref("users").once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      createUsers(childData.name, childKey);
    });
  })

  database.ref('posts/' + USER_ID).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      createPost(childData.text, childKey);
    });
  });

  $(".send-button").click(function(event) {
    event.preventDefault();

    var text = $(".post-input").val();
    $(".post-input").val("");

    var newPostInDB = database.ref('posts/' + USER_ID).push({
      text: text
    });

    createPost(text, newPostInDB.key);

  })
});

function createPost(text, key) {
  $(".posts-list").append(`
    <li>
      <span data-text-id="${key}" >${text}</span>
      <button data-edit-id="${key}" >Editar</button>
      <button data-delete-id="${key}" >Excluir</button>
    </li>
  `);

  $(`button[data-delete-id=${key}]`).click(function() {
    $(this).parent().remove();
    database.ref('posts/'+ USER_ID + "/" + key).remove();
  });

  $(`button[data-edit-id=${key}]`).click(function() {
    var newText = prompt(`Altere o seu texto: ${text}`);
    $(`span[data-text-id=${key}]`).text(newText);
    database.ref(`posts/${USER_ID}/${key}`).update({
      text: newText
    })

  });

}

function createUsers(name, key) {
  if (key !== USER_ID) {
    $(".users-list").append(`
      <li>
        <span>${name}</span>
        <button data-user-id="${key}">seguir</button>
      </li>
    `);
  }

  $(`button[data-user-id=${key}]`).click(function () {
    database.ref('friendship/' + USER_ID).push({
      friendId: key
    });
  })

}



// var database = firebase.database();
// var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
//
// $(document).ready(function() {
//   getPostsFromDB();
//   $(".add-posts").click(addPostsClick);
// });
//
// function addPostsClick(event) {
//   event.preventDefault();
//
//   var newPost = $(".posts-input").val();
//   var visualization = $("#visualization option:selected").val(); //
//   var postFromDB = addPostToDB(newPost);
//
//   createListItem(newPost, postFromDB.key)
// }
//
// function addPostToDB(text, visualization) {
//   return database.ref("posts/" + USER_ID).push({
//     text: text
//   });
// }
//
// function getPostsFromDB() {
//   database.ref("posts/" + USER_ID).once('value')
//   .then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var childKey = childSnapshot.key;
//       var childData = childSnapshot.val();
//       createListItem(childData.text, childKey)
//     });
//   });
// }
//
// function createListItem(text, key) {
//   $(".posts-list").append(`
//     <li>
//     <input type="checkbox" data-post-id=${key} />
//     <span>${text}</span>
//     </li>`);
//
//     $(`input[data-post-id="${key}"]`).click(function() {
//       database.ref("posts/" + USER_ID + "/" + key).remove();
//       $(this).parent().remove();
//     });
//   }
