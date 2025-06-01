import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import {
  fetchCategoryPopularity,
  fetchModelPopularity
} from "../services/analyticsService"

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

export default function PopularityChart({ type = "categories" }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetch = {
      categories: fetchCategoryPopularity,
      models: fetchModelPopularity
    }[type]

    fetch().then(res => {
      const labels = res.map(item => type === "categories" ? item.category : item.model)
      const counts = res.map(item => item.count)

      setData({
        labels,
        datasets: [
          {
            label: `Популярность (${type})`,
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.6)"
          }
        ]
      })
    }).catch(console.error)
  }, [type])

  if (!data) return <div>Загрузка...</div>

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Популярность по ${type === "categories" ? "категориям" : "моделям"}`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: type === "categories" ? "Категории" : "Модели"
        }
      },
      y: {
        title: {
          display: true,
          text: "Количество покупок"
        },
        beginAtZero: true
      }
    }
  }

  return (
    <div className="my-6">
      <Bar data={data} options={options} />
    </div>
  )
}
