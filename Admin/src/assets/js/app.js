/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: app js
*/
const script = document.createElement('script');
script.src = 'https://unpkg.com/lucide@latest';
script.onload = () => {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
};
document.head.appendChild(script);

// Initialize Bootstrap tooltips and popovers
function initializeBootstrapComponents(selector, Component) {
  const triggerList = document.querySelectorAll(selector);
  return [...triggerList].map((triggerEl) => new Component(triggerEl));
}

// Initialize tooltips
const tooltips = initializeBootstrapComponents(
  '[data-bs-toggle="tooltip"]',
  bootstrap.Tooltip
);

// Initialize popovers
const popovers = initializeBootstrapComponents(
  '[data-bs-toggle="popover"]',
  bootstrap.Popover
);

// Function to handle both sticky menu and button loading
function initializeAppFeatures() {
  const stickyMenu = document.getElementById("appHeader"); // Ensure this ID matches your HTML
  const stickyOffset = stickyMenu.offsetTop;

  // Function to toggle sticky class on scroll
  function toggleStickyMenu() {
    if (window.scrollY > stickyOffset) {
      stickyMenu.classList.add("sticky-scroll");
    } else {
      stickyMenu.classList.remove("sticky-scroll");
    }
  }

  // Attach the scroll event listener
  window.addEventListener("scroll", toggleStickyMenu);

  // Attach click event listeners to all loader buttons
  document.querySelectorAll(".btn-loader").forEach((button) => {
    button.addEventListener("click", function () {
      const indicatorLabel = this.querySelector(".indicator-label");
      const originalText = indicatorLabel.textContent;
      const loadingText = this.getAttribute("data-loading-text");

      // Show loading indicator and disable button
      this.classList.add("loading");
      indicatorLabel.textContent = loadingText;
      this.disabled = true;

      // Simulate an asynchronous operation (e.g., form submission)
      setTimeout(() => {
        // Hide loading indicator and reset button
        this.classList.remove("loading");
        indicatorLabel.textContent = originalText;
        this.disabled = false;
      }, 1500); // Simulated delay of 1.5 seconds
    });
  });

  function searchListUpdate(customMenus) {
    customMenus.forEach((item) => {
      const li = document.createElement("li");
      if (item.separator) {
        li.innerHTML = `
                    <p class="suggestion-title mb-0">${item.separator}</p>
                `;
      } else {
        li.innerHTML = `
                        <a href="${item.link}" class="text-body">
                            <div class="d-flex align-items-center gap-2">
                                <i class="${item.icon}"></i>
                                ${item.name}
                            </div>
                        </a>
                    `;
      }
      if (item.separator) li.classList.add("mt-3", "mb-1");
      else li.classList.add("suggestion-item", "d-flex", "align-items-center");

      searchList.appendChild(li);
    });

    if (customMenus.length === 0) {
      const li = document.createElement("li");
      li.innerHTML = `
                <div class="d-flex align-items-center flex-column justify-content-center gap-2 my-16">
                    <i class="ri-file-info-line fs-1 text-muted"></i>
                    <p class="suggestion-title mb-0 text-center">No results found</p>
                </div>
            `;
      li.classList.add("mt-3", "mb-1");
      searchList.appendChild(li);
    }
  }
  // Initialize search input functionality
  const searchInputInModal = document.getElementById("searchInputInModal");
  const searchList = document.getElementById("searchList");
  if (searchInputInModal) {
    const allMenus = document.querySelectorAll(
      "#sidebar-simplebar ul.pe-main-menu.list-unstyled"
    );
    const customMenus = [];
    allMenus.forEach((menu) => {
      const items = menu.querySelectorAll("li");
      items.forEach((item) => {
        if (item.querySelector("a") === null) return;
        else if (item.querySelector("a").getAttribute("href").includes("#")) {
          customMenus.push({
            separator: item.querySelector("a").textContent,
            name: "",
          });
        } else {
          customMenus.push({
            name: item.querySelector("a").textContent,
            icon:
              item.querySelector("i")?.className ??
              "ri-square-line pe-nav-icon search-icon",
            link: item.querySelector("a").getAttribute("href"),
          });
        }
      });
    });

    searchListUpdate(customMenus);

    searchInputInModal.addEventListener("input", function () {
      const searchText = this.value.toLowerCase();
      searchList.innerHTML = ""; // Clear previous results
      searchListUpdate(
        customMenus.filter((item) =>
          item.name.toLowerCase().includes(searchText)
        )
      );
    });
  }
  const horizontalMenus = document.getElementById("horizontal-menu");
  if (horizontalMenus) {
    const horizontalMenuItems =
      horizontalMenus.querySelectorAll("nav > ul > li > a");
    horizontalMenuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        setTimeout(() => {
          item.setAttribute("aria-expanded", "false");
          item.classList.remove("collapsed");
          item.nextElementSibling.classList.remove("show");
        }, 300);
      });
    });
  }
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
  if (!document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement) {
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

    // Change icon to exit fullscreen
    const fullscreenBtn = document.getElementById('toggleFullscreen');
    if (fullscreenBtn) {
      const icon = fullscreenBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('ri-fullscreen-line');
        icon.classList.add('ri-fullscreen-exit-line');
      }
    }
  } else {
    // Exit fullscreen mode
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }

    // Change icon back to enter fullscreen
    const fullscreenBtn = document.getElementById('toggleFullscreen');
    if (fullscreenBtn) {
      const icon = fullscreenBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('ri-fullscreen-exit-line');
        icon.classList.add('ri-fullscreen-line');
      }
    }
  }
}

// Initialize fullscreen button
function initializeFullscreenButton() {
  const fullscreenBtn = document.getElementById('toggleFullscreen');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Listen for fullscreen change events to update the icon
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
}

// Update fullscreen icon based on current state
function updateFullscreenIcon() {
  const fullscreenBtn = document.getElementById('toggleFullscreen');
  if (!fullscreenBtn) return;

  const icon = fullscreenBtn.querySelector('i');
  if (!icon) return;

  if (document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement) {
    // We're in fullscreen mode, show exit icon
    icon.classList.remove('ri-fullscreen-line');
    icon.classList.add('ri-fullscreen-exit-line');
  } else {
    // We're not in fullscreen mode, show enter icon
    icon.classList.remove('ri-fullscreen-exit-line');
    icon.classList.add('ri-fullscreen-line');
  }
}

// Call the functions to initialize features
document.addEventListener("DOMContentLoaded", function () {
  initializeAppFeatures();
  initializeFullscreenButton();
});

document.addEventListener('DOMContentLoaded', function () {
  // Select all dropdown menus
  const dropdownMenus = document.querySelectorAll('.dropdown-menu-clickable');

  // Add click event listener to each dropdown menu
  dropdownMenus.forEach(menu => {
    menu.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });
});

setTimeout(() => {

  // Get all menu links with the data-bs-toggle attribute
  const menuLinks = document.querySelectorAll('#sidebar-simplebar a.pe-nav-link[data-bs-toggle="collapse"]');

  // Add an event listener to each menu link
  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Get the id of the collapse element
      const collapseId = link.getAttribute('href').replace('#', '');
      const parentCollapseId = link.closest('.collapse') ? link.closest('.collapse').id : null;
      // If the clicked link is already expanded, do nothing
      setTimeout(() => {
        if (parentCollapseId && document.getElementById(parentCollapseId).classList.contains('show')) {
          return;
        }
        // Close all open menus
        menuLinks.forEach((otherLink) => {
          const otherCollapseId = otherLink.getAttribute('href').replace('#', '');
          if (otherCollapseId !== collapseId) {
            const otherCollapseElement = document.getElementById(otherCollapseId);
            if (otherCollapseElement.classList.contains('show')) {
              otherCollapseElement.classList.remove('show');
            }
          }
        });
      }, 0);
    });
  });
}, 500);