//at first time page load
let currentPage = 1;
let lastPage;
init();

//Start Page
export function init() {
  let postsElement = document.querySelector(".posts");
  if (postsElement) {
    postsElement.innerHTML = "";
    getPosts(currentPage);
  }

  // Make a request for a user with a given ID

  // let baseUrl = "https://tarmeezacademy.com/api/v1/posts?page=1";
  // // "https://tarmeezacademy.com/api/v1/posts"
  // axios.get(urlReq).then(function (response) {
  //   // handle success
  //   let posts = response.data.data;
  //   if (Array.isArray(posts)) {
  //     for (const post of posts) {
  //       getPosts(post);
  //     }
  //   } else {
  //     getPosts(posts);
  //   }
  // });
  setUserUI();
  // console.log("init done");
}

// Set Page UI based on user
export function setUserUI() {
  let loginDiv = document.getElementById("login-register");
  let logoutDiv = document.getElementById("logout-div");
  let newPostDiv = document.getElementById("new-post-div");
  let profileLi = document.getElementById("profile-list");
  let postPageComments = document.getElementById("post-page-comments");
  if (localStorage.getItem("token")) {
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    profileLi.style.setProperty("display", "block", "important");

    if (newPostDiv) {
      newPostDiv.style.setProperty("display", "flex", "important");
    }
    if (postPageComments) {
      postPageComments.style.setProperty("display", "block", "important");
    }
    let loggedUser = JSON.parse(localStorage.getItem("user"));
    let imageProfile =
      typeof loggedUser.profile_image === "string"
        ? loggedUser.profile_image
        : "./imgs/user-avatar.png";
    document.querySelector("#logged-user h6").textContent = loggedUser.username;
    document.querySelector("#user-avatar img").src = imageProfile;
  } else {
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
    profileLi.style.setProperty("display", "none", "important");

    if (newPostDiv) {
      newPostDiv.style.setProperty("display", "none", "important");
    }
    if (postPageComments) {
      postPageComments.style.setProperty("display", "none", "important");
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//adding Post Function
export async function getPosts(page = 1) {
  //Get Posts Element
  let postsElement = document.querySelector(".posts");
  //Request Posts
  let urlReq = `https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`;
  // "https://tarmeezacademy.com/api/v1/posts"
  // axios.get(urlReq).then(function (response) {
  //   // handle success

  // Axios returns a promise, so we can await it
  let response = await axios.get(urlReq);
  let posts = response.data.data;
  lastPage = response.data.meta.last_page; // used to handle pagination
  {
    for (const post of posts) {
      let uName = post.author.name;
      let postAuthorId = post.author.id; // post owner
      let imageProfile =
        typeof post.author.profile_image === "string"
          ? post.author.profile_image
          : "./imgs/user-avatar.png";
      let imageUrl = typeof post.image === "object" ? "" : post.image; // to stop error of posts with no image
      let title = post.title ? post.title : "";
      let body = post.body;
      let time = post.created_at;
      let commentsCount = post.comments_count;
      let postTags = post.tags;
      let tagDiv = document.createElement("div");
      if (postTags.length !== 0) {
        for (let tag of postTags) {
          let tagBtn = document.createElement("button");
          tagBtn.textContent = tag.arabic_name;
          tagBtn.classList.add("btn-secondary", "btn", "btn-sm");
          tagDiv.appendChild(tagBtn);
        }
      }
      let card = document.createElement("div");
      card.className = "card shadow rounded";
      card.innerHTML = ` <div class="card-header">
                      <img
                        class="border border-3 rounded-circle"
                        style="width: 40px; height: 40px"
                        src="${imageProfile}"
                        alt=""
                      />
                      <b style="cursor: pointer" onclick="userProfilePageCard(${postAuthorId}, ${post.id})">@${uName}</b>
                    </div>
                    <div class="card-body"  style="cursor: pointer" onclick="postPage(${post.id})">
                    <div class="d-flex w-100 justify-content-center">
                    <img style="max-width: 100%; max-height: 50vh; object-fit: contain" src="${imageUrl}" alt="" />
                    </div>  
                     <span class="text-secondary d-block">${time}</span>
                      <h5 class="card-title mt-2">${title}</h5>
                      <p class="card-text">
                        ${body}
                      </p>
                         <hr />
                      <div >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pen"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                          />
                        </svg>
                        <span class="mx-1">(${commentsCount})comments</span>
                        <span class="d-inline-flex flex-wrap gap-2 justify-content-center">${tagDiv.innerHTML}</span>
                        
                      </div>
                    </div>`;
      postsElement.appendChild(card);
    }
  }
}

// login Function
export function loginFunction() {
  const userInput = document.getElementById("user-name").value;
  const pwdInput = document.getElementById("password").value;
  const loginUrl = "https://tarmeezacademy.com/api/v1/login";
  const loginParams = { username: userInput, password: pwdInput };
  axios
    .post(loginUrl, loginParams)
    .then((response) => {
      let token = response.data.token;
      // console.log(token);
      window.localStorage.setItem("token", token);
      // console.log(window.localStorage.getItem("token"));
      // console.log(response.data.user);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      let modalElement = document.getElementById("loginModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      toastMsg("Login Successful", "success");
      // Login Alert
      // const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
      // const appendAlert = (message, type) => {
      //   const wrapper = document.createElement("div");
      //   wrapper.innerHTML = [
      //     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      //     `   <div>${message}</div>`,
      //     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      //     "</div>",
      //   ].join("");
      //   alertPlaceholder.append(wrapper);
      //   $("#liveAlertPlaceholder").hide();
      //   $("#myWish").click(function showAlert() {
      //     $("#success-alert")
      //       .fadeTo(2000, 500)
      //       .slideUp(500, function () {
      //         $("#liveAlertPlaceholder").slideUp(500);
      //       });
      //   });
      //   // setTimeout(
      //   //   () => {

      //   //     setTimeout(() => {wrapper.innerHTML = "";}, 2000);
      //   //   },
      //   //   2000
      //   // );
      //   // const bsAlert = new bootstrap.Alert("#liveAlertPlaceholder");
      // };
      // appendAlert("Nice, you triggered this alert message!", "success");
      // const alertTrigger = document.getElementById("liveAlertBtn");
      // if (alertTrigger) {
      //   alertTrigger.addEventListener("click", () => {
      //     appendAlert("Nice, you triggered this alert message!", "success");
      //   });
      // }

      // setUserUI();
      init();
    })
    .catch(function (error) {
      // console.log(error.response.data.message);
      let errorMsgElement = document.querySelector(".error-login");
      // console.log(errorMsgElement);
      errorMsgElement.textContent = error.response.data.message;
    });
}
// Register Function
export function registerFunction() {
  const userInput = document.getElementById("register-user-name").value;
  const nameInput = document.getElementById("register-name").value;
  const pwdInput = document.getElementById("register-password").value;
  const emailInput = document.getElementById("email-user").value;
  const imageFile = document.getElementById("image-file").files[0];
  // console.log(imageFile);
  const registerUrl = "https://tarmeezacademy.com/api/v1/register";
  // const registerParams = {
  //   username: userInput,
  //   name: nameInput,
  //   password: pwdInput,
  //   email: emailInput,
  // };
  // axios.post(registerUrl, registerParams).then((response) => {}
  const form = new FormData();
  form.append("username", userInput);
  form.append("password", pwdInput);
  form.append("name", nameInput);
  form.append("email", emailInput);
  form.append("image", imageFile);
  // axios.post("https://example.com", form);
  axios
    .post(registerUrl, form)
    .then((response) => {
      let token = response.data.token;
      // console.log(token);
      window.localStorage.setItem("token", token);
      // console.log(window.localStorage.getItem("token"));
      // console.log(response.data.user);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      let modalElement = document.getElementById("registerModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      toastMsg("Registration Completed", "success");
      // setUserUI();
      init();
    })
    .catch(function (error) {
      // console.log(error.response.data.message);
      let errorMsgElement = document.querySelector(".error-register");
      // console.log(errorMsgElement);
      // errorMsgElement.textContent = error.response.data.message;
    });
}

//Logout Function
export function logoutFunction() {
  window.localStorage.clear();
  toastMsg("Logged Out", "danger");
  window.location.assign("index.html");
  // setUserUI();
}

//Toast msg
export function toastMsg(msg, type) {
  const toastDiv = document.getElementById("toast-div");
  toastDiv.innerHTML = `<div
    id="liveToast"
    class="toast align-items-center bg-${type}-subtle text-${type}-emphasis"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button
        type="button"
        class="btn-close me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>`;
  const toastLiveExample = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}
//clear Error Msg in Modals
export function clearErrorMsg() {
  document.querySelector(".error-login").textContent = "";
  document.querySelector(".error-register").textContent = "";
}

//Add Post
export function createPostFunction() {
  const token = localStorage.getItem("token");
  const createPostUrl = "https://tarmeezacademy.com/api/v1/posts";

  let postTitle = document.getElementById("createPost-title").value;
  let postBody = document.getElementById("createPost-body").value;
  let postImage = document.getElementById("createPost-image").files[0];

  // var myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");

  let formdata = new FormData();
  formdata.append("title", postTitle);
  formdata.append("body", postBody);
  formdata.append("image", postImage);

  axios
    .post(createPostUrl, formdata, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // console.log(response);
      let modalElement = document.getElementById("createPost");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      toastMsg("Post Has Been Added Successfully", "success");
      init();
    })
    .catch((error) => {
      // console.log(error);
      toastMsg(error.response.data.message, "danger");
    });
}

//PAgination listener
// const handleInfiniteScroll = () => {};

let isLoading = false;
window.addEventListener("scroll", async function () {
  console.log("from scroll");
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
  if (endOfPage && currentPage < lastPage && !isLoading) {
    isLoading = true; // Set the flag to true to prevent further requests
    // Use await to wait for the posts to load
    await getPosts(currentPage + 1); // Wait until the post request is completed
    // console.log(currentPage);
    currentPage++;
    isLoading = false; // Reset the flag after the request is completed
    // console.log(endOfPage);
  }
});

// if (endOfPage && islastPageCheck) {
//   getPosts(currentPage + 1);
//   currentPage++;
//   console.log(currentPage);
//   //addCards(currentPage + 1);
//   // console.log(endOfPage);
// }

//pagination function
// function paginationFunction() {}

export function postPage(postId) {
  window.location.assign(`postPage.html?postId=${postId}`);
  // alert(postId);
}

// function getPost() {
//   console.log();
//   //   window.location()
// }
// getPost();
export function userProfilePage() {
  // get profile user id
  // console.log("profile clicked");
  if (localStorage.getItem("user")) {
    let userId = JSON.parse(localStorage.getItem("user")).id;
    // let urlReq = `https://tarmeezacademy.com/api/v1/users/${userId}`;
    // axios.get(urlReq).then(function (response) {
    //   // handle success
    //   // let post = response.data.data;
    //   // console.log(response);
    // });
    window.location.assign(`profile.html?userId=${userId}`);
  }
}

export function userProfilePageCard(userId, postId) {
  window.location.assign(`profile.html?userId=${userId}`);
}
window.postPage = postPage; // for using onclick in html we can avoid by using addevntlistener
window.userProfilePage = userProfilePage; // for using onclick in html we can avoid by using addevntlistener
window.loginFunction = loginFunction; // for using onclick in html we can avoid by using addevntlistener
window.registerFunction = registerFunction; // for using onclick in html we can avoid by using addevntlistener
window.userProfilePage = userProfilePage; // for using onclick in html we can avoid by using addevntlistener
window.clearErrorMsg = clearErrorMsg; // for using onclick in html we can avoid by using addevntlistener
window.logoutFunction = logoutFunction; // for using onclick in html we can avoid by using addevntlistener
window.createPostFunction = createPostFunction; // for using onclick in html we can avoid by using addevntlistener
window.userProfilePageCard = userProfilePageCard;
