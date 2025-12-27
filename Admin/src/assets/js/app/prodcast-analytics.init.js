/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: prodcast-analytics init js
*/

function getColors(cssVars) {
  const colorValues = cssVars.map((variable) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  );
  return colorValues;
}

document
  .querySelectorAll('input[name="data-theme-colors"]')
  .forEach((radio) => {
    radio.addEventListener("change", function () {
      setTimeout(() => {
        renderCharts(this.value);
      }, 0);
    });
  });

var basiccolumnChart = null;

function renderCharts() {
  var basic_column_chart = {
    series: [
      {
        name: "Unique Listeners",
        data: [1700, 1340, 1650, 1480, 1200, 1710, 1810],
      },
      {
        name: "Total Streams",
        data: [3500, 2590, 3900, 2900, 2000, 3100, 3280],
      },
    ],
    chart: {
      type: "bar",
      height: 365,
      toolbar: {
        show: false,
      },
    },
    title: {
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    colors: getColors(["--pe-warning", "--pe-success"]),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5, // ✅ Border radius
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      show: false, // ✅ Grid removed
    },
    xaxis: {
      categories: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Users",
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + " users";
        },
      },
    },
  };

  basiccolumnChart ? basiccolumnChart.destroy() : null;
  basiccolumnChart = new ApexCharts(
    document.querySelector("#basic_column_chart"),
    basic_column_chart
  );
  basiccolumnChart.render();
}
window.addEventListener("DOMContentLoaded", renderCharts);

// Stacked Line Chart - Podcast Listener Analytics
var stackedlinechartDom = document.getElementById('StackedLineChart');
var stackedlineChart = echarts.init(stackedlinechartDom);
var stackedlineOption;

stackedlineOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: '10%',
    data: ['2021', '2022', '2023', '2024'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '2021',
      type: 'line',
      stack: 'Total',
      data: [200, 320, 360, 400, 500, 380, 300]
    },
    {
      name: '2022',
      type: 'line',
      stack: 'Total',
      data: [200, 300, 260, 450, 500, 200, 100]
    },
    {
      name: '2023',
      type: 'line',
      stack: 'Total',
      data: [500, 600, 300, 650, 700, 500, 300]
    },
    {
      name: '2024',
      type: 'line',
      stack: 'Total',
      data: [600, 500, 800, 850, 400, 350, 1000]
    }
  ]
};

stackedlineChart.setOption(stackedlineOption);

// Swiper Initialization for Podcast Analytics
var swiper = new Swiper(".albums", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 25,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  breakpoints: {
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1441: {
      slidesPerView: 5,
    },
  },
});


