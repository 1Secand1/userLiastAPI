const getUser = getData("https://jsonplaceholder.typicode.com/users");
const getPosts = getData("https://jsonplaceholder.typicode.com/posts");

let userPosts = mergePostsAndUsers(getPosts, getUser).then((res) => {
  createUserList(res, "content");
  userPosts = res;
});

function mergePostsAndUsers(users, posts) {
  const userPosts = Promise.all([posts, users]).then((data) => {
    return addPostsToUsers(data[0], data[1]);
  });

  return userPosts;
}

function createUserList(users, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let ul = document.createElement("ul");
  let h2 = document.createElement("h2");

  h2.textContent = " Посты пользователей";
  ul.append(h2);

  users.forEach((user) => {
    let p = document.createElement("p");
    let li = document.createElement("li");
    let button = document.createElement("button");

    p.textContent = `Пользователь ${user.username} - ${user.countUserPost} постов`;
    button.textContent = "Посмотреть посты";

    button.addEventListener("click", () => {
      displayUserPosts(user.username, user.posts, "content");
    });

    li.append(p);
    li.append(button);
    ul.append(li);

    p = li = button = null;
  });

  container.append(ul);
}

function displayUserPosts(username, posts, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let ul = document.createElement("ul");
  ul.classList.add("posts");

  let h2 = document.createElement("h2");
  h2.textContent = `Посты пользователя ${username}`;

  posts.forEach((post) => {
    let li = document.createElement("li");
    li.classList.add("post");

    li.innerHTML = `      
      <img class="img" src="https://via.placeholder.com/50/92c952" alt="изображение пользователя">

      <div class="text-content">
          <h3>${post.title}</h3>
          <p>
            ${post.body}
          </p>
      </div>
  `;

    ul.append(li);
    li = null;
  });

  container.append(h2);
  container.append(ul);

  ul = h2 = null
}

function getData(url) {
  return new Promise((res) => {
    const data = new Promise((res) => {
      res(fetch(url));
    });

    data.then((response) => res(response.json())).catch(console.log);
  });
}

function addPostsToUsers(arrUser, arrPosts) {
  const userPosts = arrUser.map((user) => ({
    username: user.username,
    posts: [],
    get countUserPost() {
      return this.posts.length;
    },
  }));

  for (let i = 0, j = 0; i < arrPosts.length; i++) {
    const post = arrPosts[i];
    const user = arrUser[j];

    if (!post) {
      return;
    }

    if (user.id == post.userId) {
      const { userId, ...newPost } = post;
      userPosts[j].posts.push(newPost);
    }

    if (user.id !== arrPosts[i + 1]?.userId) {
      j++;
    }
  }

  /**
    arrPosts.forEach(post => {
      const user = arrUser.find(user => user.id === post.userId);

      if (user) {
        const index = arrUser.indexOf(user);
        const { userId, ...newPost } = post;

        userPosts[index].posts.push(post);
      }
    });
   */

  return userPosts;
}
