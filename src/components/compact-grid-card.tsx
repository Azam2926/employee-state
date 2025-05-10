'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
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

export function CompactGridCard({ employee }: EmployeeStateCardProps) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-office':
        return 'In Office';
      case 'remote':
        return 'Remote';
      case 'out-of-office':
        return 'Out of Office';
      case 'meeting':
        return 'In Meeting';
      default:
        return 'Unknown';
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
      <CardContent className='p-0'>
        <div className='grid grid-cols-3'>
          {/* Left column - Employee image */}
          <div className='relative h-full'>
            <div className='relative h-full min-h-[100px] bg-gray-100'>
              {!isImageLoaded && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Avatar className='h-12 w-12'>
                    <AvatarFallback>
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <Image
                src={employee.imageUrl || '/placeholder.svg'}
                alt={employee.name}
                className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                fill
                sizes='33vw'
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(false)}
              />
            </div>

            {/* Status indicator */}
            <div
              className={`absolute right-0 bottom-0 left-0 px-2 py-1 ${getStatusColor(employee.currentState.status)} text-center text-xs font-medium text-white`}>
              {getStatusText(employee.currentState.status)}
            </div>
          </div>

          {/* Middle column - Basic info */}
          <div className='border-r p-3'>
            <h3 className='mb-1 line-clamp-1 text-sm font-medium'>{employee.name}</h3>
            <p className='mb-2 line-clamp-1 text-xs text-gray-500'>{employee.position}</p>

            {employee.currentState.location && (
              <div className='mb-1 flex items-center gap-1'>
                <MapPin className='h-3 w-3 flex-shrink-0 text-gray-400' />
                <span className='line-clamp-1 text-xs text-gray-600'>{employee.currentState.location}</span>
              </div>
            )}

            <div className='mt-2 flex flex-col gap-1'>
              {employee.currentState.entryTime && (
                <div className='flex items-center gap-1'>
                  <Clock className='h-3 w-3 flex-shrink-0 text-green-500' />
                  <span className='text-xs'>{format(employee.currentState.entryTime, 'h:mm a')}</span>
                </div>
              )}

              {employee.currentState.exitTime && (
                <div className='flex items-center gap-1'>
                  <LogOut className='h-3 w-3 flex-shrink-0 text-red-500' />
                  <span className='text-xs'>{format(employee.currentState.exitTime, 'h:mm a')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Events */}
          <div className='p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <h4 className='text-xs font-medium text-gray-500'>EVENTS</h4>
              <span className='rounded-full bg-gray-100 px-1.5 py-0.5 text-xs'>{employee.plannedEvents.length}</span>
            </div>

            {nextEvent ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='cursor-pointer rounded-md border p-2 hover:bg-gray-50'>
                      <div className='mb-1 flex items-center gap-1'>
                        {getEventIcon(nextEvent.type)}
                        <span className='text-xs font-medium'>{nextEvent.type.replace(/-/g, ' ')}</span>
                      </div>
                      <div className='text-xs text-gray-500'>
                        {format(nextEvent.startDate, 'MMM d')} - {format(nextEvent.endDate, 'MMM d')}
                      </div>
                      {nextEvent.location && (
                        <div className='mt-1 flex items-center gap-1'>
                          <MapPin className='h-2.5 w-2.5 text-gray-400' />
                          <span className='line-clamp-1 text-xs text-gray-500'>{nextEvent.location}</span>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='left' className='max-w-[200px]'>
                    <div>
                      <p className='font-medium'>{nextEvent.type.replace(/-/g, ' ')}</p>
                      <p className='text-sm'>
                        {format(nextEvent.startDate, 'MMM d')} - {format(nextEvent.endDate, 'MMM d, yyyy')}
                      </p>
                      {nextEvent.description && <p className='mt-1 text-sm'>{nextEvent.description}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className='flex h-[80px] items-center justify-center text-xs text-gray-400'>No upcoming events</div>
            )}

            {employee.plannedEvents.length > 1 && (
              <div className='mt-2 text-center'>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className='flex w-full items-center justify-center text-xs text-blue-500 hover:underline'>
                      <Info className='mr-1 h-3 w-3' />
                      View all events
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='w-64 p-2'>
                    <h4 className='mb-2 text-sm font-medium'>All Upcoming Events</h4>
                    <div className='max-h-48 space-y-2 overflow-y-auto'>
                      {employee.plannedEvents.map((event) => (
                        <div key={event.id} className='flex items-start gap-2 rounded-md bg-gray-50 p-2 text-xs'>
                          <div className='mt-0.5'>{getEventIcon(event.type)}</div>
                          <div>
                            <div className='font-medium'>{event.type.replace(/-/g, ' ')}</div>
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
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
