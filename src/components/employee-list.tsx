'use client';

import { useState } from 'react';

import { Input } from '@/registry/new-york-v4/ui/input';

import { EmployeeStateCard } from './employee-state-card';
import { Search } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  currentState: {
    status: 'in-office' | 'remote' | 'out-of-office' | 'meeting';
    location?: string;
    entryTime?: Date;
    exitTime?: Date;
  };
  plannedEvents: Array<{
    id: string;
    type: 'vacation' | 'business-trip' | 'remote-work';
    startDate: Date;
    endDate: Date;
    location?: string;
    description?: string;
  }>;
}

interface EmployeeListProps {
  employees: Employee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.currentState.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
        <Input
          placeholder='Search employees...'
          className='pl-10'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='grid gap-8'>
        {filteredEmployees.map((employee) => (
          <div key={employee.id}>
            <EmployeeStateCard employee={employee} />
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className='py-10 text-center text-gray-500'>No employees found matching your search.</div>
        )}
      </div>
    </div>
  );
}
