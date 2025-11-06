"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, ChevronDown, ChevronRight, Mail, Target, Scale, Compass as CompassIcon, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Group } from "@/lib/groups"

type ProductTemplates = {
  radar?: string | null
  mylaw?: string | null
  compass?: string | null
  scholar?: string | null
}

type Props = {
  group: Group
}

// Extract product templates from demographics["product-templates"]
function extractProductTemplates(demographics: Record<string, any>): ProductTemplates {
  const pt = demographics?.["product-templates"] || demographics?.["product_templates"]
  if (!pt || typeof pt !== "object") return {}
  
  return {
    radar: pt.radar || null,
    mylaw: pt.mylaw || null,
    compass: pt.compass || null,
    scholar: pt.scholar || null,
  }
}

// Format demographics into readable key-value pairs (excluding product-templates)
function formatDemographics(demographics: Record<string, any>): Array<{ key: string; value: string }> {
  const pairs: Array<{ key: string; value: string }> = []
  
  for (const [key, value] of Object.entries(demographics)) {
    // Skip product-templates (shown separately)
    if (key === "product-templates" || key === "product_templates") continue
    if (value == null || value === "") continue
    
    // Format key: convert kebab-case to Title Case
    const label = key
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    
    // Format value: handle objects/arrays
    let displayValue: string
    if (typeof value === "object") {
      displayValue = JSON.stringify(value)
    } else {
      displayValue = String(value)
    }
    
    pairs.push({ key: label, value: displayValue })
  }
  
  return pairs
}

export function GroupInheritancePreview({ group }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const demographics = group.demographics || {}
  const productTemplates = extractProductTemplates(demographics)
  const demographicPairs = formatDemographics(demographics)
  
  // Count product templates
  const productTemplateCount = Object.values(productTemplates).filter(Boolean).length
  
  // Check what's included
  const hasNewsletter = !!group.default_template
  const hasProductTemplates = productTemplateCount > 0
  const hasDemographics = demographicPairs.length > 0
  const hasNothing = !hasNewsletter && !hasProductTemplates && !hasDemographics
  
  return (
    <Alert className="rounded-none border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm text-blue-900">
        <div className="space-y-3">
          {/* Collapsed Summary */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="font-medium">This group will apply:</div>
              
              {hasNothing && (
                <div className="text-xs text-blue-700">No automatic settings</div>
              )}
              
              {/* Compact summary badges */}
              <div className="flex flex-wrap gap-2">
                {hasNewsletter && (
                  <Badge variant="outline" className="rounded-sm border-blue-300 bg-blue-100 text-blue-800 text-xs">
                    <Mail className="mr-1 h-3 w-3" />
                    Newsletter: {group.default_template}
                  </Badge>
                )}
                
                {hasProductTemplates && (
                  <Badge variant="outline" className="rounded-sm border-purple-300 bg-purple-100 text-purple-800 text-xs">
                    <Target className="mr-1 h-3 w-3" />
                    Product Profiles: {productTemplateCount}
                  </Badge>
                )}
                
                {hasDemographics && (
                  <Badge variant="outline" className="rounded-sm border-gray-300 bg-gray-100 text-gray-800 text-xs">
                    <User className="mr-1 h-3 w-3" />
                    Demographics: {demographicPairs.length}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Toggle button */}
            {!hasNothing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 px-2 text-xs text-blue-700 hover:bg-blue-100 hover:text-blue-900"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-1 h-3 w-3" />
                    Details
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Expanded Details */}
          {isExpanded && !hasNothing && (
            <div className="space-y-3 border-t border-blue-200 pt-3">
              {/* Newsletter Template */}
              {hasNewsletter && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                    <Mail className="h-3.5 w-3.5" />
                    Newsletter Template
                  </div>
                  <div className="ml-5 text-xs text-blue-700">
                    • {group.default_template}
                  </div>
                </div>
              )}
              
              {/* Product Profile Templates */}
              {hasProductTemplates && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                    <Target className="h-3.5 w-3.5" />
                    Product Profile Templates ({productTemplateCount})
                  </div>
                  <div className="ml-5 space-y-0.5 text-xs text-blue-700">
                    {productTemplates.radar && (
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3 w-3 text-purple-600" />
                        Radar: {productTemplates.radar}
                      </div>
                    )}
                    {productTemplates.mylaw && (
                      <div className="flex items-center gap-1.5">
                        <Scale className="h-3 w-3 text-green-600" />
                        MyLaw: {productTemplates.mylaw}
                      </div>
                    )}
                    {productTemplates.compass && (
                      <div className="flex items-center gap-1.5">
                        <CompassIcon className="h-3 w-3 text-orange-600" />
                        Compass: {productTemplates.compass}
                      </div>
                    )}
                    {productTemplates.scholar && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3 text-red-600" />
                        Scholar: {productTemplates.scholar}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Demographics */}
              {hasDemographics && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                    <User className="h-3.5 w-3.5" />
                    Demographics ({demographicPairs.length} attributes)
                  </div>
                  <div className="ml-5 space-y-0.5 text-xs text-blue-700">
                    {demographicPairs.map(({ key, value }) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium">{key}:</span>
                        <span className="text-blue-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
