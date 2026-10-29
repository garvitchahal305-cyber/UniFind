/**
 * UniFind - University Lost & Found Web Application
 * Client-side script handling storage, filtering, reporting, and modals.
 */

// Initial Seed Data for realistic campus experience
const DEFAULT_ITEMS = [
  {
    id: "item-1",
    type: "lost", // 'lost', 'found', or 'claimed'
    originalType: "lost",
    title: "Space Gray MacBook Air M2 Charger (MagSafe 3)",
    category: "Electronics",
    location: "Central Library",
    spot: "3rd floor quiet study area, carrel desk #42",
    date: "2026-09-28",
    description: "Original 67W Apple USB-C power adapter with braided white MagSafe cable. Left plugged into the outlet column near desk 42 around 6 PM.",
    contactName: "Alex Rivera",
    contactEmail: "alex.r@univ.edu",
    contactPhone: "(555) 345-9812",
    reward: "$15 Coffee Gift Card",
    image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-2",
    type: "found",
    originalType: "found",
    title: "Student ID Card & Dorm Keycard (Jordan M.)",
    category: "Student IDs & Cards",
    location: "Main Cafeteria & Food Court",
    spot: "Left on tray return carousel by sandwich counter",
    date: "2026-09-30",
    description: "Blue university student card with lanyard. Name on the card is 'Jordan Miller' with ID ending in 8841. Handed to cafeteria supervisor.",
    contactName: "Dining Services Staff",
    contactEmail: "dining-support@univ.edu",
    contactPhone: "(555) 019-4825",
    reward: "",
    image: "https://images.unsplash.com/photo-1578874691223-a4558a07c9c7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-3",
    type: "lost",
    originalType: "lost",
    title: "Navy Blue Hydro Flask 32oz (National Parks Stickers)",
    category: "Bottles & Personal",
    location: "Sports Complex & Gym",
    spot: "Weight room bench beside squat racks",
    date: "2026-09-29",
    description: "Navy blue wide mouth Hydro Flask covered with Yosemite and Grand Canyon stickers. Has a slight dent on the bottom rim.",
    contactName: "Sophia Lee",
    contactEmail: "sophia.lee@univ.edu",
    contactPhone: "(555) 789-2310",
    reward: "Eternal gratitude & boba drink!",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-4",
    type: "found",
    originalType: "found",
    title: "TI-84 Plus CE Graphing Calculator (Black)",
    category: "Electronics",
    location: "Science & Engineering Complex",
    spot: "Found on table outside Lab 204",
    date: "2026-10-01",
    description: "Black TI-84 Plus CE in great condition. Has a small gold star sticker on the back sliding cover. Slide cover is attached.",
    contactName: "Prof. Henderson's TA",
    contactEmail: "ta-henderson@univ.edu",
    contactPhone: "",
    reward: "",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-5",
    type: "lost",
    originalType: "lost",
    title: "Car Key Fob with Batman Keychain & Green Tag",
    category: "Keys",
    location: "Campus Shuttle / Parking Lot",
    spot: "Near East Lot Bus Shelter B",
    date: "2026-09-27",
    description: "Honda car key with electronic unlock remote, attached to an enamel Batman symbol keychain and a neon green gym tag.",
    contactName: "David Kim",
    contactEmail: "dkim@univ.edu",
    contactPhone: "(555) 912-4411",
    reward: "$30 Cash Reward",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-6",
    type: "claimed",
    originalType: "found",
    title: "Organic Chemistry 8th Edition Textbook (Wade)",
    category: "Books & Stationery",
    location: "Lecture Hall Auditorium",
    spot: "Row D, Seat 14",
    date: "2026-09-25",
    description: "Hardcover chemistry textbook with purple bookmarks inside chapters 5 and 6. Reunited with owner on Oct 1st.",
    contactName: "Emily Davis",
    contactEmail: "emily.d@univ.edu",
    contactPhone: "",
    reward: "",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
  }
];

// Fallback images according to item category if none uploaded
const CATEGORY_IMAGES = {
  "Electronics": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
  "Student IDs & Cards": "https://images.unsplash.com/photo-1578874691223-a4558a07c9c7?auto=format&fit=crop&w=600&q=80",
  "Keys": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
  "Books & Stationery": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
  "Clothing & Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  "Bottles & Personal": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  "Other": "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80"
};

class UniFindApp {
  constructor() {
    this.storageKey = "uni_lost_found_items";
    this.items = [];
    this.activeFilters = {
      search: "",
      status: "all",
      category: "all",
      location: "all",
      sort: "newest"
    };
    this.activeItem = null;
    this.uploadedImageBase64 = null;

    this.cacheDOMElements();
    this.bindEvents();
    this.init();
  }

  cacheDOMElements() {
    // Stats
    this.statLostCount = document.getElementById("statLostCount");
    this.statFoundCount = document.getElementById("statFoundCount");
    this.statResolvedCount = document.getElementById("statResolvedCount");
    this.statTotalCount = document.getElementById("statTotalCount");
    this.statRate = document.getElementById("statRate");

    // Grid & Empty State
    this.itemsGrid = document.getElementById("itemsGrid");
    this.recentItemsGrid = document.getElementById("recentItemsGrid");
    this.emptyState = document.getElementById("emptyState");

    // Filter controls
    this.searchInput = document.getElementById("searchInput");
    this.clearSearchBtn = document.getElementById("clearSearchBtn");
    this.statusPills = document.getElementById("statusPills");
    this.categoryFilter = document.getElementById("categoryFilter");
    this.locationFilter = document.getElementById("locationFilter");
    this.sortFilter = document.getElementById("sortFilter");
    this.activeFiltersSummary = document.getElementById("activeFiltersSummary");
    this.filterTagsContainer = document.getElementById("filterTagsContainer");
    this.clearAllFiltersBtn = document.getElementById("clearAllFiltersBtn");
    this.resetDemoBtn = document.getElementById("resetDemoBtn");

    // Report Modal
    this.openReportModalBtn = document.getElementById("openReportModalBtn");
    this.reportModal = document.getElementById("reportModal");
    this.closeReportModalBtn = document.getElementById("closeReportModalBtn");
    this.cancelReportBtn = document.getElementById("cancelReportBtn");
    this.reportForm = document.getElementById("reportForm");
    this.itemDateInput = document.getElementById("itemDate");
    this.rewardGroup = document.getElementById("rewardGroup");

    // Image Upload
    this.itemImageInput = document.getElementById("itemImageInput");
    this.uploadPlaceholder = document.getElementById("uploadPlaceholder");
    this.imagePreviewContainer = document.getElementById("imagePreviewContainer");
    this.imagePreview = document.getElementById("imagePreview");
    this.removeImageBtn = document.getElementById("removeImageBtn");

    // Details Modal
    this.detailsModal = document.getElementById("detailsModal");
    this.closeDetailsModalBtn = document.getElementById("closeDetailsModalBtn");
    this.detailBadge = document.getElementById("detailBadge");
    this.detailImage = document.getElementById("detailImage");
    this.detailTitle = document.getElementById("detailTitle");
    this.detailCategory = document.getElementById("detailCategory");
    this.detailLocation = document.getElementById("detailLocation");
    this.detailDate = document.getElementById("detailDate");
    this.detailDescription = document.getElementById("detailDescription");
    this.detailSpotSection = document.getElementById("detailSpotSection");
    this.detailSpot = document.getElementById("detailSpot");
    this.detailRewardSection = document.getElementById("detailRewardSection");
    this.detailRewardText = document.getElementById("detailRewardText");
    this.detailContactName = document.getElementById("detailContactName");
    this.detailContactEmail = document.getElementById("detailContactEmail");
    this.detailContactPhone = document.getElementById("detailContactPhone");
    this.detailEmailBtn = document.getElementById("detailEmailBtn");
    this.toggleClaimBtn = document.getElementById("toggleClaimBtn");
    this.deleteItemBtn = document.getElementById("deleteItemBtn");

    // Toasts
    this.toastContainer = document.getElementById("toastContainer");
  }

  init() {
    this.loadItems();
    if (this.itemDateInput) {
      this.setDefaultDate();
    }
    this.refreshUI();

    // Check URL parameters for direct modal open (e.g. browse.html?action=report)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "report" && this.reportModal) {
      const type = urlParams.get("type") === "found" ? "found" : "lost";
      this.openReportModal(type);
    }
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.activeFilters.search = e.target.value.trim().toLowerCase();
        if (this.clearSearchBtn) {
          this.clearSearchBtn.style.display = this.activeFilters.search ? "block" : "none";
        }
        this.renderItems();
      });
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.activeFilters.search = "";
        this.clearSearchBtn.style.display = "none";
        this.renderItems();
      });
    }

    // Status Pills
    if (this.statusPills) {
      this.statusPills.addEventListener("click", (e) => {
        const btn = e.target.closest(".pill-btn");
        if (!btn) return;
        this.statusPills.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeFilters.status = btn.dataset.status;
        this.renderItems();
      });
    }

    // Dropdown filters
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener("change", (e) => {
        this.activeFilters.category = e.target.value;
        this.renderItems();
      });
    }

    if (this.locationFilter) {
      this.locationFilter.addEventListener("change", (e) => {
        this.activeFilters.location = e.target.value;
        this.renderItems();
      });
    }

    if (this.sortFilter) {
      this.sortFilter.addEventListener("change", (e) => {
        this.activeFilters.sort = e.target.value;
        this.renderItems();
      });
    }

    // Clear all filters button
    if (this.clearAllFiltersBtn) {
      this.clearAllFiltersBtn.addEventListener("click", () => this.resetAllFilters());
    }

    // Reset demo button
    if (this.resetDemoBtn) {
      this.resetDemoBtn.addEventListener("click", () => {
        if (confirm("Reset listings back to default campus demo data? Any custom items will be overwritten.")) {
          this.resetToDemoData();
        }
      });
    }

    // Report Modal triggers
    if (this.openReportModalBtn) {
      this.openReportModalBtn.addEventListener("click", () => this.openReportModal("lost"));
    }
    if (this.closeReportModalBtn) {
      this.closeReportModalBtn.addEventListener("click", () => this.closeReportModal());
    }
    if (this.cancelReportBtn) {
      this.cancelReportBtn.addEventListener("click", () => this.closeReportModal());
    }
    if (this.reportForm) {
      this.reportForm.addEventListener("submit", (e) => this.handleReportSubmit(e));
      
      // Radio report type change in modal (show/hide reward)
      this.reportForm.querySelectorAll("input[name='reportType']").forEach(radio => {
        radio.addEventListener("change", (e) => {
          if (this.rewardGroup) {
            if (e.target.value === "found") {
              this.rewardGroup.style.display = "none";
            } else {
              this.rewardGroup.style.display = "flex";
            }
          }
        });
      });
    }

    // Image Upload input
    if (this.itemImageInput) {
      this.itemImageInput.addEventListener("change", (e) => this.handleImageSelect(e));
    }
    if (this.removeImageBtn) {
      this.removeImageBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.clearImageUpload();
      });
    }

    // Details Modal events
    if (this.closeDetailsModalBtn) {
      this.closeDetailsModalBtn.addEventListener("click", () => this.closeDetailsModal());
    }
    if (this.toggleClaimBtn) {
      this.toggleClaimBtn.addEventListener("click", () => this.handleToggleClaim());
    }
    if (this.deleteItemBtn) {
      this.deleteItemBtn.addEventListener("click", () => this.handleDeleteItem());
    }

    // Close modals on clicking overlay background
    window.addEventListener("click", (e) => {
      if (this.reportModal && e.target === this.reportModal) this.closeReportModal();
      if (this.detailsModal && e.target === this.detailsModal) this.closeDetailsModal();
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.reportModal) this.closeReportModal();
        if (this.detailsModal) this.closeDetailsModal();
      }
    });
  }

  /* ================= Storage & Data ================= */
  loadItems() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse items from storage, reverting to default.", e);
        this.items = [...DEFAULT_ITEMS];
        this.saveItems();
      }
    } else {
      this.items = [...DEFAULT_ITEMS];
      this.saveItems();
    }
  }

  saveItems() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  resetToDemoData() {
    this.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    this.saveItems();
    this.updateStats();
    this.renderItems();
    this.showToast("Demo campus listings restored successfully!", "info");
  }

  setDefaultDate() {
    // Set today's date in report input
    const today = new Date().toISOString().split("T")[0];
    this.itemDateInput.value = today;
    this.itemDateInput.max = today;
  }

  refreshUI() {
    this.updateStats();
    if (this.itemsGrid) {
      this.renderItems();
    }
    if (this.recentItemsGrid) {
      this.renderRecentItems();
    }
  }

  /* ================= Statistics ================= */
  updateStats() {
    const total = this.items.length;
    const lost = this.items.filter(i => i.type === "lost").length;
    const found = this.items.filter(i => i.type === "found").length;
    const resolved = this.items.filter(i => i.type === "claimed").length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    if (this.statTotalCount) this.statTotalCount.textContent = total;
    if (this.statLostCount) this.statLostCount.textContent = lost;
    if (this.statFoundCount) this.statFoundCount.textContent = found;
    if (this.statResolvedCount) this.statResolvedCount.textContent = resolved;
    if (this.statRate) this.statRate.textContent = `${rate}%`;
  }

  /* ================= Dashboard Recent Items ================= */
  renderRecentItems() {
    if (!this.recentItemsGrid) return;
    this.recentItemsGrid.innerHTML = "";

    const recent = [...this.items]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    if (recent.length === 0) {
      this.recentItemsGrid.innerHTML = `
        <div class="empty-recent-state">
          <i class="fa-solid fa-clipboard-check"></i>
          <p>No reports currently logged. All clear!</p>
        </div>
      `;
      return;
    }

    recent.forEach(item => {
      const card = this.createItemCard(item);
      this.recentItemsGrid.appendChild(card);
    });
  }

  /* ================= Filtering & Rendering ================= */
  renderItems() {
    if (!this.itemsGrid) return;

    let filtered = this.items.filter(item => {
      // Status Filter
      if (this.activeFilters.status !== "all" && item.type !== this.activeFilters.status) {
        return false;
      }

      // Category Filter
      if (this.activeFilters.category !== "all" && item.category !== this.activeFilters.category) {
        return false;
      }

      // Location Filter
      if (this.activeFilters.location !== "all" && item.location !== this.activeFilters.location) {
        return false;
      }

      // Keyword Search
      if (this.activeFilters.search) {
        const query = this.activeFilters.search;
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchLoc = item.location.toLowerCase().includes(query);
        const matchSpot = item.spot ? item.spot.toLowerCase().includes(query) : false;
        const matchCategory = item.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLoc && !matchSpot && !matchCategory) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return this.activeFilters.sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    this.renderActiveFilterTags();

    // Render Grid
    this.itemsGrid.innerHTML = "";
    if (filtered.length === 0) {
      this.itemsGrid.style.display = "none";
      this.emptyState.style.display = "block";
    } else {
      this.itemsGrid.style.display = "grid";
      this.emptyState.style.display = "none";

      filtered.forEach(item => {
        const card = this.createItemCard(item);
        this.itemsGrid.appendChild(card);
      });
    }
  }

  createItemCard(item) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.addEventListener("click", () => this.openDetailsModal(item.id));

    // Badge styling & text
    let badgeClass = "status-lost";
    let badgeLabel = "Lost";
    if (item.type === "found") {
      badgeClass = "status-found";
      badgeLabel = "Found";
    } else if (item.type === "claimed") {
      badgeClass = "status-claimed";
      badgeLabel = "Reunited / Claimed";
    }

    const imageSrc = item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES["Other"];
    const formattedDate = this.formatDate(item.date);

    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${this.escapeHtml(imageSrc)}" alt="${this.escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'" />
        <span class="status-badge ${badgeClass}">${badgeLabel}</span>
        ${item.reward ? `<span class="reward-tag"><i class="fa-solid fa-gift"></i> Reward</span>` : ''}
      </div>

      <div class="card-body">
        <div class="card-category-row">
          <span class="card-category">${this.escapeHtml(item.category)}</span>
          <span class="card-date">${formattedDate}</span>
        </div>

        <h3 class="card-title">${this.escapeHtml(item.title)}</h3>

        <div class="card-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${this.escapeHtml(item.location)}</span>
        </div>

        <p class="card-desc">${this.escapeHtml(item.description)}</p>

        <div class="card-footer">
          <div class="card-user">
            <div class="card-user-avatar"><i class="fa-solid fa-user"></i></div>
            <span>${this.escapeHtml(item.contactName)}</span>
          </div>
          <span class="btn-text">Details <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </div>
    `;

    return card;
  }

  renderActiveFilterTags() {
    const tags = [];

    if (this.activeFilters.search) {
      tags.push({ label: `Search: "${this.activeFilters.search}"`, clear: () => this.clearSearchBtn.click() });
    }
    if (this.activeFilters.status !== "all") {
      tags.push({ 
        label: `Status: ${this.activeFilters.status.toUpperCase()}`, 
        clear: () => {
          this.statusPills.querySelector('[data-status="all"]').click();
        } 
      });
    }
    if (this.activeFilters.category !== "all") {
      tags.push({ 
        label: `Category: ${this.activeFilters.category}`, 
        clear: () => {
          this.categoryFilter.value = "all";
          this.activeFilters.category = "all";
          this.renderItems();
        } 
      });
    }
    if (this.activeFilters.location !== "all") {
      tags.push({ 
        label: `Location: ${this.activeFilters.location}`, 
        clear: () => {
          this.locationFilter.value = "all";
          this.activeFilters.location = "all";
          this.renderItems();
        } 
      });
    }

    if (tags.length > 0) {
      this.activeFiltersSummary.style.display = "flex";
      this.filterTagsContainer.innerHTML = "";
      tags.forEach(tag => {
        const el = document.createElement("span");
        el.className = "filter-tag";
        el.innerHTML = `${this.escapeHtml(tag.label)} <i class="fa-solid fa-xmark"></i>`;
        el.querySelector("i").addEventListener("click", tag.clear);
        this.filterTagsContainer.appendChild(el);
      });
    } else {
      this.activeFiltersSummary.style.display = "none";
    }
  }

  resetAllFilters() {
    this.activeFilters = {
      search: "",
      status: "all",
      category: "all",
      location: "all",
      sort: "newest"
    };

    this.searchInput.value = "";
    this.clearSearchBtn.style.display = "none";
    this.categoryFilter.value = "all";
    this.locationFilter.value = "all";
    this.sortFilter.value = "newest";

    this.statusPills.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
    this.statusPills.querySelector('[data-status="all"]').classList.add("active");

    this.renderItems();
  }

  /* ================= Report Modal ================= */
  openReportModal(preferredType = "lost") {
    this.reportForm.reset();
    this.setDefaultDate();
    this.clearImageUpload();

    // Set selected type
    const radio = this.reportForm.querySelector(`input[name="reportType"][value="${preferredType}"]`);
    if (radio) {
      radio.checked = true;
      if (preferredType === "found") {
        this.rewardGroup.style.display = "none";
      } else {
        this.rewardGroup.style.display = "flex";
      }
    }

    this.reportModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  closeReportModal() {
    this.reportModal.style.display = "none";
    document.body.style.overflow = "";
    this.clearImageUpload();
  }

  handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedImageBase64 = event.target.result;
      this.imagePreview.src = this.uploadedImageBase64;
      this.uploadPlaceholder.style.display = "none";
      this.imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  clearImageUpload() {
    this.uploadedImageBase64 = null;
    this.itemImageInput.value = "";
    this.imagePreview.src = "";
    this.imagePreviewContainer.style.display = "none";
    this.uploadPlaceholder.style.display = "flex";
  }

  handleReportSubmit(e) {
    e.preventDefault();

    const reportType = this.reportForm.querySelector('input[name="reportType"]:checked').value;
    const title = document.getElementById("itemTitle").value.trim();
    const category = document.getElementById("itemCategory").value;
    const location = document.getElementById("itemLocation").value;
    const spot = document.getElementById("itemSpecificSpot").value.trim();
    const date = document.getElementById("itemDate").value;
    const description = document.getElementById("itemDescription").value.trim();
    const contactName = document.getElementById("contactName").value.trim();
    const contactEmail = document.getElementById("contactEmail").value.trim();
    const contactPhone = document.getElementById("contactPhone").value.trim();
    const reward = reportType === "lost" ? document.getElementById("itemReward").value.trim() : "";

    const newItem = {
      id: "item-" + Date.now(),
      type: reportType,
      originalType: reportType,
      title,
      category,
      location,
      spot,
      date,
      description,
      contactName,
      contactEmail,
      contactPhone,
      reward,
      image: this.uploadedImageBase64 || CATEGORY_IMAGES[category] || CATEGORY_IMAGES["Other"]
    };

    // Prepend to list
    this.items.unshift(newItem);
    this.saveItems();
    this.refreshUI();
    this.closeReportModal();

    this.showToast(`Your report for "${title}" has been published!`, "success");
  }

  /* ================= Details Modal ================= */
  openDetailsModal(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    this.activeItem = item;

    // Set badge
    this.detailBadge.className = "status-badge";
    if (item.type === "lost") {
      this.detailBadge.classList.add("status-lost");
      this.detailBadge.textContent = "LOST ITEM";
    } else if (item.type === "found") {
      this.detailBadge.classList.add("status-found");
      this.detailBadge.textContent = "FOUND ITEM";
    } else {
      this.detailBadge.classList.add("status-claimed");
      this.detailBadge.textContent = "CLAIMED / REUNITED";
    }

    // Set image
    const imageSrc = item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES["Other"];
    this.detailImage.src = imageSrc;

    // Set texts
    this.detailTitle.textContent = item.title;
    this.detailCategory.textContent = item.category;
    this.detailLocation.textContent = item.location;
    this.detailDate.textContent = this.formatDate(item.date);
    this.detailDescription.textContent = item.description;

    // Spot info
    if (item.spot) {
      this.detailSpot.textContent = item.spot;
      this.detailSpotSection.style.display = "block";
    } else {
      this.detailSpotSection.style.display = "none";
    }

    // Reward info
    if (item.reward && item.type === "lost") {
      this.detailRewardText.textContent = item.reward;
      this.detailRewardSection.style.display = "flex";
    } else {
      this.detailRewardSection.style.display = "none";
    }

    // Contact info
    this.detailContactName.textContent = item.contactName;
    this.detailContactEmail.textContent = item.contactEmail;
    this.detailContactPhone.textContent = item.contactPhone ? `Phone: ${item.contactPhone}` : "";
    this.detailEmailBtn.href = `mailto:${encodeURIComponent(item.contactEmail)}?subject=${encodeURIComponent(`UniFind Inquiry: ${item.title}`)}`;

    // Claim Toggle button state
    if (item.type === "claimed") {
      this.toggleClaimBtn.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Re-open as Active Listing`;
      this.toggleClaimBtn.className = "btn btn-outline btn-block";
    } else {
      this.toggleClaimBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Mark as Claimed / Reunited`;
      this.toggleClaimBtn.className = "btn btn-emerald btn-block";
    }

    this.detailsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  closeDetailsModal() {
    this.detailsModal.style.display = "none";
    document.body.style.overflow = "";
    this.activeItem = null;
  }

  handleToggleClaim() {
    if (!this.activeItem) return;

    if (this.activeItem.type === "claimed") {
      // Reopen to original type
      this.activeItem.type = this.activeItem.originalType || "lost";
      this.showToast(`Listing re-opened as ${this.activeItem.type}!`, "info");
    } else {
      // Mark claimed
      this.activeItem.type = "claimed";
      this.showToast(`Item marked as Reunited / Claimed!`, "success");
    }

    this.saveItems();
    this.refreshUI();
    this.openDetailsModal(this.activeItem.id); // Refresh detail view
  }

  handleDeleteItem() {
    if (!this.activeItem) return;

    if (confirm(`Are you sure you want to delete the listing for "${this.activeItem.title}"?`)) {
      this.items = this.items.filter(i => i.id !== this.activeItem.id);
      this.saveItems();
      this.refreshUI();
      this.closeDetailsModal();
      this.showToast("Listing deleted successfully.", "danger");
    }
  }

  /* ================= Helper Utilities ================= */
  formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  escapeHtml(string) {
    if (!string) return "";
    return String(string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "danger") icon = "fa-triangle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${this.escapeHtml(message)}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate application on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new UniFindApp();
});
