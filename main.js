const getUser = getData("https://jsonplaceholder.typicode.com/users");
const getPosts = getData("https://jsonplaceholder.typicode.com/posts");

async function mergeAndCreateUserList() {

  try {

    let userPostsData = await mergePostsAndUsers(getPosts, getUser);
    createUserList(userPostsData, "content");

    const callElementument = document.getElementById("returnHomePage");
    if (returnHomePage) {
      callElementument.addEventListener("click", () => {
        createUserList(userPostsData, 'content');
      });
    }

  } catch (error) {
    throw new Error(error);
  }
}

mergeAndCreateUserList();



async function mergePostsAndUsers(users, posts) {
  try {
    const [arrUser, arrPosts] = await Promise.all([posts, users]);
    return addPostsToUsers(arrUser, arrPosts);

  } catch (error) {
    throw new Error(error);
  }
}

function createUserList(userPosts, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let ul = document.createElement("ul");
  let h2 = document.createElement("h2");

  h2.textContent = " Посты пользователей";
  ul.append(h2);

  userPosts.forEach((user) => {
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

  ul = h2 = null;
}

async function getData(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();

    return json;

  } catch (error) {
    throw new Error(error);
  }
}

function addPostsToUsers(arrUser, arrPosts) {
  const userPosts = arrUser.map((user) => ({
    username: user.username,
    posts: [],
    get countUserPost() {
      return this.posts.length;
    },
  }));

  arrPosts.forEach(post => {
    const user = arrUser.find(user => user.id === post.userId);

    if (user) {
      const index = arrUser.indexOf(user);
      const { userId, ...newPost } = post;

      userPosts[index].posts.push(newPost);
    }
  });


  return userPosts;
}


