"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { getSubscribers, exportSubscribers } from "@/app/actions/subscriber-management"

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscribers()
  }, [])

  useEffect(() => {
    if (search) {
      const filtered = subscribers.filter(
        (sub) =>
          sub.email.toLowerCase().includes(search.toLowerCase()) ||
          sub.first_name.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredSubscribers(filtered)
    } else {
      setFilteredSubscribers(subscribers)
    }
  }, [search, subscribers])

  async function loadSubscribers() {
    setLoading(true)
    const data = await getSubscribers()
    setSubscribers(data)
    setFilteredSubscribers(data)
    setLoading(false)
  }

  async function handleExport() {
    const csv = await exportSubscribers()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Subscribers</h1>
            <p className="text-gray-600">
              {filteredSubscribers.length} of {subscribers.length} subscribers
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Preferences</th>
                      <th className="text-left py-3 px-4">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{sub.first_name}</td>
                        <td className="py-3 px-4">{sub.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs ${
                              sub.status === "active"
                                ? "bg-green-100 text-green-800"
                                : sub.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {sub.status === "active" ? "Active" : sub.status === "pending" ? "Pending" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {sub.preferences?.map((pref: string) => (
                              <span
                                key={pref}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {pref}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
