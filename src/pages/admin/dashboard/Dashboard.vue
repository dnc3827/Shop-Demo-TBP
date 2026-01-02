<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="fas fa-chart-line text-primary"></i> Dashboard thống kê
    </h2>

    <!-- ===== PHẦN 1: CHỈ SỐ ===== -->
    <div class="row text-white mb-4">
      <div class="col-md-4 col-sm-12 mb-3">
        <div class="card bg-primary shadow-sm text-center p-3 stat-card">
          <h5>Tổng doanh thu</h5>
          <h3>{{ formatCurrency(dashboard.TotalRevenue) }}</h3>
        </div>
      </div>

      <div class="col-md-4 col-sm-12 mb-3">
        <div class="card bg-success shadow-sm text-center p-3 stat-card">
          <h5>Tổng đơn hàng</h5>
          <h3>{{ dashboard.TotalOrders.toLocaleString('vi-VN') }}</h3>
        </div>
      </div>

      <div class="col-md-4 col-sm-12 mb-3">
        <div class="card bg-warning shadow-sm text-center p-3 stat-card">
          <h5>Số món bán ra</h5>
          <h3>{{ dashboard.TotalItemsSold.toLocaleString('vi-VN') }}</h3>
        </div>
      </div>
    </div>

    <!-- ===== PHẦN 2: BIỂU ĐỒ ===== -->
    <div class="card shadow-sm p-4 chart-container">
      <h5 class="mb-3 text-center">Biểu đồ doanh thu theo tháng</h5>
      <canvas id="revenueChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/services/axios'  

/* ================= STATE ================= */
const dashboard = ref({
  TotalRevenue: 0,
  TotalOrders: 0,
  TotalItemsSold: 0,
  MonthlyRevenue: []
})

/* ================= API ================= */
const fetchDashboard = async () => {
  try {
    const res = await axios.get('/api/admin/dashboard')

    dashboard.value = {
      TotalRevenue: res.data.totalRevenue,
      TotalOrders: res.data.totalOrders,
      TotalItemsSold: res.data.totalItemsSold,
      MonthlyRevenue: res.data.monthlyRevenue.map(m => ({
        Month: m.month,
        Revenue: m.revenue
      }))
    }

    initChart()
  } catch (error) {
    console.error('Lỗi load dashboard:', error)
  }
}

/* ================= FORMAT ================= */
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0 ₫'
  return value.toLocaleString('vi-VN') + ' ₫'
}

/* ================= CHART ================= */
const chartLabels = computed(() =>
  dashboard.value.MonthlyRevenue.map(m => `Tháng ${m.Month}`)
)

const chartValues = computed(() =>
  dashboard.value.MonthlyRevenue.map(m => m.Revenue)
)

let revenueChart = null

const initChart = () => {
  const ctx = document.getElementById('revenueChart')
  if (!ctx) return

  if (revenueChart) {
    revenueChart.destroy()
  }

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels.value,
      datasets: [
        {
          label: 'Doanh thu (₫)',
          data: chartValues.value,
          backgroundColor: 'rgba(54, 162, 235, 0.3)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value =>
              value >= 1_000_000
                ? (value / 1_000_000).toLocaleString('vi-VN') + ' Tr ₫'
                : value.toLocaleString('vi-VN') + ' ₫'
          }
        }
      }
    }
  })
}

/* ================= MOUNT ================= */
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
  script.onload = fetchDashboard
  document.head.appendChild(script)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.container {
  padding: 20px;
}

h2 {
  color: #333;
  font-weight: 600;
}

.text-primary { color: #007bff !important; }
.bg-primary { background-color: #007bff !important; }
.bg-success { background-color: #28a745 !important; }
.bg-warning { background-color: #ffc107 !important; }

.stat-card {
  height: 100%;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
}

.stat-card h5 {
  font-size: 1rem;
  opacity: 0.85;
  margin-bottom: 0.5rem;
}

.stat-card h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.card {
  border-radius: 12px;
  border: none;
}

.chart-container {
  height: 400px;
  position: relative;
}

@media (max-width: 768px) {
  .chart-container {
    height: 320px;
  }
}
</style>
