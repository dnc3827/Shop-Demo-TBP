<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="admin-wrapper">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="brand">Fashion store</div>

      <nav>
        <RouterLink
          to="/admin"
          exact-active-class="active"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/admin/products"
          exact-active-class="active"
        >
          Products
        </RouterLink>

        <RouterLink
          to="/admin/categories"
          exact-active-class="active"
        >
          Categories
        </RouterLink>

        <RouterLink
          to="/admin/orders"
          exact-active-class="active"
        >
          Orders
        </RouterLink>
                <RouterLink
          to="/admin/blog"
          exact-active-class="active"
        >
          Blogs
        </RouterLink>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">

      <!-- HEADER -->
    <header class="topbar">
      <input class="search" placeholder="Search..." />

      <div class="topbar-actions">
        <RouterLink to="/" class="btn-home">
        ⬅ Trang chủ
      </RouterLink>

    <div class="icons">
      🔔 ✉️ 👤
    </div>
  </div>
</header>

      <!-- CONTENT -->
      <main class="content">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
/* ===== COLOR VARIABLES (GREEN DARK THEME) ===== */
:root {
  --green-dark: #0f2d26;
  --green-dark-2: #133a31;
  --green-accent: #b9ff3f;
  --green-accent-2: #9be22d;
  --white: #ffffff;
  --gray-light: #e5e7eb;
}

/* ===== LAYOUT ===== */
.admin-wrapper {
  display: flex;
  height: 100vh;
  background: var(--green-dark);
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  background: linear-gradient(
    180deg,
    var(--green-dark),
    var(--green-dark-2)
  );
  color: var(--white);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.25);
}

.brand {
  font-size: 22px;
  padding: 20px;
  font-weight: bold;
  color: var(--green-accent);
  letter-spacing: 1px;
}

/* ===== MENU LINKS ===== */
.sidebar a {
  display: block;
  padding: 14px 20px;
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.25s ease;
}

/* HOVER */
.sidebar a:hover {
  background: rgba(185, 255, 63, 0.15);
  color: var(--green-accent);
}

/* ACTIVE */
.sidebar a.active {
  background: rgba(185, 255, 63, 0.25);
  color: var(--green-accent);
  border-left: 4px solid var(--green-accent);
}

/* ===== MAIN ===== */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* ===== HEADER ===== */
.topbar {
  background: var(--green-dark);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search {
  width: 280px;
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: var(--green-dark-2);
  color: var(--white);
}

.search::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.icons {
  font-size: 18px;
  color: var(--green-accent);
}

/* ===== CONTENT ===== */
.content {
  padding: 25px;
  background: #f1f5f9;
  min-height: calc(100vh - 60px);
}

</style>
