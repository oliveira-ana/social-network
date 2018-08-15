var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  getPostsFromDB();
  $(".add-posts").click(addPostsClick);
});

function addPostsClick(event) {
  event.preventDefault();

  var newPost = $(".posts-input").val();
  var visualization = $("#visualization option:selected").val(); //
  var postFromDB = addPostToDB(newPost);

  createListItem(newPost, postFromDB.key)
}

function addPostToDB(text, visualization) {
  return database.ref("posts/" + USER_ID).push({
    text: text
  });
}

function getPostsFromDB() {
  database.ref("posts/" + USER_ID).once('value')
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      createListItem(childData.text, childKey)
    });
  });
}

function createListItem(text, key) {
  $(".posts-list").append(`
    <li>
    <input type="checkbox" data-post-id=${key} />
    <span>${text}</span>
    </li>`);

    $(`input[data-post-id="${key}"]`).click(function() {
      database.ref("posts/" + USER_ID + "/" + key).remove();
      $(this).parent().remove();
    });
  }

  // Edição de posts
  // function updateTasks() {
  //
  // }

  // Upload de imagens
  // const ref = firebase.storage().ref();
  // const file = document.querySelector('.upload-image').files[0]
  // const name = (+new Date()) + '-' + file.name;
  // const metadata = {
  //   contentType: file.type
  // };
  //
  // const task = ref.child(name).put(file, metadata);
  // task
  //   .then(snapshot => snapshot.ref.getDownloadURL())
  //   .then((url) => {
  //     console.log(url);
  //     document.querySelector('#someImageTagID').src = url;
  //   })
  //   .catch(console.error);
