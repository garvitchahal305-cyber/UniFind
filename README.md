# 🎓 UniFind — University Lost & Found Web Portal

A modern, responsive, and feature-complete web application designed for university campuses to help students, faculty, and staff report, track, and reclaim lost items.

Built with clean **HTML5**, **CSS3**, and **JavaScript (ES6+)**. Works directly out of the box in **Visual Studio Code** without requiring Node.js, npm, or build tools!

---

## 🚀 How to Run in Visual Studio Code

### Method 1: Using VS Code Live Server (Recommended)
1. Open **Visual Studio Code**.
2. Go to **File** > **Open Folder...** and select this project folder:
   ```text
   C:\Users\dell\Documents\Antigravity
   ```
3. In VS Code, open the Extensions tab (`Ctrl + Shift + X`) and search for **Live Server** (by *Ritwick Dey*).
4. Click **Install**.
5. In the file explorer sidebar, right-click on `index.html` and select **"Open with Live Server"** (or click the **"Go Live"** button on the bottom status bar).
6. Your default browser will automatically open with `http://127.0.0.1:5500/index.html`.

### Method 2: Direct Browser Launch
1. Open your file explorer and navigate to:
   ```text
   C:\Users\dell\Documents\Antigravity
   ```
2. Double-click **`index.html`** to open it in Chrome, Edge, Firefox, or Brave.

---

## ✨ Features Included

- **Campus Dashboard & Quick Stats**:
  - Live counters for *Active Lost Reports*, *Items Awaiting Claim*, and *Successfully Reunited*.
- **Search & Multi-Filter Engine**:
  - Instant real-time keyword search across title, location, category, and notes.
  - Quick status tabs: *All Items*, *Lost*, *Found*, *Reunited*.
  - Category dropdown filter (*Electronics*, *Student IDs*, *Keys*, *Books*, etc.).
  - Campus location dropdown filter (*Central Library*, *Student Union*, *Science Complex*, etc.).
  - Sort by Newest or Oldest.
- **Reporting System (Lost & Found)**:
  - Tabbed modal for reporting lost or found items.
  - Image upload with live preview (supports local images up to 5MB encoded as Base64 in LocalStorage).
  - Pre-selected category fallbacks if no image is uploaded.
  - Contact information inputs with automatic `mailto:` email generation.
- **Item Details & Claim Modal**:
  - Full item view with photo, exact campus room/spot notes, and optional reward banner.
  - "Mark as Reunited / Claimed" status toggle.
  - Direct student email contact button.
  - Delete listing option.
- **Data Persistence**:
  - All data is preserved across page refreshes using browser `localStorage`.
  - Includes a **"Reset Demo Data"** button to restore sample campus items at any time.

---

## 📁 Multi-Page Structure

```text
Antigravity/
├── index.html           # 1. Campus Dashboard (KPI cards, recovery rates, portals, recent reports, bulletin)
├── browse.html          # 2. Browse Items (Campus listings directory, real-time search & multi-filters)
├── how-it-works.html    # 3. How It Works (3-step workflow, drop-off desks, campus FAQ)
├── safety.html          # 4. Safety & Guidelines (Safe zones, verification rules, security directory)
├── styles.css           # Modern shared stylesheet for all pages & responsive layouts
├── app.js               # Shared logic: search/filter, dashboard recent items, localStorage CRUD
└── README.md            # Documentation & VS Code guide
```

---

## 🧭 Multi-Page Navigation

Each page operates as an independent HTML page linked via the header and footer navigation:
- Clicking **"Dashboard"** opens `index.html`.
- Clicking **"Browse Items"** opens `browse.html` (the full Campus Listings directory).
- Clicking **"How It Works"** opens `how-it-works.html`.
- Clicking **"Safety & Guidelines"** opens `safety.html`.
- Clicking **"+ Report Item"** from any page opens the reporting modal directly.

---

## 🎨 Customizing the Portal

- **Campus Name & Logo**:
  In each HTML file, look for `.brand-name` to change `UniFind` to your university's name (e.g. `HarvardFind`, `CampusLostAndFound`).
- **Campus Locations**:
  In `browse.html` and `index.html`, edit the `<select id="locationFilter">` and `<select id="itemLocation">` options to add your specific campus buildings, halls, and dining centers.
- **Initial Demo Items**:
  In `app.js`, edit the `DEFAULT_ITEMS` array at the top of the file to customize the starting sample items.
