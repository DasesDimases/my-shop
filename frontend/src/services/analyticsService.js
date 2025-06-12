import axios from "axios"

const API = "${import.meta.env.VITE_API_URL}/analytics"

export const fetchCustomerClusters = () => axios.get(`${API}/customers/clusters`).then(res => res.data)
export const fetchCategoryClusters = () => axios.get(`${API}/customers/clusters/categories`).then(res => res.data)
export const fetchModelClusters = () => axios.get(`${API}/customers/clusters/models`).then(res => res.data)
export const fetchCategoryPopularity = () => axios.get(`${API}/categories/popularity`).then(res => res.data)
export const fetchModelPopularity = () => axios.get(`${API}/models/popularity`).then(res => res.data)

export async function fetchRFMClusters() {
  const res = await fetch("${import.meta.env.VITE_API_URL}/analytics/customers/clusters/rfm")
  if (!res.ok) throw new Error("Ошибка при загрузке RFM-кластеров")
  return await res.json()
}

export async function fetchRFMSummary() {
  const res = await fetch("/analytics/customers/clusters/rfm/summary");
  if (!res.ok) throw new Error("Ошибка при получении сводки RFM-кластеров");
  return res.json();
}
