<template>
  <div class="container my-4">
    <h2 class="mb-3">🧾 Quản lý đơn hàng</h2>

    <!-- TABLE -->
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Khách hàng</th>
          <th>Ngày đặt</th>
          <th>Trạng thái</th>
          <th>Tổng tiền</th>
          <th>Chi tiết</th>
          <th>Cập nhật</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="orders.length === 0">
          <td colspan="7" class="text-center text-muted">
            Không có đơn hàng
          </td>
        </tr>

        <tr v-for="order in orders" :key="order.id">
          <td><strong>#{{ order.id }}</strong></td>

          <td>
            User #{{ order.userId }}
          </td>

          <td>{{ formatDate(order.createdAt) }}</td>

          <td>
            <span class="badge" :class="statusClass(order.status)">
              {{ order.status }}
            </span>
          </td>

          <td>{{ formatCurrency(order.total) }}</td>

          <!-- DETAILS -->
          <td>
            <details>
              <summary>Xem</summary>
              <ul class="mt-2 mb-0">
                <li v-for="item in order.items" :key="item.productId">
                  {{ item.productName }} × {{ item.quantity }}
                  ({{ formatCurrency(item.price) }})
                </li>
              </ul>
            </details>
          </td>

          <!-- UPDATE STATUS -->
          <td>
            <select
              v-model="order.newStatus"
              class="form-select form-select-sm d-inline w-auto"
            >
              <option>Chờ xử lý</option>
              <option>Đang giao</option>
              <option>Hoàn tất</option>
              <option>Đã hủy</option>
            </select>

            <button
              class="btn btn-sm btn-success ms-2"
              @click="updateStatus(order)"
              :disabled="order.newStatus === order.status"
            >
              Lưu
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const orders = ref([]);

const API_URL = "https://shop-demo-be-tbp-production.up.railway.app/api/order";

// ================= LOAD ALL ORDERS (ADMIN) =================
const loadOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    orders.value = res.data.map(o => ({
      ...o,
      newStatus: o.status
    }));
  } catch (err) {
    console.error(err);
    alert("Bạn chưa đăng nhập hoặc không có quyền Admin");
  }
};

// ================= UPDATE STATUS =================
const updateStatus = async (order) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_URL}/${order.id}/status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          status: order.newStatus
        }
      }
    );

    order.status = order.newStatus;
    alert(`Đã cập nhật đơn #${order.id}`);
  } catch (err) {
    console.error(err);
    alert("Cập nhật trạng thái thất bại");
  }
};

// ================= HELPERS =================
const formatDate = (d) =>
  new Date(d).toLocaleString("vi-VN");

const formatCurrency = (n) =>
  (n ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });

const statusClass = (status) => ({
  "bg-warning text-dark": status === "Chờ xử lý",
  "bg-danger": status === "Đang giao",
  "bg-success": status === "Hoàn tất",
  "bg-secondary": status === "Đã hủy"
});

onMounted(loadOrders);
</script>

<style scoped>
.badge {
  padding: 6px 10px;
  font-size: 0.85rem;
}
summary {
  cursor: pointer;
  font-weight: 500;
}
</style>
