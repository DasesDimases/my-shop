import { useEffect, useState } from "react"
import { Scatter } from "react-chartjs-2"
import {
  fetchCustomerClusters,
  fetchCategoryClusters,
  fetchModelClusters
} from "../services/analyticsService"
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, Title)

const clusterColors = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(153, 102, 255, 0.8)"
]

export default function ClusterChart({ type = "customers" }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetch = {
      customers: fetchCustomerClusters,
      categories: fetchCategoryClusters,
      models: fetchModelClusters
    }[type]

    fetch().then(res => {
      if (!res || !Array.isArray(res)) return

      const grouped = {}

      res.forEach(c => {
        const cluster = c.cluster ?? 0

        let x = 0, y = 0
        if (type === "customers") {
          x = c.total ?? 0
          y = c.ordersCount ?? 0
        } else {
          x = 1 
          y = 1
        }

        const label = c.name || c.email
        const extras =
          type === "categories" ? (c.top_categories || []) :
          type === "models" ? (c.top_models || []) : []

        if (!grouped[cluster]) grouped[cluster] = []
        grouped[cluster].push({ x, y, label, extras })
      })

      const datasets = Object.entries(grouped).map(([cluster, points], idx) => ({
        label: `Кластер ${cluster}`,
        data: points,
        backgroundColor: clusterColors[idx % clusterColors.length],
        pointRadius: 6,
        pointHoverRadius: 8
      }))

      setData({ datasets })
    }).catch(console.error)
  }, [type])

  if (!data) return <div>Загрузка...</div>

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const { x, y, label, extras } = ctx.raw
            let tip = `${label}: x=${x}, y=${y}`
            if (extras && extras.length > 0) {
              tip += `\nТоп: ${extras.join(", ")}`
            }
            return tip
          }
        }
      },
      title: {
        display: true,
        text: `Визуализация кластеров (${type})`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: type === "customers" ? "Сумма покупок" : "X (категории/модели)"
        }
      },
      y: {
        title: {
          display: true,
          text: type === "customers" ? "Кол-во заказов" : "Y (категории/модели)"
        }
      }
    }
  }

  return (
    <div className="my-6">
      <Scatter data={data} options={options} />
    </div>
  )
}

