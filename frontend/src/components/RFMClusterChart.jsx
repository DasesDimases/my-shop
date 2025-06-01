// src/components/RFMClusterChart.jsx
import { useEffect, useState } from "react"
import { Scatter } from "react-chartjs-2"
import {
  fetchRFMClusters,
  fetchRFMSummary
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
  "rgba(75, 192, 192, 0.8)"
]

export default function RFMClusterChart() {
  const [data, setData] = useState(null)
  const [summary, setSummary] = useState([])

  useEffect(() => {
    fetchRFMClusters().then(res => {
      if (!res || !Array.isArray(res)) return

      const grouped = {}

      res.forEach(c => {
        const cluster = c.cluster ?? 0
        const x = c.recency ?? 0
        const y = c.monetary ?? 0
        const label = c.name || c.email

        if (!grouped[cluster]) grouped[cluster] = []
        grouped[cluster].push({ x, y, label })
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

    fetchRFMSummary()
      .then(res => setSummary(res))
      .catch(console.error)
  }, [])

  if (!data) return <div>Загрузка...</div>

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: ctx => {
            const { x, y, label } = ctx.raw
            return `${label}: Recency=${x}, Monetary=${y}`
          }
        }
      },
      title: {
        display: true,
        text: "RFM-кластеры клиентов"
      }
    },
    scales: {
      x: {
        title: { display: true, text: "Recency (дни с последнего заказа)" }
      },
      y: {
        title: { display: true, text: "Monetary (общая сумма покупок)" }
      }
    }
  }

  return (
    <div className="my-6">
      <Scatter data={data} options={options} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Сводка по кластерам</h3>
        <table className="min-w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Кластер</th>
              <th className="border px-3 py-2 text-left">Описание</th>
              <th className="border px-3 py-2 text-right">Средний Recency</th>
              <th className="border px-3 py-2 text-right">Средний Frequency</th>
              <th className="border px-3 py-2 text-right">Средний Monetary</th>
              <th className="border px-3 py-2 text-right">Клиентов</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(row => (
              <tr key={row.cluster}>
                <td className="border px-3 py-1">{row.cluster}</td>
                <td className="border px-3 py-1">{row.label}</td>
                <td className="border px-3 py-1 text-right">{row.avg_recency}</td>
                <td className="border px-3 py-1 text-right">{row.avg_frequency}</td>
                <td className="border px-3 py-1 text-right">{row.avg_monetary}</td>
                <td className="border px-3 py-1 text-right">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
