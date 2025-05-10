'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';

import { LucideClock3, LucideHelpCircle, LucidePlaneTakeoff, LucideSun } from 'lucide-react';

const employees = [
  {
    name: 'Sherzod R.',
    checkIn: '9:03',
    checkOut: '18:00',
    status: 'present',
    avatar: '/avatars/1.png',
    next: { type: 'vacation', date: '23-apr' }
  },
  {
    name: 'Alisher D.',
    checkIn: '8:52',
    checkOut: '17:45',
    status: 'present',
    avatar: '/avatars/2.png',
    next: { type: 'trip', date: '25-apr' }
  },
  {
    name: 'Madina J',
    checkIn: '-:-',
    checkOut: '1---',
    status: 'late',
    avatar: '/avatars/3.png'
  },
  {
    name: 'Farhod S.',
    checkIn: '-:-',
    checkOut: '-:-',
    status: 'unknown',
    avatar: '/avatars/4.png',
    next: { type: 'trip', date: '27-apr' }
  },
  {
    name: 'Gulnora',
    checkIn: '--',
    checkOut: '--',
    status: 'unknown',
    avatar: '/avatars/5.png'
  }
];

const statusColor = {
  present: 'bg-green-500',
  late: 'bg-yellow-500',
  unknown: 'bg-gray-400'
};

const statusIcon = {
  present: <LucideClock3 className='mr-1 h-4 w-4' />,
  late: <LucideClock3 className='mr-1 h-4 w-4 animate-pulse' />,
  unknown: <LucideHelpCircle className='text-muted mr-1 h-4 w-4' />
};

const nextIcon = {
  vacation: <LucideSun className='mr-1 h-4 w-4 text-yellow-300' />,
  trip: <LucidePlaneTakeoff className='mr-1 h-4 w-4 text-sky-400' />
};

export default function EmployeeStatusDashboard() {
  return (
    <div className='min-h-screen p-10'>
      <h1 className='mb-2 text-center text-4xl font-extrabold tracking-wide'>Bo‘lim: IT</h1>

      {/* Employee Cards */}
      <div className='grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {employees.map((emp, i) => (
          <Card
            key={i}
            className='w-full rounded border p-0 shadow-xl transition-transform duration-300 hover:scale-105'>
            <CardContent className='flex justify-between space-x-4 p-0'>
              <Avatar className='h-full w-40 rounded'>
                <AvatarImage className='rounded-none' src={emp.avatar} />
                <AvatarFallback className='rounded-none'>{emp.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-center gap-2 py-2'>
                <h2 className='text-center text-lg font-semibold'>{emp.name}</h2>
                <p className='text-sm text-slate-300'>
                  {emp.checkIn} - {emp.checkOut}
                </p>
                <Badge className={cn('flex items-center rounded-full px-3 py-1 text-white', statusColor[emp.status])}>
                  {statusIcon[emp.status]} {emp.status}
                </Badge>

                {emp.next && (
                  <div className='mt-2 mr-2 flex items-center gap-1 text-xs text-slate-400'>
                    {nextIcon[emp.next.type]}{' '}
                    <span className='capitalize'>
                      Next: {emp.next.type} on {emp.next.date}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
