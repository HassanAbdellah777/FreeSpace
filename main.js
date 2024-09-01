//at first time page load
init();

//Start Page
function init() {
  // Make a request for a user with a given ID
  axios
    .get("https://tarmeezacademy.com/api/v1/posts")
    .then(function (response) {
      // handle success
      let posts = response.data.data;
      if (Array.isArray(posts)) {
        for (const post of posts) {
          addPost(post);
        }
      } else {
        addPost(posts);
      }
    });
  setUserUI();
}

// Set Page UI based on user
function setUserUI() {
  let loginDiv = document.getElementById("login-register");
  let logoutDiv = document.getElementById("logout-div");
  let newPostDiv = document.getElementById("new-post-div");
  if (localStorage.getItem("token")) {
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    newPostDiv.style.setProperty("display", "flex", "important");
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
    newPostDiv.style.setProperty("display", "none", "important");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//adding Post Function
function addPost(post) {
  //Get Posts Element
  let postsElement = document.querySelector(".posts");

  let uName = post.author.name;
  let imageProfile =
    typeof post.author.profile_image === "string"
      ? post.author.profile_image
      : "./imgs/user-avatar.png";
  let imageUrl = post.image;
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
                <b>@${uName}</b>
              </div>
              <div class="card-body">
                <img style="width: 100%" src="${imageUrl}" alt="" />
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

// login Function
function loginFunction() {
  const userInput = document.getElementById("user-name").value;
  const pwdInput = document.getElementById("password").value;
  const loginUrl = "https://tarmeezacademy.com/api/v1/login";
  const loginParams = { username: userInput, password: pwdInput };
  axios
    .post(loginUrl, loginParams)
    .then((response) => {
      let token = response.data.token;
      console.log(token);
      window.localStorage.setItem("token", token);
      console.log(window.localStorage.getItem("token"));
      console.log(response.data.user);
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
      console.log(error.response.data.message);
      let errorMsgElement = document.querySelector(".error-login");
      console.log(errorMsgElement);
      errorMsgElement.textContent = error.response.data.message;
    });
}
// Register Function
function registerFunction() {
  const userInput = document.getElementById("register-user-name").value;
  const nameInput = document.getElementById("register-name").value;
  const pwdInput = document.getElementById("register-password").value;
  const emailInput = document.getElementById("email-user").value;
  const imageFile = document.getElementById("image-file").files[0];
  console.log(imageFile);
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
      console.log(token);
      window.localStorage.setItem("token", token);
      console.log(window.localStorage.getItem("token"));
      console.log(response.data.user);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      let modalElement = document.getElementById("registerModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      toastMsg("Registration Completed", "success");
      // setUserUI();
      init();
    })
    .catch(function (error) {
      console.log(error.response.data.message);
      let errorMsgElement = document.querySelector(".error-register");
      console.log(errorMsgElement);
      errorMsgElement.textContent = error.response.data.message;
    });
}

//Logout Function
function logoutFunction() {
  window.localStorage.clear();
  toastMsg("Logged Out", "danger");
  // setUserUI();
  init();
}

//Toast msg
function toastMsg(msg, type) {
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
function clearErrorMsg() {
  document.querySelector(".error-login").textContent = "";
  document.querySelector(".error-register").textContent = "";
}
