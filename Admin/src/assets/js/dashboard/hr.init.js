/*
Template Name: Urbix - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: HR init js
*/

function getColors(cssVars) {
  const colorValues = cssVars.map((variable) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  );
  return colorValues;
}

function getRgbaColors(cssVars) {
  return cssVars.map((item) => {
    // Split by comma, trim spaces
    const isArray = item.split(',');
    if (isArray.length > 1) {
      const [varName, alpha] = item.split(',').map(s => s.trim());
      // Get the RGB value from the CSS variable
      const rgb = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      // If rgb is empty, fallback to a default
      if (!rgb) return `rgba(0,0,0,${alpha || 1})`;
      // Compose the rgba string
      return `rgba(${rgb},${alpha || 1})`;
    } else {
      return getComputedStyle(document.documentElement).getPropertyValue(item).trim();
    }
  });
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

var performanceChart = null;
var averagTeam = null;
var splineareaChart = null;
var gaugeChart = null;
var jobLevelChart = null;

// averag-team
function generateData(count, yrange) {

  //performance
  var options = {
    series: [
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    chart: {
      height: 340,
      type: "radar",
      toolbar: {
        show: false,
      },
      offsetX: -20,
      offsetY: -20,
    },
    plotOptions: {
      radar: {
        size: 140,
        offsetX: 0,
        offsetY: 0,
        polygons: {
          fill: {
            colors: ["transparent"],
          },
        },
      },
    },
    colors: getColors(["--pe-warning"]),
    yaxis: {
      stepSize: 50,
      tickAmount: 2,
    },
    xaxis: {
      categories: [
        "Overall Performance",
        "Campaigns",
        "Workload",
        "Salary",
        "Satisfaction",
        "Invention",
      ],
    },
  };
  performanceChart ? performanceChart.destroy() : null;
  performanceChart = new ApexCharts(document.querySelector("#performance-chart"), options);
  performanceChart.render();

  // Generate random data for the heatmap
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var i = 0;
  var series = [];
  while (i < count) {
    var x = months[i];
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y,
    });
    i++;
  }
  return series;
}

function renderCharts() {
  var options = {
    series: [
      {
        name: "0%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
      {
        name: "20%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
      {
        name: "40%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
      {
        name: "60%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
      {
        name: "80%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
      {
        name: "100%",
        data: generateData(12, {
          min: 0,
          max: 90,
        }),
      },
    ],
    chart: {
      height: 350,
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: getColors(["--pe-primary"]),
  };

  averagTeam ? averagTeam.destroy() : null;
  averagTeam = new ApexCharts(document.querySelector("#averag-team"), options);
  averagTeam.render();

  // Employer Satisfaction
  var spline_area_chart = {
    series: [
      {
        name: "series1",
        data: [31, 50, 28, 81, 42, 109, 100],
      },
      {
        name: "series2",
        data: [90, 32, 55, 32, 102, 52, 23],
      },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: getRgbaColors(["--pe-primary-rgb, 1", "--pe-primary-rgb, 0.2"]),
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };
  splineareaChart ? splineareaChart.destroy() : null;
  splineareaChart = new ApexCharts(
    document.querySelector("#spline_area_chart"),
    spline_area_chart
  );
  splineareaChart.render();

  // gaugeChart
  var options = {
    series: [55, 25, 20],
    chart: {
      type: "donut",
      width: 197,
      height: 300,
    },
    colors: getColors(["--pe-primary", "--pe-warning", "--pe-danger"]),
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels inside slices
    },
    legend: {
      show: false, // Disable legend labels
    },
    grid: {
      padding: {
        bottom: -100,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false, // Make sure legend is hidden in responsive too
          },
        },
      },
    ],
  };

  gaugeChart ? gaugeChart.destroy() : null;
  gaugeChart = new ApexCharts(document.querySelector("#gaugeChart"), options);
  gaugeChart.render();

  // Employee Status
  var categories = [],gaugeChart
    data = [],
    chartColors = [];

  var employmentTypes = ["Permanent", "Contract", "Probation"];
  var bars = [55, 30, 20];
  var colors = getRgbaColors(["--pe-primary-rgb, 1", "--pe-primary-rgb, 0.5", "--pe-primary-rgb, 0.1"]);
  var height = 100;

  bars.forEach((barCount, i) => {
    for (let j = 0; j < barCount; j++) {
      categories.push(employmentTypes[i]);
      data.push(height);
      chartColors.push(colors[i]);
    }
  });

  var options = {
    series: [{ name: 'Job Level', data: data }],
    chart: { type: 'bar', height: 70, toolbar: { show: false }, background: 'transparent', sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '4px', borderRadius: 2, distributed: true } },
    colors: chartColors,
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: { categories: categories, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false, min: 0 },
    grid: { show: false, padding: { top: 0, bottom: 0, left: 0, right: 0 } },
    tooltip: { enabled: true, y: { formatter: function (val) { return val; } } }
  };

  jobLevelChart ? jobLevelChart.destroy() : null;
  jobLevelChart = new ApexCharts(document.querySelector("#jobLevelChart"), options);
  jobLevelChart.render();

}
window.addEventListener("DOMContentLoaded", renderCharts);


// Swiper for performance section
var swiper = new Swiper(".performance", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 1.6,
      spaceBetween: 40,
    },
  },
});
