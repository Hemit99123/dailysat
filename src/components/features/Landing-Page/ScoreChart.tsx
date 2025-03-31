import { useRef } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ScoreBarGraph() {
  const chartRef = useRef(null)

  // Type the data properly
  const data: ChartData<'bar'> = {
    labels: ['Before', 'After'],
    datasets: [
      {
        label: 'Bar 1',
        data: [120, 100], // Example data
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue color
        borderRadius: 5,
      },
      {
        label: 'Bar 2',
        data: [100, 80], // Example data
        backgroundColor: 'rgba(139, 92, 246, 0.8)', // Purple color
        borderRadius: 5,
      },
      {
        label: 'Bar 3',
        data: [80, 60], // Example data
        backgroundColor: 'rgba(39, 99, 255, 0.8)', // Lighter blue color
        borderRadius: 5,
      },
      {
        label: 'Bar 4',
        data: [140, 120], // Example data
        backgroundColor: 'rgba(139, 60, 246, 0.8)', // Darker purple color
        borderRadius: 5,
      },
    ],
  }

  // Type the options properly
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'top',
      },
    },
    animation: {
      duration: 2000, // Animation duration
      easing: 'easeInOutQuad',
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        max: 150,
        ticks: {
          stepSize: 20,
        },
      },
    },
  }

  return (
    <div className="relative h-full w-full  rounded-lg shadow-lg overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-lg font-semibold text-white p-2">
        <span className="transform scale-105">Before</span>
        <span className="transform scale-105">After</span>
      </div>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}
