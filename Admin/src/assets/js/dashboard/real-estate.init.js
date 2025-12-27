/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: Real Estate init js
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

var salesAnalytics = null;
var socialSource = null;
var gradientDonutChart = null;
var gradientDonutChart2 = null;

function renderCharts() {
  // sales-analytics
  var options = {
    series: [
      {
        name: "Rentals",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: "Sells",
        type: "area",
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: "Visitors",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    colors: getRgbaColors(["--pe-primary", "--pe-secondary-rgb, 0.5", "--pe-danger-rgb, 0.9"]),
    chart: {
      height: 365,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      "01/01/2003", "02/01/2003", "03/01/2003", "04/01/2003", "05/01/2003", "06/01/2003", "07/01/2003", "08/01/2003", "09/01/2003", "10/01/2003", "11/01/2003",
    ],
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
  };

  salesAnalytics ? salesAnalytics.destroy() : null;
  var salesAnalytics = new ApexCharts(document.querySelector("#sales-analytics"), options);
  salesAnalytics.render();

  // social-source
  var options = {
    series: [70],
    chart: {
      height: 250,
      type: "radialBar",
    },
    colors: getRgbaColors(["--pe-secondary-rgb, 0.9"]),
    plotOptions: {
      radialBar: {
        startAngle: -125,
        endAngle: 235,
        hollow: {
          size: "60%",
        },
        track: {
          // background: "#e6f0ff", // light bluish track color
          background: getRgbaColors(["--pe-warning-rgb, 0.9"]),
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            offsetY: -10,
            fontSize: "14px",
          },
          value: {
            fontSize: "24px",
            fontWeight: "bold",
            show: true,
            offsetY: 10,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal", // makes the gradient flow along the arc
        shadeIntensity: 0.5,
        gradientToColors: getRgbaColors(["--pe-primary-rgb, 0.9"]), // light sky blue
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round", // ensures rounded ends

    },
    labels: ["Total Buyer"],
  };

  socialSource ? socialSource.destroy() : null;
  var socialSource = new ApexCharts(document.querySelector("#social-source"), options);
  socialSource.render();

  // vectormap
  var worldemapmarkers = new jsVectorMap({
    selector: "#world-map", // Use the correct selector
    map: "world",
    zoomOnScroll: false,
    selectedMarkers: [0, 2], // Select specific markers (index-based)
    regionStyle: {
      initial: {
        stroke: "#9599ad",
        strokeWidth: 0.25,
        fillOpacity: 1,
      },
    },
    markersSelectable: true,
    markers: [
      { coords: [65.524, 70.3188] },
      { coords: [10.524, 78.3188] },
      { coords: [50.1304, -80.3468] },
      { coords: [-40.524, 140.3188] },
    ],
    markerStyle: {
      initial: {
        fill: "#7699BB", // Default marker color
      },
      selected: { fill: "var(--bs-primary)" },
      hover: { fill: "var(--bs-primary)" },
    },
    labels: {
      markers: {
        render: function (marker) {
          return marker.name; // Render the marker name
        },
      },
    },
  });

  // property-list
  var swiper = new Swiper(".property-list", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1025: {
        slidesPerView: 3.5,
      },
      1441: {
        slidesPerView: 4.5,
      },
    },
  });

  // gradient_donut_chart
  var options = {
    series: [25, 25, 50],
    chart: {
      width: 150,
      height: 150,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    labels: ["Rent", "Sales", "Others"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    colors: getColors(["--pe-primary", "--pe-danger", "--pe-warning"]),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };
  gradientDonutChart ? gradientDonutChart.destroy() : null;
  gradientDonutChart = new ApexCharts(document.querySelector("#gradient_donut_chart"), options);
  gradientDonutChart.render();

  // gradient_donut_chart_2
  var options = {
    series: [25, 25, 50],
    chart: {
      width: 150,
      height: 150,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '70%'
        }
      },
    },
    labels: ["Rent", "Sales", "Others"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    colors: getColors(["--pe-primary", "--pe-danger", "--pe-warning"]),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

    gradientDonutChart2 ? gradientDonutChart2.destroy() : null;
  gradientDonutChart2 = new ApexCharts(document.querySelector("#gradient_donut_chart_2"), options);
  gradientDonutChart2.render();

}

// ✅ Added better initialization
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    renderCharts();
  }, 250);
});
