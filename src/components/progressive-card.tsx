'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/new-york-v4/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';

import { format } from 'date-fns';
import { Briefcase, Calendar, ChevronDown, ChevronUp, Clock, LogOut, MapPin, Plane } from 'lucide-react';

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

export function ProgressiveCard({ employee }: EmployeeStateCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className='p-0'>
          {/* Header - Always visible */}
          <div className='flex items-center bg-gray-50 p-3'>
            <div className='relative mr-3 h-12 w-12'>
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
              <Image
                src={employee.imageUrl || '/placeholder.svg'}
                alt={employee.name}
                className={`rounded-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                width={48}
                height={48}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(false)}
              />
            </div>

            <div className='min-w-0 flex-grow'>
              <div className='flex items-center justify-between'>
                <h3 className='truncate text-sm font-medium'>{employee.name}</h3>
                {getStatusBadge(employee.currentState.status)}
              </div>
              <p className='truncate text-xs text-gray-500'>{employee.position}</p>
            </div>

            <CollapsibleTrigger asChild>
              <button className='ml-2 rounded-full p-1 hover:bg-gray-200'>
                {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
            </CollapsibleTrigger>
          </div>

          {/* Expandable content */}
          <CollapsibleContent>
            <div className='p-0'>
              <Tabs defaultValue='status' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='status'>Current Status</TabsTrigger>
                  <TabsTrigger value='events'>Upcoming Events</TabsTrigger>
                </TabsList>

                <TabsContent value='status' className='p-4'>
                  <div className='flex'>
                    {/* Larger image when expanded */}
                    <div className='relative mr-4 h-32 w-32 flex-shrink-0'>
                      <Image
                        src={employee.imageUrl || '/placeholder.svg'}
                        alt={employee.name}
                        className='rounded-md object-cover'
                        width={128}
                        height={128}
                      />
                    </div>

                    <div className='space-y-3'>
                      {employee.currentState.location && (
                        <div className='flex items-center'>
                          <MapPin className='mr-2 h-4 w-4 text-gray-400' />
                          <span className='text-sm'>{employee.currentState.location}</span>
                        </div>
                      )}

                      {employee.currentState.entryTime && (
                        <div className='flex items-center'>
                          <Clock className='mr-2 h-4 w-4 text-green-500' />
                          <span className='text-sm'>Entered: {format(employee.currentState.entryTime, 'h:mm a')}</span>
                        </div>
                      )}

                      {employee.currentState.exitTime && (
                        <div className='flex items-center'>
                          <LogOut className='mr-2 h-4 w-4 text-red-500' />
                          <span className='text-sm'>Left: {format(employee.currentState.exitTime, 'h:mm a')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='events' className='p-4'>
                  {employee.plannedEvents.length > 0 ? (
                    <div className='space-y-4'>
                      {employee.plannedEvents.map((event) => (
                        <div key={event.id} className='flex items-start'>
                          <div className='mt-0.5 mr-3'>{getEventIcon(event.type)}</div>
                          <div>
                            <div className='text-sm font-medium'>{event.type.replace(/-/g, ' ')}</div>
                            <div className='text-xs text-gray-500'>
                              {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d, yyyy')}
                            </div>
                            {event.location && (
                              <div className='mt-1 flex items-center text-xs'>
                                <MapPin className='mr-1 h-3 w-3 text-gray-400' />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && <p className='mt-1 text-xs text-gray-500'>{event.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-sm text-gray-500'>No upcoming events</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}
