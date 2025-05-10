"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

import { Input } from "@/registry/new-york-v4/ui/input"
import { CompactEmployeeCard } from "./compact-employee-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"

interface EmployeeEvent {
  id: string
  type: "vacation" | "business-trip" | "remote-work"
  startDate: Date
  endDate: Date
  location?: string
  description?: string
}

interface Employee {
  id: string
  name: string
  position: string
  imageUrl: string
  currentState: {
    status: "in-office" | "remote" | "out-of-office" | "meeting"
    location?: string
    entryTime?: Date
    exitTime?: Date
  }
  plannedEvents: EmployeeEvent[]
}

interface EmployeeGridProps {
  employees: Employee[]
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.currentState.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesStatus = statusFilter === "all" || employee.currentState.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-office">In Office</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="meeting">In Meeting</SelectItem>
              <SelectItem value="out-of-office">Out of Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
        {filteredEmployees.map((employee) => (
          <CompactEmployeeCard key={employee.id} employee={employee} />
        ))}

        {filteredEmployees.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">No employees found matching your search.</div>
        )}
      </div>
    </div>
  )
}
