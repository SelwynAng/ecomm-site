import { Controller } from "@hotwired/stimulus";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default class extends Controller {
  static values = { 
    week: Array,
    month: Array
  }

  connect() {
    // Initialize with weekly data by default
    this.initializeChart(this.weekValue);
  }

  handleToggle(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "month") {
      this.updateChart(this.monthValue);
    } else if (selectedValue === "week") {
      this.updateChart(this.weekValue);
    }
  }

  initializeChart(data) {
    const chartData = data.map((item) => item[1] / 100.0);
    const labels = data.map((item) => item[0]);

    const ctx = document.getElementById('revenueChart').getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue $',
          data: chartData,
          borderWidth: 3,
          backgroundColor: "#aeedab",
          borderColor: "#000000",
          fill: true
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            border: {
              dash: [5, 5]
            },
            grid: {
              color: "#aeedab"
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart(data) {
    const chartData = data.map((item) => item[1] / 100.0);
    const labels = data.map((item) => item[0]);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = chartData;
    this.chart.update();
  }
}
