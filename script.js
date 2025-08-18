let search = document.querySelector(".search");

let textInp = document.querySelector(".text");
let card = document.querySelector(".card");

function getUserName(userName) {
  return fetch(`https://api.github.com/users/${userName}`).then((raw) => {
    if (!raw.ok) throw Error("User Not Found");
    return raw.json();
  });
}

function getRepos(userName) {
  return fetch(
    `https://api.github.com/users/${userName}/repos?sort=updated`
  ).then((raw) => {
    if (!raw.ok) throw Error("Repository Not Found");
    return raw.json();
  });
}

// getRepos("async").then(function(data){
// console.log(data);
// })

function decorateProfileData(details) {
  console.log(details);

  let data = `<!-- User Card (Dummy Data Example) -->
        
            <img src="${details.avatar_url}" 
                 alt="octocat" 
                 class="w-28 h-28 rounded-full border border-gray-600" />
            
            <!-- Info -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-100">${details.name}</h2>
              <p class="text-gray-400">${details.login}</p>
              <p class="mt-3 text-gray-300">
                ${details.bio ? details.bio : ""}  
              </p>

              <!-- Profile Link -->
              <a href="https://github.com/${details.login}" 
                 target="_blank"
                 class="inline-block mt-4 text-indigo-500 font-medium hover:underline">
                View Profile →
              </a>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="grid grid-cols-3 gap-6 mt-8 text-center">
            <div class="bg-[#0d1117] rounded-xl p-4">
              <p class="text-xl font-semibold text-gray-100">${
                details.public_repos
              }</p>
              <p class="text-gray-400 text-sm">Repositories</p>
            </div>
            <div class="bg-[#0d1117] rounded-xl p-4">
              <p class="text-xl font-semibold text-gray-100">${
                details.followers
              }</p>
              <p class="text-gray-400 text-sm">Followers</p>
            </div>
            <div class="bg-[#0d1117] rounded-xl p-4">
              <p class="text-xl font-semibold text-gray-100">${
                details.following
              }</p>
              <p class="text-gray-400 text-sm">Following</p>
            </div>
          </div>

          <!-- Extra Info -->
          <div class="mt-8 grid sm:grid-cols-2 gap-6 text-sm text-gray-300">
            <p><span class="font-semibold">Company:</span> ${
              details.company ? details.company : "N/A"
            }</p>
            <p><span class="font-semibold">Location:</span> ${
              details.location ? details.location : "N/A"
            }</p>
            <p><span class="font-semibold">Blog:</span> 
   ${
     details.blog && details.blog.trim() !== ""
       ? `<a href="${
           details.blog.startsWith("http")
             ? details.blog
             : "https://" + details.blog
         }" 
            class="text-indigo-500 hover:underline" target="_blank">${
              details.blog
            }</a>`
       : "N/A"
   }
</p>

             <p><span class="font-semibold">Joined:</span> ${new Date(
               details.created_at
             ).toDateString()}</p>

          </div>
        </div>`;
  card.innerHTML = data;
}

search.addEventListener("click", function (event) {
  event.preventDefault();
  let userName = textInp.value.trim();
  if (userName.length > 0) {
    getUserName(userName).then((data) => {
      decorateProfileData(data);
    });
  } else {
    console.log("Enter Correct Username");
  }
});
