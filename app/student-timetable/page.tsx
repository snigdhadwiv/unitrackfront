// app/student-timetable/page.tsx
"use client"

import { useState } from "react"
import { Calendar, Download, ZoomIn, ZoomOut, Building, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StudentTimetablePage() {
  const [zoom, setZoom] = useState(1)
  const [selectedFaculty, setSelectedFaculty] = useState("Faculty of Science & Technology")

  // Faculty options
  const faculties = [
    "Faculty of Science & Technology",
    "Faculty of Business Administration", 
    "Faculty of Arts & Humanities",
    "Faculty of Engineering",
    "Faculty of Medicine",
    "Faculty of Law"
  ]

  // PDF files for each faculty
  const getTimetablePDF = () => {
    switch(selectedFaculty) {
      case "Faculty of Science & Technology":
        return "/timetables/science-timetable.pdf" // YOUR ACTUAL PDF
      case "Faculty of Business Administration":
        return "/timetables/business-timetable.pdf"
      case "Faculty of Engineering":
        return "/timetables/engineering-timetable.pdf"
      default:
        return "/timetables/default-timetable.pdf"
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
          <p className="mt-1 text-muted-foreground">View your class schedule for the semester</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(zoom - 0.1)} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(zoom + 0.1)} disabled={zoom >= 2}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Faculty Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {faculties.map(faculty => (
                <Badge 
                  key={faculty}
                  variant={selectedFaculty === faculty ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 text-sm"
                  onClick={() => setSelectedFaculty(faculty)}
                >
                  {faculty}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Faculty Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Currently Viewing</h3>
                <p className="text-blue-700">{selectedFaculty} Timetable</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              PDF Document
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PDF Timetable Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {selectedFaculty} - Semester Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-white">
            {/* PDF Viewer */}
            <div className="w-full h-[600px]">
              <embed 
                src={getTimetablePDF()} 
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>

            {/* Alternative: Iframe approach */}
            {/* <iframe 
              src={getTimetablePDF() + "#view=FitH"}
              className="w-full h-[600px] border-0"
              title={`${selectedFaculty} Timetable`}
            /> */}
          </div>
          
          {/* Quick Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-600">Total Classes/Week</div>
              <div className="text-lg font-bold">24</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-600">Current Week</div>
              <div className="text-lg font-bold">Week 12</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-600">Next Class</div>
              <div className="text-lg font-bold">CN - Mon 9:15 AM</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-600">Document</div>
              <div className="text-lg font-bold">PDF</div>
            </div>
          </div>

          {/* PDF Actions */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="gap-2" asChild>
              <a href={getTimetablePDF()} download>
                <Download className="h-4 w-4" />
                Download Timetable
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href={getTimetablePDF()} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}