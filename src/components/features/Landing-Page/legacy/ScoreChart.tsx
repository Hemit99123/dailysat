import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { ChartData, ChartOptions } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ScoreBarGraph() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  })

  const [options, setOptions] = useState<ChartOptions<"bar">>({})

  useEffect(() => {
    setChartData({
      labels: ["Initial Score", "After 1 Month", "After 2 Months", "Final Score"],
      datasets: [
        {
          label: "Average SAT Score",
          data: [1050, 1150, 1250, 1350],
          backgroundColor: [
            "rgba(59, 130, 246, 0.5)",
            "rgba(99, 102, 241, 0.5)",
            "rgba(139, 92, 246, 0.5)",
            "rgba(79, 70, 229, 0.5)",
          ],
          borderColor: ["rgb(59, 130, 246)", "rgb(99, 102, 241)", "rgb(139, 92, 246)", "rgb(79, 70, 229)"],
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    })

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              family: "Inter, sans-serif",
            },
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#000",
          bodyColor: "#000",
          bodyFont: {
            family: "Inter, sans-serif",
          },
          titleFont: {
            family: "Inter, sans-serif",
            weight: "bold",
          },
          padding: 12,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => `Score: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          min: 800,
          max: 1600,
          ticks: {
            font: {
              family: "Inter, sans-serif",
            },
          },
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          ticks: {
            font: {
              family: "Inter, sans-serif",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    })
  }, [])

  return <Bar data={chartData} options={options} />
}
