"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, Trash2, Copy, Info } from "lucide-react"
import { getProductsForCurrentAccount, getUsersForCurrentAccount } from "@/lib/auth-actions"

// Comprehensive user attribute schema based on Zephr
const USER_ATTRIBUTE_SCHEMA = {
  "Personal Information": {
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Street Address",
    city: "City",
    state: "State/Province",
    country: "Country",
    "zip-code": "ZIP/Postal Code",
  },
  "Professional Information": {
    organization: "Organization",
    "job-area": "Job Area",
    "job-function": "Job Function",
    "area-of-practice": "Area of Practice",
    title: "Job Title",
    department: "Department",
    "years-experience": "Years of Experience",
    "bar-admission": "Bar Admission",
    "practice-size": "Practice Size",
  },
  "Preferences & Settings": {
    "email-notifications": "Email Notifications",
    "newsletter-subscription": "Newsletter Subscription",
    "marketing-consent": "Marketing Consent",
    "data-sharing": "Data Sharing Consent",
    timezone: "Timezone",
    language: "Preferred Language",
    "communication-preference": "Communication Preference",
  },
  "Legal Specializations": {
    "admiralty-aviation": "Admiralty/Aviation/Transportation",
    "aerospace-defense": "Aerospace and Defense",
    "antitrust-competition": "Antitrust and Competition",
    "banking-finance": "Banking and Finance",
    bankruptcy: "Bankruptcy",
    "corporate-law": "Corporate Law",
    "criminal-law": "Criminal Law",
    "employment-labor": "Employment and Labor",
    environmental: "Environmental Law",
    "family-law": "Family Law",
    healthcare: "Healthcare Law",
    immigration: "Immigration Law",
    "intellectual-property": "Intellectual Property",
    litigation: "Litigation",
    "real-estate": "Real Estate",
    "tax-law": "Tax Law",
    technology: "Technology Law",
  },
  "Account Settings": {
    "account-type": "Account Type",
    "billing-contact": "Billing Contact",
    "primary-contact": "Primary Contact",
    "admin-privileges": "Admin Privileges",
    "access-level": "Access Level",
    "multi-factor-auth": "Multi-Factor Authentication",
    "session-timeout": "Session Timeout",
  },
}

interface Template {
  id: string
  name: string
  description: string
  attributes: Record<string, boolean>
  products: Record<string, boolean>
  createdAt: string
}

// Helper to create an attributes object from a flat list of true/false values
const createAttributeMap = (enabledAttributes: Record<string, boolean>) => {
  const allAttributes: Record<string, boolean> = {}
  for (const category of Object.values(USER_ATTRIBUTE_SCHEMA)) {
    for (const key of Object.keys(category)) {
      allAttributes[key] = enabledAttributes[key] || false // Default to false if not explicitly true
    }
  }
  return allAttributes
}

// Define default templates
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "template-top-content",
    name: "Top Content",
    description: "Commonly accessed content and newsletters.",
    attributes: createAttributeMap({
      "lawcom-leverage": true,
      "the-legal-intelligencer-weekly-case-alert": true,
      "new-jersey-law-journal-weekly-case-update": true,
      "clp-weekly-roundup": true,
      "in-the-news": true,
      "supreme-court-brief": true,
      "the-national-law-journal-morning-update": true,
      "lawcom-morning-minute": true,
      "lawcom-weekend": true,
      "legal-education-ahead-of-the-curve": true,
      "regulatory-update": true,
      "lawcom-international-morning-update": true,
      "marketing-the-law-firm": true,
      "the-global-lawyer": true,
      "new-york-law-journal-case-update": true,
      "lawcom-newsroom-update": true,
      "bench-report-your-guide-to-the-latest-judicial-news": true,
      "lawcom-barometer": true,
    }),
    products: {}, // No products specified
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-no-newsletters",
    name: "No Newsletters",
    description: "Disables all newsletter subscriptions.",
    attributes: createAttributeMap({
      // Explicitly set all known newsletter/email attributes to false
      "email-notifications": false,
      "newsletter-subscription": false,
      "marketing-consent": false,
      "communication-preference": false,
      "class-actions-critical-mass": false,
      "verdictsearch-florida": false,
      "lawcom-leverage": false,
      "the-bankruptcy-strategist": false,
      "the-national-law-journal-newsroom-update": false,
      "verdictsearch-dc-metro": false,
      "lawcom-pro-strategic-insights": false,
      "verdictsearch-product-liability": false,
      "global-leaders-in-law-members-newsletter": false,
      "lawcom-pro-executive-briefing": false,
      "commercial-leasing-law-strategy": false,
      "daily-report-court-opinions": false,
      "legaltech-news-morning-update": false,
      znewstest: false,
      "the-legal-intelligencer-weekly-case-alert": false,
      "uk-newsroom-update": false,
      "verdictsearch-carolina": false,
      "verdictsearch-pennsylvania": false,
      "verdictsearch-georgia": false,
      "capital-markets-updates": false,
      "verdictsearch-new-england": false,
      "new-jersey-law-journal-weekly-case-update": false,
      "cybersecurity-technology-media-telecom-update": false,
      "the-american-lawyer-afternoon-update": false,
      "corporate-counsel-morning-update": false,
      "verdictsearch-california": false,
      "clp-weekly-roundup": false,
      "lawcom-new-jersey-newsroom-update": false,
      "in-house-inside-track": false,
      "verdictsearch-texas": false,
      "in-the-news": false,
      "supreme-court-brief": false,
      "corporate-counsel-women-influence-and-power-in-law": false,
      "the-american-lawyer-morning-update": false,
      "the-london-lawyer": false,
      "lawcom-international-newsroom-update": false,
      "cybersecurity-law-strategy": false,
      "lawcom-texas-newsroom-update": false,
      "the-american-lawyer-litigation-daily": false,
      "the-american-lawyer-newsroom-update": false,
      "verdictsearch-medical-malpractice": false,
      "the-national-law-journal-morning-update": false,
      "corporate-counsel-newsroom-update": false,
      "lawcom-new-jersey-daily-decision-alert": false,
      "lawcom-pro-mid-market-daily-update": false,
      "lawcom-afternoon-update": false,
      "uk-daily-alert": false,
      "lawcom-georgia-newsroom-update": false,
      "lawcom-pennsylvania-newsroom-update": false,
      "business-crimes-bulletin": false,
      "lawcom-california-newsroom-update": false,
      "business-of-law-law-firm-disrupted": false,
      "verdictsearch-new-jersey": false,
      "ip-skilled-in-the-art": false,
      "lawcom-morning-minute": false,
      "foreign-direct-investment-update": false,
      "lawcom-weekend": false,
      "legal-education-ahead-of-the-curve": false,
      "regulatory-update": false,
      "verdictsearch-employment-law": false,
      "verdictsearch-michigan": false,
      "verdictsearch-new-york": false,
      "lawcom-international-morning-update": false,
      "marketing-the-law-firm": false,
      "legaltech-news-afternoon-update": false,
      "lawcom-connecticut-newsroom-update": false,
      "lean-adviser-legal-weekly-briefing": false,
      "new-york-real-estate-law-bulletin": false,
      "verdictsearch-ohio": false,
      "the-national-law-journal-afternoon-update": false,
      "le-labor-of-law": false,
      "the-global-lawyer": false,
      "the-recorder-case-alert": false,
      "lawcom-delaware-business-court-insider-alert": false,
      "lawcom-pro-mid-market-newsroom-update": false,
      "entertainment-law-strategy": false,
      "new-york-law-journal-case-update": false,
      "corporate-counsel-afternoon-update": false,
      "the-intellectual-property-strategist": false,
      "lawcom-delaware-newsroom-update": false,
      "lawcom-newsroom-update": false,
      "trend-detection-update": false,
      "daily-scan": false,
      "trend-detection-weekly-scan": false,
      "legaltech-news-newsroom-update": false,
      "verdictsearch-national": false,
      "accounting-financial-planning-for-law-firms": false,
      "bench-report-your-guide-to-the-latest-judicial-news": false,
      "lawcom-barometer": false,
      "lawcom-pennsylvania-public-notices": false,
      "asia-pacific-newsroom-update": false,
      "the-asia-legal-briefing": false,
      "asia-pacific-news-alert": false,
      "lawcom-florida-newsroom-update": false,
      "lawcom-new-york-newsroom-update": false,
    }),
    products: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-regional-updates",
    name: "Regional Updates",
    description: "Newsletters focused on specific geographic regions.",
    attributes: createAttributeMap({
      "the-legal-intelligencer-weekly-case-alert": true,
      "new-jersey-law-journal-weekly-case-update": true,
      "lawcom-new-jersey-newsroom-update": true,
      "lawcom-texas-newsroom-update": true,
      "lawcom-new-jersey-daily-decision-alert": true,
      "lawcom-georgia-newsroom-update": true,
      "lawcom-pennsylvania-newsroom-update": true,
      "lawcom-california-newsroom-update": true,
      "lawcom-international-morning-update": true,
      "lawcom-connecticut-newsroom-update": true,
      "the-global-lawyer": true,
      "the-recorder-case-alert": true,
      "lawcom-delaware-business-court-insider-alert": true,
      "new-york-law-journal-case-update": true,
      "lawcom-delaware-newsroom-update": true,
      "lawcom-newsroom-update": true,
      "lawcom-florida-newsroom-update": true,
      "lawcom-new-york-newsroom-update": true,
      "supreme-court-brief": true, // This was true in the provided JSON, keeping it.
      "lawcom-barometer": true, // This was true in the provided JSON, keeping it.
    }),
    products: {},
    createdAt: new Date().toISOString(),
  },
]

export function TemplateBuilderPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: "",
    name: "",
    description: "",
    attributes: {},
    products: {},
    createdAt: "",
  })
  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    loadData()
    loadTemplates()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, usersData] = await Promise.all([getProductsForCurrentAccount(), getUsersForCurrentAccount()])
      setProducts(productsData)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const loadTemplates = () => {
    const saved = localStorage.getItem("zephr-templates")
    if (saved) {
      setTemplates(JSON.parse(saved))
    } else {
      // Initialize with default templates if none are saved
      saveTemplates(DEFAULT_TEMPLATES)
    }
  }

  const saveTemplates = (newTemplates: Template[]) => {
    localStorage.setItem("zephr-templates", JSON.stringify(newTemplates))
    setTemplates(newTemplates)
  }

  const handleSaveTemplate = () => {
    if (!currentTemplate.name.trim()) {
      alert("Please enter a template name")
      return
    }

    const template: Template = {
      ...currentTemplate,
      id: currentTemplate.id || `template-${Date.now()}`,
      createdAt: currentTemplate.createdAt || new Date().toISOString(),
    }

    const updatedTemplates = isEditing
      ? templates.map((t) => (t.id === template.id ? template : t))
      : [...templates, template]

    saveTemplates(updatedTemplates)
    resetForm()
  }

  const resetForm = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      description: "",
      attributes: {},
      products: {},
      createdAt: "",
    })
    setIsEditing(false)
    setSelectedUsers([])
  }

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template)
    setIsEditing(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter((t) => t.id !== templateId)
      saveTemplates(updatedTemplates)
    }
  }

  const handleDuplicateTemplate = (template: Template) => {
    setCurrentTemplate({
      ...template,
      id: "",
      name: `${template.name} (Copy)`,
      createdAt: "",
    })
    setIsEditing(false)
  }

  const handleAttributeChange = (attributeKey: string, checked: boolean) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeKey]: checked,
      },
    }))
  }

  const handleProductChange = (productId: string, checked: boolean) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: checked,
      },
    }))
  }

  const getSelectedAttributesCount = () => {
    return Object.values(currentTemplate.attributes).filter(Boolean).length
  }

  const getSelectedProductsCount = () => {
    return Object.values(currentTemplate.products).filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Template Builder
          </CardTitle>
          <p className="text-gray-400">
            Create templates with user attributes and product assignments for bulk user management
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-white/10 rounded-none p-0">
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
              >
                {isEditing ? "Edit Template" : "Create Template"}
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
              >
                Manage Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateName" className="text-white">
                    Template Name
                  </Label>
                  <Input
                    id="templateName"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="templateDescription" className="text-white">
                    Description
                  </Label>
                  <Input
                    id="templateDescription"
                    value={currentTemplate.description}
                    onChange={(e) => setCurrentTemplate((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter template description..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-400">
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                  {getSelectedAttributesCount()} attributes selected
                </Badge>
                <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                  {getSelectedProductsCount()} products selected
                </Badge>
              </div>

              <Tabs defaultValue="attributes" className="w-full">
                <TabsList className="bg-white/5">
                  <TabsTrigger value="attributes" className="data-[state=active]:bg-purple-600">
                    User Attributes
                  </TabsTrigger>
                  <TabsTrigger value="products" className="data-[state=active]:bg-purple-600">
                    Products
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="attributes" className="mt-4">
                  <div className="space-y-6">
                    {Object.entries(USER_ATTRIBUTE_SCHEMA).map(([category, attributes]) => (
                      <Card key={category} className="bg-white/5 border-white/10">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-white">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(attributes).map(([key, label]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={key}
                                  checked={currentTemplate.attributes[key] || false}
                                  onCheckedChange={(checked) => handleAttributeChange(key, checked as boolean)}
                                  className="border-white/20 data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor={key} className="text-sm text-gray-300 cursor-pointer">
                                  {label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Product Assignments</CardTitle>
                      <p className="text-sm text-gray-400">
                        Select which products should be assigned to users when this template is applied
                      </p>
                    </CardHeader>
                    <CardContent>
                      {products.length === 0 ? (
                        <Alert className="border-yellow-500/50 bg-yellow-500/10">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-yellow-400">
                            No products available. Products will appear here once they are configured for the account.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                              <div className="flex-1">
                                <Label className="text-white font-medium">{product.label}</Label>
                                <p className="text-sm text-gray-400">{product.description || "No description"}</p>
                                <p className="text-xs text-purple-400">ID: {product.id}</p>
                              </div>
                              <Checkbox
                                checked={currentTemplate.products[product.id] || false}
                                onCheckedChange={(checked) => handleProductChange(product.id, checked as boolean)}
                                className="border-white/20 data-[state=checked]:bg-purple-600"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3">
                <Button onClick={handleSaveTemplate} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Template" : "Save Template"}
                </Button>
                {isEditing && (
                  <Button onClick={resetForm} variant="outline" className="border-white/20 text-white">
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <div className="space-y-4">
                {templates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No templates created yet</p>
                    <p className="text-sm text-gray-500">Create your first template to get started</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <Card key={template.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white">{template.name}</h3>
                            <p className="text-sm text-gray-400">{template.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                                {Object.values(template.attributes).filter(Boolean).length} attributes
                              </Badge>
                              <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                                {Object.values(template.products).filter(Boolean).length} products
                              </Badge>
                              <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-xs">
                                {new Date(template.createdAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTemplate(template)}
                              className="text-gray-400 hover:text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateTemplate(template)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
