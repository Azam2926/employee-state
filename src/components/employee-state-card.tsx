'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/new-york-v4/ui/tooltip';

import { format } from 'date-fns';
import { Briefcase, Calendar, Clock, LogOut, MapPin, Plane } from 'lucide-react';

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
    plannedEvents: Array<{
      id: string;
      type: 'vacation' | 'business-trip' | 'remote-work';
      startDate: Date;
      endDate: Date;
      location?: string;
      description?: string;
    }>;
  };
}

export function EmployeeStateCard({ employee }: EmployeeStateCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-office':
        return <Badge className='bg-green-500'>In Office</Badge>;
      case 'remote':
        return <Badge className='bg-blue-500'>Remote</Badge>;
      case 'out-of-office':
        return <Badge className='bg-gray-500'>Out of Office</Badge>;
      case 'meeting':
        return <Badge className='bg-purple-500'>In Meeting</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Plane className='h-4 w-4 text-yellow-500' />;
      case 'business-trip':
        return <Briefcase className='h-4 w-4 text-blue-500' />;
      case 'remote-work':
        return <MapPin className='h-4 w-4 text-green-500' />;
      default:
        return <Calendar className='h-4 w-4' />;
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

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        <div className='flex flex-col sm:flex-row'>
          {/* Left side - Employee image */}
          <div className='relative h-64 w-full overflow-hidden bg-gray-100 sm:h-auto sm:w-1/3'>
            {!isImageLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
                <Avatar className='h-24 w-24'>
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
              className={`h-full w-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              fill
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(false)}
            />
          </div>

          {/* Right side - Employee state information */}
          <div className='w-full p-6 sm:w-2/3'>
            <div className='flex h-full flex-col'>
              {/* Employee name and position */}
              <div className='mb-4'>
                <h3 className='text-2xl font-bold'>{employee.name}</h3>
                <p className='text-gray-500'>{employee.position}</p>
              </div>

              {/* Current state */}
              <div className='mb-6'>
                <h4 className='mb-2 text-sm font-medium text-gray-500'>CURRENT STATE</h4>
                <div className='mb-2 flex items-center gap-3'>
                  {getStatusBadge(employee.currentState.status)}
                  {employee.currentState.location && (
                    <div className='flex items-center text-sm'>
                      <MapPin className='mr-1 h-4 w-4 text-gray-400' />
                      <span>{employee.currentState.location}</span>
                    </div>
                  )}
                </div>

                {/* Entry/Exit time */}
                <div className='flex flex-col gap-1 text-sm'>
                  {employee.currentState.entryTime && (
                    <div className='flex items-center'>
                      <Clock className='mr-2 h-4 w-4 text-green-500' />
                      <span>Entered: {format(employee.currentState.entryTime, 'h:mm a')}</span>
                    </div>
                  )}
                  {employee.currentState.exitTime && (
                    <div className='flex items-center'>
                      <LogOut className='mr-2 h-4 w-4 text-red-500' />
                      <span>Left: {format(employee.currentState.exitTime, 'h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Future planned events */}
              <div>
                <h4 className='mb-2 text-sm font-medium text-gray-500'>UPCOMING EVENTS</h4>
                {employee.plannedEvents.length > 0 ? (
                  <div className='space-y-3'>
                    {employee.plannedEvents.map((event) => (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex items-start gap-2 rounded-md p-2 transition-colors hover:bg-gray-50'>
                              <div className='mt-0.5'>{getEventIcon(event.type)}</div>
                              <div>
                                <div className='font-medium'>{getEventLabel(event.type)}</div>
                                <div className='text-sm text-gray-500'>
                                  {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d, yyyy')}
                                </div>
                                {event.location && (
                                  <div className='mt-1 flex items-center text-sm'>
                                    <MapPin className='mr-1 h-3 w-3 text-gray-400' />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{event.description || `${getEventLabel(event.type)} planned`}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-500'>No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
