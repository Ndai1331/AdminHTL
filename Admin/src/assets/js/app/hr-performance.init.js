/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: hr performance init js
*/

// Training Progress Chart Initialization
var smoothedlinechartDom = document.getElementById("SmoothedLineChart");
var smoothedlineChart = echarts.init(smoothedlinechartDom);

var smoothedlineoption = {
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Actual Progress", "Expected Progress"],
  },
  xAxis: {
    type: "category",
    data: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%",
    },
    max: 100,
  },
  series: [
    {
      name: "Actual Progress",
      data: [10, 25, 35, 40, 55, 60],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#4caf50",
      },
      itemStyle: {
        color: "#4caf50",
      },
    },
    {
      name: "Expected Progress",
      data: [25, 35, 45, 60, 80, 95],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "#2196f3",
      },
      itemStyle: {
        color: "#2196f3",
      },
    },
  ],
  grid: {
    top: "10%",
    left: "4%",
    right: "4%",
    bottom: "8%",
  },
};

smoothedlineChart.setOption(smoothedlineoption);

// Donut Chart Initialization

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

var gradientDonutChart = null;

function renderCharts() {
  var options = {
    series: [45, 30, 15, 10],
    chart: {
      width: 340,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    labels: ["Positive", "Neutral", "Negative", "Suggestions"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    colors: getColors([
      "--pe-danger",
      "--pe-warning",
      "--pe-success",
      "--pe-primary",
    ]),
    legend: {
      position: "bottom",
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
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
            position: "bottom",
          },
        },
      },
    ],
  };

  gradientDonutChart ? gradientDonutChart.destroy() : null;
  gradientDonutChart = new ApexCharts(
    document.querySelector("#gradient_donut_chart"),
    options
  );
  gradientDonutChart.render();
}

window.addEventListener("DOMContentLoaded", renderCharts);

// Performance Chart Initialization

var dumbbell_column_chart = {
  series: [
    {
      data: [
        {
          x: "John",
          y: [60, 85], // [initial, final]
        },
        {
          x: "Aisha",
          y: [55, 80],
        },
        {
          x: "Carlos",
          y: [70, 88],
        },
        {
          x: "Mei",
          y: [65, 90],
        },
        {
          x: "David",
          y: [50, 72],
        },
        {
          x: "Fatima",
          y: [60, 87],
        },
        {
          x: "Liam",
          y: [58, 81],
        },
      ],
    },
  ],
  chart: {
    height: 320,
    type: "rangeBar",
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      isDumbbell: true,
      columnWidth: 3,
      dumbbellColors: [["#008FFB", "#00E396"]],
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ["Initial Score", "Final Score"],
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      gradientToColors: ["#00E396"],
      inverseColors: true,
      stops: [0, 100],
    },
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  xaxis: {
    tickPlacement: "on",
  },
};
var chart = new ApexCharts(
  document.querySelector("#dumbbell_column_chart"),
  dumbbell_column_chart
);
chart.render();

// Job level overview

const ctx = document.getElementById("jobLevelChart").getContext("2d");

// Data for each employment type with spacing - same height for all bars
const levels = [
  { count: 102, bars: 23, color: "#7f55b1", height: 100 }, // Full Time
  { count: 87, bars: 16, color: "#916ac2", height: 100 }, // Part Time
  { count: 90, bars: 20, color: "#ae87dd", height: 100 }, // Freelance
  { count: 77, bars: 14, color: "#cba8f5", height: 100 }, // Internship
];

// Build chart data
let labels = [],
  data = [],
  colors = [];
const employmentTypes = ["Full Time", "Part Time", "Freelance", "Internship"];

levels.forEach((level, i) => {
  // Add bars for this employment type
  for (let j = 0; j < level.bars; j++) {
    labels.push(employmentTypes[i]);
    data.push(level.height); // Use same height for all bars
    colors.push(level.color);
  }
  // Add spacer (except after last type)
  if (i < levels.length - 1) {
    labels.push("");
    data.push(null);
    colors.push("transparent");
  }
});

new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderRadius: 2,
        barThickness: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
  },
});
