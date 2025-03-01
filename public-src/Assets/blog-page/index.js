/***** Chef Profiling *****/

let chefsProfile = [
  {
    name: "John Doe",
    tag: "perfect Food Nutritionist",
    image: "/public-src/Assets/Homepage/assets/chefs/chef1.jpg",
    bio: "John Doe Miller is a really good and top rated chef who serve the community and sharing her recipes since 4 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "121 reviews",
  },
  {
    name: "Aina batool",
    tag: "Desi Cuisine expert",
    image: "/public-src/Assets/Homepage/assets/chefs/chef6.jpg",
    bio: "Aina Batool is our desi cuisine expert chef and one of the top rated chef, having above 100+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "234 reviews",
  },
  {
    name: "Janny shen",
    tag: "Master Chef of Chinese",
    image: "/public-src/Assets/Homepage/assets/chefs/chef11.jpg",
    bio: "Janny Shen is a really good and people's favorite chef who serve and sharing her recipes since 2 years, having above 40+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "220 reviews",
  },
  {
    name: "Iliana Dcruz",
    tag: "Bakery items expert",
    image: "/public-src/Assets/Homepage/assets/chefs/chef12.jpg",
    bio: "Iliana Dcruz is favorite chef of anyone who love to eat bakery items, she connect with us since 2 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "210 reviews",
  },
  {
    name: "Tina Joe",
    tag: "Italian Chef",
    image: "/public-src/Assets/Homepage/assets/chefs/chef2.jpg",
    bio: "Tina Joe is our Italian chef, expert in making different kinds of pasta and donuts having 40+ recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "180 reviews",
  },
  {
    name: "Anum Nawaz",
    tag: "Dessert Master",
    image: "/public-src/Assets/Homepage/assets/chefs/chef7.jpg",
    bio: "Anum Nawaz is a really good and top rated chef who serve a sharing her recipes since 4 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "210 reviews",
  },
  {
    name: "Ansa Asif",
    tag: "Pasta expert",
    image: "/public-src/Assets/Homepage/assets/chefs/chef4.jpg",
    bio: "Ansa Asif is a really good and top rated chef who serve a sharing her recipes since 4 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "210 reviews",
  },
  {
    name: "Zain Meer",
    tag: "Snacks variety Expert",
    image: "/public-src/Assets/Homepage/assets/chefs/chef5.jpg",
    bio: "Zain Meer is a really good and top rated chef who serve a sharing her recipes since 4 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>`,
    reviews: "210 reviews",
  },
];

for (let val = 0; val < chefsProfile.length; val++) {
  let chefsDisplay = document.querySelector(".chefs_display");
  let chefCard = document.createElement("div");
  chefCard.setAttribute("class", "chef_profile");
  let chefContent = `<img src="${chefsProfile[val].image}" class="chef_img">
                      <div class="chef_content">
                          <h5>${chefsProfile[val].name}</h5>
                          <p>(${chefsProfile[val].tag})</p>
                          <div class="ratings">
                              ${chefsProfile[val].rating}
                              <span>${chefsProfile[val].reviews}</span>
                          </div>
                      </div>
                      <div class="chef_links">
                          <i class="fa-regular fa-heart"></i>
                          <button class="chef_btn">View Profile <i class="fa-solid fa-arrow-right"></i></button>
                      </div>`;

  chefCard.innerHTML = chefContent;
  chefsDisplay.appendChild(chefCard);
}

document.querySelectorAll(".chef_btn")?.forEach((button, val) => {
  button.addEventListener("click", () => {
    document.querySelector(".chef_preview").style.display = "flex";

    document.querySelector(".single_profile").innerHTML = `
      <div class="single_profile">
              <div class="chef_image">
                  <img src="${chefsProfile[val].image}">
              </div>
              <h5 class="chefname">${chefsProfile[val].name}</h5>
              <small class="cheftag">(${chefsProfile[val].tag})</small>
              <p class="chefbio">${chefsProfile[val].bio}</p>
              <div class="chef_rating">
                  <div class="stars">
                  ${chefsProfile[val].rating}
                  </div>
                  <div class="chef_review">${chefsProfile[val].reviews}</div>
              </div>
              <div class="chef_social">
                  <i class="fa-brands fa-facebook-f"></i>
                  <i class="fa-brands fa-instagram"></i>
                  <i class="fa-brands fa-linkedin"></i>
              </div>
          </div>
      `;
  });
  document.querySelector(".fa-close")?.addEventListener("click", () => {
    document.querySelector(".chef_preview").style.display = "none";
  });
});
