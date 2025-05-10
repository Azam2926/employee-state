'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Separator } from '@/registry/new-york-v4/ui/separator';

import { format } from 'date-fns';
import { Briefcase, Calendar, CalendarIcon, Clock, LogOut, MapPin, Plane, User } from 'lucide-react';

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

export function SpaciousEmployeeCard({ employee }: EmployeeStateCardProps) {
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

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        <div className='flex flex-col md:flex-row'>
          {/* Left side - Employee image */}
          <div className='relative h-64 w-full bg-gray-100 md:h-auto md:w-1/3'>
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
            <div className='relative h-full w-full'>
              <Image
                src={employee.imageUrl || '/placeholder.svg'}
                alt={employee.name}
                className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                fill
                sizes='(max-width: 768px) 100vw, 33vw'
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(false)}
              />
            </div>
          </div>

          {/* Right side - Employee state information */}
          <div className='w-full p-6 md:w-2/3'>
            <div className='flex h-full flex-col'>
              {/* Employee name and position */}
              <div className='mb-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-2xl font-bold'>{employee.name}</h3>
                  {getStatusBadge(employee.currentState.status)}
                </div>
                <p className='mt-1 text-gray-500'>{employee.position}</p>
              </div>

              <Separator className='my-4' />

              {/* Current state */}
              <div className='mb-6'>
                <h4 className='mb-3 flex items-center text-sm font-medium text-gray-500'>
                  <User className='mr-2 h-4 w-4' />
                  CURRENT STATE
                </h4>

                <div className='space-y-3'>
                  {employee.currentState.location && (
                    <div className='flex items-center'>
                      <MapPin className='mr-3 h-5 w-5 text-gray-400' />
                      <span>{employee.currentState.location}</span>
                    </div>
                  )}

                  {employee.currentState.entryTime && (
                    <div className='flex items-center'>
                      <Clock className='mr-3 h-5 w-5 text-green-500' />
                      <span>Entered: {format(employee.currentState.entryTime, 'h:mm a')}</span>
                    </div>
                  )}

                  {employee.currentState.exitTime && (
                    <div className='flex items-center'>
                      <LogOut className='mr-3 h-5 w-5 text-red-500' />
                      <span>Left: {format(employee.currentState.exitTime, 'h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className='my-4' />

              {/* Future planned events */}
              <div>
                <h4 className='mb-3 flex items-center text-sm font-medium text-gray-500'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  UPCOMING EVENTS
                </h4>

                {employee.plannedEvents.length > 0 ? (
                  <div className='space-y-4'>
                    {employee.plannedEvents.map((event) => (
                      <div key={event.id} className='flex items-start'>
                        <div className='mt-0.5 mr-3'>{getEventIcon(event.type)}</div>
                        <div>
                          <div className='font-medium'>{event.type.replace(/-/g, ' ')}</div>
                          <div className='text-sm text-gray-500'>
                            {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d, yyyy')}
                          </div>
                          {event.location && (
                            <div className='mt-1 flex items-center text-sm'>
                              <MapPin className='mr-1 h-3 w-3 text-gray-400' />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.description && <p className='mt-1 text-sm text-gray-500'>{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500'>No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
