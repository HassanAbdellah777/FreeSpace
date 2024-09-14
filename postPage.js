// let postsElement = document.querySelector(".post-details");
const queryString = window.location.search; // Returns:'?q=123'
// Further parsing:
const params = new URLSearchParams(queryString);
const postId = parseInt(params.get("postId")); // is the number 123
// console.log(postId);
getPost(postId);

//adding Post Function
function getPost(postId) {
  //Get Posts Element
  let postsElement = document.querySelector(".post-details");
  //Request Posts
  let urlReq = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
  axios.get(urlReq).then(function (response) {
    // handle success
    let post = response.data.data;
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

    //handle comments
    let commentsDetails = "";
    let comments = post.comments;
    for (let comment of comments) {
      let commentAuthor = comment.author.name;
      let commentBody = comment.body;
      let commentAutohrImg =
        typeof comment.author.profile_image == "string"
          ? comment.author.profile_image
          : "./imgs/user-avatar.png";

      let commentDiv = document.createElement("div");
      commentDiv.innerHTML = `
      <div class="p-2 my-1 rounded" style="background-color: #e6f7e6">
        <div><img class="border border-3 rounded-circle"
                          style="width: 40px; height: 40px"
                          src="${commentAutohrImg}"
                          alt=""/> <span>${commentAuthor}</span>
                          
        </div>
      <div class="p-2" >${commentBody}</div>
      
      </div>`;
      commentsDetails += commentDiv.innerHTML;
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
                        <div>${commentsDetails}</div>
                      </div>`;
    postsElement.appendChild(card);
  });
}

// add comment function
function addComment() {
  const token = localStorage.getItem("token");
  console.log(postId);
  const addCommentUrl = `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`;

  let addCommentBody = document.getElementById("add-comment-body").value;

  // var myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const bodyParameters = {
    body: addCommentBody,
  };
  axios
    .post(addCommentUrl, bodyParameters, config)
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}

// get my id
if (localStorage.getItem("user")) {
  let userId = JSON.parse(localStorage.getItem("user")).id;
  console.log(userId);
  let urlReq = `https://tarmeezacademy.com/api/v1/users/${userId}`;
  axios.get(urlReq).then(function (response) {
    // handle success
    // let post = response.data.data;
    console.log(response);
  });
}
