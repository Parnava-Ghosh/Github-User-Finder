
let search = document.querySelector(".search");
let textInp = document.querySelector(".text");
let card = document.querySelector(".card");

async function getUsers(userName) {
  // Search users
  let searchRes = await fetch(`https://api.github.com/search/users?q=${userName}`);
  if (!searchRes.ok) throw Error("User Not Found");
  let searchData = await searchRes.json();

  if (!searchData.items || searchData.items.length === 0) {
    throw Error("User Not Found");
  }

  // Get full details of each user
  let profiles = await Promise.all(
    searchData.items.map(async (u) => {
      let res = await fetch(`https://api.github.com/users/${u.login}`);
      if (!res.ok) return null;
      return res.json();
    })
  );

  // Remove any null (failed fetches)
  return profiles.filter(Boolean);
}

function decorateProfileData(users) {
  card.innerHTML = ""; // clear previous results

  users.forEach((details) => {
    let data = `
      <div class="bg-[#161b22] p-6 rounded-2xl shadow-md mb-6">
        <div class="flex items-center gap-6">
          <img src="${details.avatar_url}" 
               alt="${details.login}" 
               class="w-28 h-28 rounded-full border border-gray-600" />
          
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-100">${details.name ?? ""}</h2>
            <p class="text-gray-400">@${details.login}</p>
            <p class="mt-3 text-gray-300">${details.bio ?? ""}</p>
            <a href="${details.html_url}" 
               target="_blank"
               class="inline-block mt-4 text-indigo-500 font-medium hover:underline">
              View Profile →
            </a>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-3 gap-6 mt-8 text-center">
          <div class="bg-[#0d1117] rounded-xl p-4">
            <p class="text-xl font-semibold text-gray-100">${details.public_repos}</p>
            <p class="text-gray-400 text-sm">Repositories</p>
          </div>
          <div class="bg-[#0d1117] rounded-xl p-4">
            <p class="text-xl font-semibold text-gray-100">${details.followers}</p>
            <p class="text-gray-400 text-sm">Followers</p>
          </div>
          <div class="bg-[#0d1117] rounded-xl p-4">
            <p class="text-xl font-semibold text-gray-100">${details.following}</p>
            <p class="text-gray-400 text-sm">Following</p>
          </div>
        </div>

        <!-- Extra Info -->
        <div class="mt-8 grid sm:grid-cols-2 gap-6 text-sm text-gray-300">
          <p><span class="font-semibold">Company:</span> ${details.company ?? "N/A"}</p>
          <p><span class="font-semibold">Location:</span> ${details.location ?? "N/A"}</p>
          <p><span class="font-semibold">Blog:</span> 
            ${details.blog && details.blog.trim() !== ""
        ? `<a href="${details.blog.startsWith("http") ? details.blog : "https://" + details.blog}" 
                     class="text-indigo-500 hover:underline" target="_blank">${details.blog}</a>`
        : "N/A"}
          </p>
          <p><span class="font-semibold">Joined:</span> ${new Date(details.created_at).toDateString()}</p>
        </div>
      </div>
    `;

    card.innerHTML += data;
  });
}

search.addEventListener("click", function (event) {
  event.preventDefault();
  let userName = textInp.value.trim();
  if (userName.length > 0) {
    getUsers(userName)
      .then((profiles) => {
        decorateProfileData(profiles);
      })
      .catch((err) => {
        card.innerHTML = `<p class="text-red-500">❌ ${err.message}</p>`;
      });
  } else {
    card.innerHTML = `<p class="text-red-500">Please enter a username</p>`;
  }
});

