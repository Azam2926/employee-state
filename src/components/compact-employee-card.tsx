'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/new-york-v4/ui/tooltip';

import { format } from 'date-fns';
import { Briefcase, Calendar, Clock, Info, LogOut, MapPin, Plane } from 'lucide-react';

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

export function CompactEmployeeCard({ employee }: EmployeeStateCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-office':
        return <Badge className='bg-green-500 text-xs whitespace-nowrap'>In Office</Badge>;
      case 'remote':
        return <Badge className='bg-blue-500 text-xs whitespace-nowrap'>Remote</Badge>;
      case 'out-of-office':
        return <Badge className='bg-gray-500 text-xs whitespace-nowrap'>Out of Office</Badge>;
      case 'meeting':
        return <Badge className='bg-purple-500 text-xs whitespace-nowrap'>In Meeting</Badge>;
      default:
        return <Badge className='text-xs whitespace-nowrap'>Unknown</Badge>;
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

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'Vacation';
      case 'business-trip':
        return 'Business Trip';
      case 'remote-work':
        return 'Remote Work';
      default:
        return 'Event';
    }
  };

  // Get the next upcoming event
  const nextEvent =
    employee.plannedEvents.length > 0
      ? employee.plannedEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0]
      : null;

  return (
    <Card className='overflow-hidden transition-shadow hover:shadow-md'>
      <CardContent className='p-3'>
        <div className='flex items-center gap-3'>
          {/* Employee image - much smaller */}
          <div className='relative flex-shrink-0'>
            <div className='relative h-12 w-12 overflow-hidden rounded-full bg-gray-100'>
              {!isImageLoaded && (
                <Avatar className='h-12 w-12'>
                  <AvatarFallback>
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
                  width={48}
                  height={48}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setIsImageLoaded(false)}
                />
              </div>
            </div>
            <div className='absolute -right-1 -bottom-1'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='h-4 w-4 rounded-full border-2 border-white bg-green-500'></div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Active</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main content area */}
          <div className='min-w-0 flex-grow'>
            <div className='mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex min-w-0 items-center gap-2'>
                <h3 className='truncate text-sm font-medium'>{employee.name}</h3>
                {getStatusBadge(employee.currentState.status)}
              </div>
              <p className='truncate text-xs text-gray-500'>{employee.position}</p>
            </div>

            {/* Location and time info */}
            <div className='xs:flex-row xs:items-center flex flex-col gap-2 text-xs text-gray-600'>
              {employee.currentState.location && (
                <div className='flex min-w-0 items-center gap-1'>
                  <MapPin className='h-3 w-3 flex-shrink-0 text-gray-400' />
                  <span className='truncate'>{employee.currentState.location}</span>
                </div>
              )}

              {employee.currentState.entryTime && (
                <div className='flex items-center gap-1 whitespace-nowrap'>
                  <Clock className='h-3 w-3 flex-shrink-0 text-green-500' />
                  <span>{format(employee.currentState.entryTime, 'h:mm a')}</span>
                </div>
              )}

              {employee.currentState.exitTime && (
                <div className='flex items-center gap-1 whitespace-nowrap'>
                  <LogOut className='h-3 w-3 flex-shrink-0 text-red-500' />
                  <span>{format(employee.currentState.exitTime, 'h:mm a')}</span>
                </div>
              )}
            </div>

            {/* Upcoming events - compact version */}
            <div className='mt-2 flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3 text-gray-400' />
                <span className='text-xs text-gray-500'>
                  {employee.plannedEvents.length > 0
                    ? `${employee.plannedEvents.length} upcoming ${employee.plannedEvents.length === 1 ? 'event' : 'events'}`
                    : 'No upcoming events'}
                </span>
              </div>

              {nextEvent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs'>
                        {getEventIcon(nextEvent.type)}
                        <span className='max-w-[100px] truncate'>{format(nextEvent.startDate, 'MMM d')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                      <div className='text-sm'>
                        <p className='font-medium'>{getEventLabel(nextEvent.type)}</p>
                        <p>
                          {format(nextEvent.startDate, 'MMM d')} - {format(nextEvent.endDate, 'MMM d, yyyy')}
                        </p>
                        {nextEvent.location && (
                          <div className='mt-1 flex items-center gap-1'>
                            <MapPin className='h-3 w-3' />
                            <span>{nextEvent.location}</span>
                          </div>
                        )}
                        {nextEvent.description && <p className='mt-1 text-xs'>{nextEvent.description}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {employee.plannedEvents.length > 1 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className='flex items-center text-xs text-gray-500 hover:text-gray-700'>
                      <Info className='h-3 w-3' />
                      <span className='ml-1'>More</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='w-72 p-3'>
                    <h4 className='mb-2 text-sm font-medium'>Upcoming Events</h4>
                    <div className='max-h-48 space-y-2 overflow-y-auto'>
                      {employee.plannedEvents.map((event) => (
                        <div key={event.id} className='flex items-start gap-2 rounded-md bg-gray-50 p-2 text-xs'>
                          <div className='mt-0.5'>{getEventIcon(event.type)}</div>
                          <div>
                            <div className='font-medium'>{getEventLabel(event.type)}</div>
                            <div className='text-gray-500'>
                              {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d, yyyy')}
                            </div>
                            {event.location && (
                              <div className='mt-1 flex items-center'>
                                <MapPin className='mr-1 h-2 w-2 text-gray-400' />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && <p className='mt-1 text-gray-500'>{event.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
