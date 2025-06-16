import { useEffect, useState } from "react";
import axios from "axios";
import ClusterChart from "../components/ClusterChart"
import PopularityChart from "../components/PopularityChart"
import RFMClusterChart from "../components/RFMClusterChart"
import RFM3DChart from "../components/RFM3DChart"

export default function AdminCustomerClusters() {
  const [clusters, setClusters] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const handleRefreshClusters = async () => {
    try {
      await fetch(`${API}/analytics/customers/clusters`, { method: "POST" });
      await fetch(`${API}/analytics/customers/clusters/categories`, { method: "POST" });
      await fetch(`${API}/analytics/customers/clusters/models`, { method: "POST" });
      await fetch(`${API}/analytics/customers/clusters/rfm`, { method: "POST" });
      alert("Кластеры обновлены!");
      window.location.reload();
    } catch (err) {
      console.error("Ошибка обновления кластеров:", err);
      alert("Ошибка при обновлении кластеров");
    }
}


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/analytics/customers/clusters`)
      .then(res => setClusters(res.data))
      .catch(err => console.error("Ошибка загрузки кластеров:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Кластеры клиентов</h1>
        
        <button
          onClick={handleRefreshClusters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 my-4"
        >
          Обновить кластеры
        </button>
        <ClusterChart type="customers" />
        <ClusterChart type="categories" />
        <ClusterChart type="models" />
        <PopularityChart type="categories" />
        <PopularityChart type="models" />
        <RFMClusterChart />
        <RFM3DChart />
    </div>
  );
}
