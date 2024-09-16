import { getPosts } from "./main.js";
import { toastMsg } from "./main.js";

// get user ID for profile page
const queryStringUser = window.location.search; // Returns:'?q=123'
// Further parsing:
const paramsUser = new URLSearchParams(queryStringUser);
const userIdSearch = parseInt(paramsUser.get("userId")); // is the number 123
if (userIdSearch) {
  // console.log(userIdSearch);
  let userPostsDiv = document.querySelector("user-posts");
  // getPosts(userId);
  // console.log("in profile");
  let urlReq = `https://tarmeezacademy.com/api/v1/users/${userIdSearch}`;
  axios.get(urlReq).then(function (response) {
    // handle success
    let userDetails = response.data.data;
    // console.log(userDetails);

    let userProfileDiv = document.getElementById("user-profile");
    // console.log(userProfileDiv);

    let profileUserName = userDetails.username;
    let profileName = userDetails.name;
    let profileEmail = userDetails.email;
    let profileImage =
      typeof userDetails.profile_image === "string"
        ? userDetails.profile_image
        : "./imgs/user-avatar.png";
    let profileCommentsCount = userDetails.comments_count;
    let profilePostsCount = userDetails.posts_count;

    userProfileDiv.innerHTML = `
            <!-- user card -->
        <div class="card">
              <h4 class="card-header" id="user-name-card-header">${profileName}'s Profile</h4>
              <div class="card-body d-flex flex-column gap-2 justify-content-center align-items-start">
                <img class="mb-2"
                  style="width: 80px; height: 80px"
                  src=${profileImage}
                  alt=""
                />
                <b>Name :<span class="text-primary"> ${profileName}</span></b>
            
                
                <b>User Name :  <span class="text-primary">${profileUserName}</span></b>
                <b>Email : <span class="text-primary">${profileEmail}</span></b>
                <b>Posts Count : <span class="text-primary">${profilePostsCount}</span></b>
                <b>Comments Count : <span class="text-primary">${profileCommentsCount}</span></b>
              </div>
            </div>
            <!-- user card -->
`;
  });
}

`https://tarmeezacademy.com/api/v1/users/14559/posts`;

// getPosts(1, `https://tarmeezacademy.com/api/v1/users/${userIdSearch}/posts`);

getUserPosts(userIdSearch);
export function getUserPosts(userId) {
  //  Get Posts Element
  let userPostsDiv = document.querySelector(".user-posts");
  //Request Posts
  let urlReq = `https://tarmeezacademy.com/api/v1/users/${userId}/posts`;
  axios.get(urlReq).then(function (response) {
    // handle success
    let posts = response.data.data;
    for (let post of posts) {
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
                          <b>@${uName}</b>
                        </div>
                        <div class="card-body" style="cursor: pointer" onclick="postPage(${post.id})"">
                          <div class="d-flex w-100 justify-content-center" >
                      <img style="max-width: 100%; max-height: 80vh; object-fit: contain" src="${imageUrl}" alt="" />
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
      userPostsDiv.appendChild(card);
    }
  });
}

//update profile
// export function changeName() {
//   let profileName = document.getElementById("profile-name");
//   let profilePwd = document.getElementById("profile-pwd");

//   const token = localStorage.getItem("token");
//   // console.log(postId);
//   const updateProfileUrl = `https://tarmeezacademy.com/api/v1/updatePorfile`;
//   const config = {
//     headers: { Authorization: `Bearer ${token}` },
//   };
//   const bodyParameters = {
//     // username: profileName.value,
//     password: profilePwd.value,
//     name: profileName.value,
//   };
//   axios
//     .put(updateProfileUrl, bodyParameters, config)
//     .then((response) => {
//       toastMsg("Profile Updated Successfully", "success");
//       console.log(response);
//       document.getElementById(
//         "user-name-card-header"
//       ).textContent = `${profileName.value}'s Profile`;
//     })
//     .catch((error) => {
//       console.log(error);
//       toastMsg(error.response.data.message, "danger");
//     });
// }

//onclick funtions
window.changeName = changeName;
