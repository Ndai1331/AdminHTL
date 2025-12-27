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

var proteinChart = null;
var carboChart = null;
var fatChart = null;
var columnWithLabel = null;
var targetStatistics = null;
var basicBarChart = null;

function renderCharts() {
  // Protein
  var options = {
    series: [35],
    chart: {
      width: 120,
      height: 120,
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        endAngle: 360, // 🔥 Full circle clockwise
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: "700",
            offsetY: 10,
            formatter: function (val) {
              return Math.round(val) + "%";
            },
          },
        },
      },
    },
    fill: {
      colors: getColors(["--pe-primary"]),
    },
    stroke: {
      lineCap: "round",
    },
  };

  proteinChart ? proteinChart.destroy() : null;
  proteinChart = new ApexCharts(
    document.querySelector("#protein-chart"),
    options
  );
  proteinChart.render();

  // Carbo
  var options = {
    series: [65],
    chart: {
      width: 120,
      height: 120,
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: getRgbaColors(["--pe-success"]),
    plotOptions: {
      radialBar: {
        endAngle: 360, // 🔥 Full circle clockwise
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: "700",
            offsetY: 10,
            formatter: function (val) {
              return Math.round(val) + "%";
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
  };

  carboChart ? carboChart.destroy() : null;
  carboChart = new ApexCharts(
    document.querySelector("#carbo-chart"),
    options
  );
  carboChart.render();

  // Fat
  var options = {
    series: [24],
    chart: {
      width: 120,
      height: 120,
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: getRgbaColors(["--pe-danger"]),
    plotOptions: {
      radialBar: {
        endAngle: 360, // 🔥 Full circle clockwise
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: "700",
            offsetY: 10,
            formatter: function (val) {
              return Math.round(val) + "%";
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
  };

  fatChart ? fatChart.destroy() : null;
  fatChart = new ApexCharts(
    document.querySelector("#fat-chart"),
    options
  );
  fatChart.render();

  // Target Statistics
  var options = {
    series: [67],
    chart: {
      width: 160,
      height: 160,
      type: "radialBar",
      offsetY: 0,
      offsetX: 0,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        endAngle: 360,
        hollow: {
          margin: 0,
          size: "70%",
        },
        track: {
          strokeWidth: "100%",
          margin: 0,
          dropShadow: { enabled: false },
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            fontWeight: "400",
            offsetY: 20,
          },
          value: {
            show: true,
            fontSize: "20px",
            fontWeight: "600",
            offsetY: -10,
            formatter: function (val) {
              return Math.round(val * 2.7) + "kcal";
            },
          },
        },
      },
    },
    fill: {
      colors: getColors(["--pe-primary"]),
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Consumed"],
  };

  targetStatistics ? targetStatistics.destroy() : null;
  targetStatistics = new ApexCharts(
    document.querySelector("#target-statistics"),
    options
  );
  targetStatistics.render();

  // Tracking History
  var column_with_label = {
    series: [
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
      },
    ],
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    colors: getColors(["--pe-primary"]),
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        // show: false,
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };
  columnWithLabel ? columnWithLabel.destroy() : null;
  columnWithLabel = new ApexCharts(
    document.querySelector("#column_with_label"),
    column_with_label
  );
  columnWithLabel.render();

  // Daily Mode

  var basic_bar_chart = {
    series: [
      {
        data: [400, 1000, 1200, 500, 800, 600, 700, 900, 1100],
      },
    ],
    chart: {
      type: "bar",
      height: 276,
      toolbar: {
        show: false,
      },
    },
    colors: getColors(["--pe-primary"]),
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Stand", "Exercise", "Move", "Sleep", "Walk", "Run", "Bike", "Swim", "Yoga"],
    },
  };
  basicBarChart ? basicBarChart.destroy() : null;
  basicBarChart = new ApexCharts(
    document.querySelector("#basic_bar_chart"),
    basic_bar_chart
  );
  basicBarChart.render();

}
window.addEventListener("DOMContentLoaded", renderCharts);

// hear beat
// Generate realistic ECG data for 89 BPM patient
function generateECGData(bpm = 89, duration = 10) {
  const data = [];
  const samplingRate = 250; // 250 Hz sampling rate (medical standard)
  const totalSamples = duration * samplingRate;
  const beatInterval = (60 / bpm) * samplingRate; // Samples per beat

  let currentSample = 0;
  let nextBeatAt = 0;

  for (let i = 0; i < totalSamples; i++) {
    const timeInSeconds = i / samplingRate;
    let amplitude = 0;

    // Check if we're in a heartbeat cycle
    if (i >= nextBeatAt && i < nextBeatAt + beatInterval * 0.8) {
      const beatProgress = (i - nextBeatAt) / (beatInterval * 0.8);
      amplitude = generateHeartbeatWaveform(beatProgress);
    }

    // Add small baseline noise (realistic ECG has minor artifacts)
    amplitude += (Math.random() - 0.5) * 0.02;

    // Move to next beat
    if (i >= nextBeatAt + beatInterval) {
      nextBeatAt += beatInterval + (Math.random() - 0.5) * 5; // Slight BPM variation
    }

    data.push({
      x: Math.round(timeInSeconds * 1000), // Convert to milliseconds
      y: parseFloat(amplitude.toFixed(3)),
    });
  }

  return data;
}

// Generate realistic heartbeat waveform (P-QRS-T complex)
function generateHeartbeatWaveform(progress) {
  let amplitude = 0;

  // P Wave (0.05 - 0.15 of beat cycle)
  if (progress >= 0.05 && progress <= 0.15) {
    const pProgress = (progress - 0.05) / 0.1;
    amplitude = 0.1 * Math.sin(pProgress * Math.PI);
  }

  // QRS Complex (0.2 - 0.35 of beat cycle)
  else if (progress >= 0.2 && progress <= 0.35) {
    const qrsProgress = (progress - 0.2) / 0.15;

    if (qrsProgress < 0.2) {
      // Q wave (small negative deflection)
      amplitude = -0.05 * Math.sin(qrsProgress * 5 * Math.PI);
    } else if (qrsProgress < 0.6) {
      // R wave (large positive deflection)
      const rProgress = (qrsProgress - 0.2) / 0.4;
      amplitude = 0.8 * Math.sin(rProgress * Math.PI);
    } else {
      // S wave (small negative deflection)
      const sProgress = (qrsProgress - 0.6) / 0.4;
      amplitude = -0.1 * Math.sin(sProgress * Math.PI);
    }
  }

  // T Wave (0.45 - 0.7 of beat cycle)
  else if (progress >= 0.45 && progress <= 0.7) {
    const tProgress = (progress - 0.45) / 0.25;
    amplitude = 0.15 * Math.sin(tProgress * Math.PI);
  }

  return amplitude;
}

// Generate different lead variations
function generateLeadVariation(baseData, leadType) {
  return baseData.map((point) => {
    let variation = 1;
    let offset = 0;

    switch (leadType) {
      case "lead1":
        variation = 1.0;
        offset = 0;
        break;
      case "lead2":
        variation = 0.8;
        offset = 0.05;
        break;
      case "lead3":
        variation = -0.6; // Inverted for Lead III
        offset = -0.02;
        break;
      case "leadAVR":
        variation = -0.4; // Inverted and smaller for aVR
        offset = 0.01;
        break;
    }

    return {
      x: point.x,
      y: parseFloat((point.y * variation + offset).toFixed(3)),
    };
  });
}

// ApexCharts configuration
const chartOptions = {
  chart: {
    type: "line",
    height: 200,
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: {
        speed: 2000,
        enabled: true,
      },
    },
    background: "transparent",
  },
  series: [
    {
      name: "ECG",
      data: generateECGData(89, 8), // 8 seconds of data at 89 BPM
    },
  ],
  stroke: {
    curve: "straight",
    width: 1.5,
    colors: ["#6B7280"],
  },
  grid: {
    show: true,
    borderColor: "#F3F4F6",
    strokeDashArray: 1,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: true },
    },
  },
  xaxis: {
    type: "numeric",
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    min: -0.3,
    max: 1.0,
  },
  tooltip: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  markers: {
    size: 0,
  },
};

// Lead-specific chart options
const leadChartOptions = {
  chart: {
    type: "line",
    height: 120,
    toolbar: { show: false },
    animations: { enabled: false },
    background: "transparent",
  },
  stroke: {
    curve: "straight",
    width: 1,
    colors: ["#6B7280"],
  },
  grid: {
    show: true,
    borderColor: "#F3F4F6",
    strokeDashArray: 1,
  },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { show: false },
    axisBorder: { show: false },
  },
  tooltip: { enabled: false },
  legend: { show: false },
  markers: { size: 0 },
};

// Initialize charts
document.addEventListener("DOMContentLoaded", function () {
  // Main ECG Chart
  const mainChart = new ApexCharts(
    document.querySelector("#ecgChart"),
    chartOptions
  );
  mainChart.render();

  // Generate base data for leads
  const baseECGData = generateECGData(89, 6);

  // Real-time data simulation (optional)
  setInterval(() => {
    const newData = generateECGData(89 + Math.random() * 4 - 2, 2); // Slight BPM variation
    mainChart.updateSeries([
      {
        data: newData,
      },
    ]);
  }, 5000); // Update every 5 seconds
});

// chartGrid
// Activity data for each day (0 = no activity, 1-5 = activity levels)
const weeklyData = [
  { day: "Sun", activities: [0, 3, 4] },
  { day: "Mon", activities: [2, 5, 1] },
  { day: "Tue", activities: [0, 2, 1] },
  { day: "Wed", activities: [0, 4, 3] },
  { day: "Thu", activities: [0, 1, 5] },
  { day: "Fri", activities: [4, 4, 3] },
  { day: "Sat", activities: [0, 2, 1] },
];

// Color and height mapping for activity levels
const activityStyles = {
  0: { height: 0, color: "transparent" },
  1: { height: 25, color: "#18a538" },
  2: { height: 35, color: "#f87171" },
  3: { height: 45, color: "#fbbf24" },
  4: { height: 55, color: "#6c757d" },
  5: { height: 65, color: "#17a2b8" },
};

function createActivityChart() {
  const chartGrid = document.getElementById("chartGrid");

  weeklyData.forEach((dayData) => {
    // Create day column
    const dayColumn = document.createElement("div");
    dayColumn.className = "day-column";

    // Create activity bars for this day
    dayData.activities.forEach((level, index) => {
      const activityBar = document.createElement("div");
      activityBar.className = "activity-bar";

      const style = activityStyles[level];
      activityBar.style.height = style.height + "px";
      activityBar.style.backgroundColor = style.color;

      // Add click event for interactivity
      activityBar.addEventListener("click", () => {
        showActivityInfo(dayData.day, index + 1, level);
      });

      dayColumn.appendChild(activityBar);
    });

    // Create day label
    const dayLabel = document.createElement("div");
    dayLabel.className = "day-label";
    dayLabel.textContent = dayData.day;
    dayColumn.appendChild(dayLabel);

    chartGrid.appendChild(dayColumn);
  });
}

function showActivityInfo(day, timeSlot, level) {
  if (level === 0) {
    alert(`${day} - Time slot ${timeSlot}: No activity`);
  } else {
    alert(`${day} - Time slot ${timeSlot}: Activity level ${level}/5`);
  }
}

// Generate random activity data
function generateRandomData() {
  weeklyData.forEach((dayData) => {
    dayData.activities = dayData.activities.map(() => {
      return Math.floor(Math.random() * 6); // 0-5
    });
  });

  // Clear and regenerate chart
  document.getElementById("chartGrid").innerHTML = "";
  createActivityChart();
}

// Add animation on load
function animateChart() {
  const bars = document.querySelectorAll(".activity-bar");
  bars.forEach((bar, index) => {
    bar.style.opacity = "0";
    bar.style.transform = "translateY(20px)";

    setTimeout(() => {
      bar.style.transition = "all 0.5s ease";
      bar.style.opacity = "1";
      bar.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Initialize chart when page loads
document.addEventListener("DOMContentLoaded", () => {
  createActivityChart();
  setTimeout(animateChart, 100);
});

// Optional: Tab switching behavior
const tabs = document.querySelectorAll(".latency-tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

const data = [
  { value: "2.5L", height: 120, color: "#fbbf24", percent: "25%" },
  { value: "3.2L", height: 150, color: "#18a538", percent: "32%" },
  { value: "1.8L", height: 90, color: "#FF9800", percent: "18%" },
  { value: "2.1L", height: 100, color: "#f87171", percent: "21%" },
];

// Create chart
function createChart() {
  const chart = document.getElementById("water-intake");

  // Header
  chart.innerHTML = `
                <div id="bars" style="display:flex; align-items:flex-end; gap:20px; height:200px; margin-bottom:15px;"></div>
                <div id="legend" style="display:flex; justify-content:space-between; padding-top:15px; border-top:1px solid #eee; padding:14px 10px 0 10px;"></div>
            `;

  // Create bars
  const barsContainer = document.getElementById("bars");
  data.forEach((item, i) => {
    const barGroup = document.createElement("div");
    barGroup.style.cssText =
      "flex:1; display:flex; flex-direction:column; align-items:center;";

    barGroup.innerHTML = `
                    <div style="font-weight:bold; margin-bottom:8px; color:#b0b0b0;">${item.value}</div>
                    <div style="width:50px; background:${item.color}; border-radius:8px 8px 0 0; cursor:pointer; transition:all 0.3s;" 
                         onmouseover="this.style.transform='translateY(-3px)'" 
                         onmouseout="this.style.transform=''" 
                         id="bar${i}"></div>
                `;

    barsContainer.appendChild(barGroup);
  });

  // Create legend
  const legend = document.getElementById("legend");
  data.forEach((item) => {
    const legendItem = document.createElement("div");
    legendItem.style.cssText = "display:flex; align-items:center; gap:8px;";
    legendItem.innerHTML = `
                    <div style="width:12px; height:12px; border-radius:50%; background:${item.color};"></div>
                    <span style="color:#b0b0b0; font-size:14px;">${item.percent}</span>
                `;
    legend.appendChild(legendItem);
  });

  // Animate bars
  data.forEach((item, i) => {
    setTimeout(() => {
      document.getElementById(`bar${i}`).style.height = item.height + "px";
    }, i * 200);
  });
}

// Start
createChart();

// ✅ Added better initialization
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    renderCharts();
  }, 250);
});
