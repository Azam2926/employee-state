'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/new-york-v4/ui/tooltip';

import { format } from 'date-fns';
import { Briefcase, Calendar, Clock, MapPin, Plane } from 'lucide-react';

interface EmployeeEvent {
  id: string;
  type: 'vacation' | 'business-trip' | 'remote-work';
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}

interface EmployeeStateCardProps {
  employee: {
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
    plannedEvents: EmployeeEvent[];
  };
}

export function UltraCompactEmployeeCard({ employee }: EmployeeStateCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-office':
        return 'bg-green-500';
      case 'remote':
        return 'bg-blue-500';
      case 'out-of-office':
        return 'bg-gray-500';
      case 'meeting':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Plane className='h-3 w-3 text-yellow-500' />;
      case 'business-trip':
        return <Briefcase className='h-3 w-3 text-blue-500' />;
      case 'remote-work':
        return <MapPin className='h-3 w-3 text-green-500' />;
      default:
        return <Calendar className='h-3 w-3' />;
    }
  };

  // Get the next upcoming event
  const nextEvent =
    employee.plannedEvents.length > 0
      ? employee.plannedEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0]
      : null;

  return (
    <Card className='overflow-hidden transition-shadow hover:shadow-md'>
      <CardContent className='flex p-0'>
        {/* Left side - Employee image */}
        <div className='relative h-16 w-16 flex-shrink-0 bg-gray-100'>
          {!isImageLoaded && (
            <Avatar className='h-16 w-16 rounded-none'>
              <AvatarFallback className='rounded-none'>
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          )}
          <div className='relative h-full w-full'>
            <Image
              src={employee.imageUrl || '/placeholder.svg'}
              alt={employee.name}
              className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              width={64}
              height={64}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(false)}
            />
          </div>
          {/* Status indicator */}
          <div
            className={`absolute right-0 bottom-0 left-0 h-1.5 ${getStatusColor(employee.currentState.status)}`}></div>
        </div>

        {/* Right side - All information */}
        <div className='min-w-0 flex-grow p-2 pl-3'>
          <div className='flex items-start justify-between'>
            {/* Name and position */}
            <div className='min-w-0 pr-2'>
              <h3 className='truncate text-sm font-medium'>{employee.name}</h3>
              <p className='truncate text-xs text-gray-500'>{employee.position}</p>
            </div>

            {/* Time info */}
            <div className='flex items-center text-xs whitespace-nowrap'>
              {employee.currentState.entryTime && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center'>
                        <Clock className='h-3 w-3 text-green-500' />
                        <span className='ml-1'>{format(employee.currentState.entryTime, 'h:mm')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='top' className='text-xs'>
                      <p>Entered at {format(employee.currentState.entryTime, 'h:mm a')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Location */}
          {employee.currentState.location && (
            <div className='mt-0.5 flex min-w-0 items-center gap-1'>
              <MapPin className='h-3 w-3 flex-shrink-0 text-gray-400' />
              <span className='truncate text-xs text-gray-600'>{employee.currentState.location}</span>
            </div>
          )}

          {/* Bottom row with events */}
          <div className='mt-1 flex items-center justify-between'>
            {/* Event count */}
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3 text-gray-400' />
              <span className='text-xs text-gray-500'>
                {employee.plannedEvents.length > 0
                  ? `${employee.plannedEvents.length} ${employee.plannedEvents.length === 1 ? 'event' : 'events'}`
                  : 'No events'}
              </span>
            </div>

            {/* Next event preview */}
            {nextEvent && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs'>
                      {getEventIcon(nextEvent.type)}
                      <span className='max-w-[60px] truncate'>{format(nextEvent.startDate, 'MMM d')}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='top' className='max-w-[200px] p-2 text-xs'>
                    <p className='font-medium'>{nextEvent.type.replace('-', ' ')}</p>
                    <p>
                      {format(nextEvent.startDate, 'MMM d')} - {format(nextEvent.endDate, 'MMM d')}
                    </p>
                    {nextEvent.location && (
                      <div className='mt-1 flex items-center gap-1'>
                        <MapPin className='h-2.5 w-2.5' />
                        <span className='truncate'>{nextEvent.location}</span>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
