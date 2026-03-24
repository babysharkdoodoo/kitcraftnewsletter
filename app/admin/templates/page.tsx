"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Eye, Trash2 } from "lucide-react"
import { getTemplates, saveTemplate, deleteTemplate } from "@/app/actions/template-management"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    const data = await getTemplates()
    setTemplates(data)
  }

  function handleNew() {
    setEditingTemplate(null)
    setName("")
    setSubject("")
    setHtmlContent("")
    setShowDialog(true)
  }

  function handleEdit(template: any) {
    setEditingTemplate(template)
    setName(template.name)
    setSubject(template.subject)
    setHtmlContent(template.html_content)
    setShowDialog(true)
  }

  async function handleSave() {
    await saveTemplate({
      id: editingTemplate?.id,
      name,
      subject,
      html_content: htmlContent,
    })
    setShowDialog(false)
    loadTemplates()
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id)
      loadTemplates()
    }
  }

  function handlePreview(html: string) {
    setPreviewHtml(html)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Email Templates</h1>
            <p className="text-gray-600">Create and manage reusable templates</p>
          </div>
          <Button onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-gray-600">{template.subject}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(template.html_content)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "New Template"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Monthly Newsletter"
                />
              </div>
              <div>
                <Label htmlFor="subject">Default Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Your Monthly Update"
                />
              </div>
              <div>
                <Label htmlFor="html">HTML Content</Label>
                <Textarea
                  id="html"
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="<h1>Hello!</h1><p>Your content here...</p>"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Template</Button>
                <Button
                  variant="outline"
                  onClick={() => handlePreview(htmlContent)}
                >
                  Preview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
            </DialogHeader>
            <div
              className="border rounded p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
