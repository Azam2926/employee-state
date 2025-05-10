import { CompactGridCard } from '@/components/compact-grid-card';
import { ProgressiveCard } from '@/components/progressive-card';
import { SpaciousEmployeeCard } from '@/components/spacious-employee-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';

export default function Home() {
  // Sample employee data
  const employees = [
    {
      id: '1',
      name: 'Jane Smith',
      position: 'Senior Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
      currentState: {
        status: 'in-office' as const,
        location: 'Main Office, Floor 3',
        entryTime: new Date(new Date().setHours(9, 15)),
        exitTime: undefined
      },
      plannedEvents: [
        {
          id: 'event1',
          type: 'vacation' as const,
          startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 22)),
          location: 'Bali, Indonesia',
          description: 'Annual vacation'
        },
        {
          id: 'event2',
          type: 'business-trip' as const,
          startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          location: 'New York Office',
          description: 'Quarterly planning meeting'
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Johnson',
      position: 'Product Manager',
      imageUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
      currentState: {
        status: 'meeting' as const,
        location: 'Conference Room B',
        entryTime: new Date(new Date().setHours(8, 30)),
        exitTime: undefined
      },
      plannedEvents: [
        {
          id: 'event3',
          type: 'business-trip' as const,
          startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 12)),
          location: 'Chicago Client Office',
          description: 'Client presentation'
        }
      ]
    },
    {
      id: '3',
      name: 'Emily Chen',
      position: 'UX Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3',
      currentState: {
        status: 'remote' as const,
        location: 'Home Office',
        entryTime: new Date(new Date().setHours(10, 0)),
        exitTime: undefined
      },
      plannedEvents: [
        {
          id: 'event4',
          type: 'remote-work' as const,
          startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          location: 'Mountain Cabin',
          description: 'Working remotely from cabin retreat'
        }
      ]
    }
  ];

  return (
    <main className='container mx-auto px-4 py-10'>
      <h1 className='mb-6 text-2xl font-bold'>Employee State Card Design Variations</h1>

      <Tabs defaultValue='spacious' className='mb-10 w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='spacious'>Spacious Layout</TabsTrigger>
          <TabsTrigger value='compact'>Compact Grid</TabsTrigger>
          <TabsTrigger value='progressive'>Progressive Disclosure</TabsTrigger>
        </TabsList>

        <TabsContent value='spacious' className='mt-6'>
          <div className='mb-4'>
            <h2 className='mb-2 text-lg font-medium'>Spacious Layout</h2>
            <p className='mb-4 text-gray-600'>
              This design prioritizes readability and visual clarity with a spacious layout. The employee's image is
              prominently displayed on the left, with detailed information clearly organized on the right. Ideal for
              detailed employee profiles and situations where comprehension is more important than space efficiency.
            </p>
          </div>
          <div className='max-w-3xl'>
            {employees.map((emp) => (
              <div key={emp.id} className='mb-6'>
                <SpaciousEmployeeCard employee={emp} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='compact' className='mt-6'>
          <div className='mb-4'>
            <h2 className='mb-2 text-lg font-medium'>Compact Grid Layout</h2>
            <p className='mb-4 text-gray-600'>
              This design maximizes information density using a three-column grid layout. The employee's image occupies
              the left column, with current status in the middle and upcoming events on the right. Perfect for
              dashboards and team overviews where space is limited but comprehensive information is still needed.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
            {employees.map((emp) => (
              <CompactGridCard key={emp.id} employee={emp} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='progressive' className='mt-6'>
          <div className='mb-4'>
            <h2 className='mb-2 text-lg font-medium'>Progressive Disclosure</h2>
            <p className='mb-4 text-gray-600'>
              This design uses progressive disclosure to maintain a clean interface while providing access to detailed
              information. The card shows minimal information by default, with expandable sections and tabs to reveal
              more details on demand. Ideal for interfaces where initial simplicity is valued but detailed information
              should still be accessible.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
            {employees.map((emp) => (
              <ProgressiveCard key={emp.id} employee={emp} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className='mt-10 rounded-lg bg-gray-50 p-6'>
        <h2 className='mb-4 text-xl font-bold'>Design Rationale and Trade-offs</h2>

        <div className='space-y-6'>
          <div>
            <h3 className='mb-2 text-lg font-medium'>Spacious Layout</h3>
            <p className='mb-2'>
              <strong>Strengths:</strong>
            </p>
            <ul className='mb-2 list-disc space-y-1 pl-5'>
              <li>Excellent readability with clear visual hierarchy</li>
              <li>Full-size employee photo creates personal connection</li>
              <li>All information is immediately visible without interaction</li>
              <li>Generous spacing reduces cognitive load</li>
            </ul>
            <p className='mb-2'>
              <strong>Trade-offs:</strong>
            </p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>Requires significant vertical space</li>
              <li>Limits the number of employees viewable at once</li>
              <li>Less efficient for quick scanning of multiple employees</li>
              <li>May feel empty when an employee has minimal information</li>
            </ul>
          </div>

          <div>
            <h3 className='mb-2 text-lg font-medium'>Compact Grid Layout</h3>
            <p className='mb-2'>
              <strong>Strengths:</strong>
            </p>
            <ul className='mb-2 list-disc space-y-1 pl-5'>
              <li>High information density in a compact footprint</li>
              <li>Clear separation of concerns with the three-column layout</li>
              <li>Efficient for comparing multiple employees</li>
              <li>Maintains visual prominence of the employee photo</li>
            </ul>
            <p className='mb-2'>
              <strong>Trade-offs:</strong>
            </p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>Text must be smaller to fit in the constrained space</li>
              <li>Some information requires tooltips or popovers to access</li>
              <li>Fixed-width columns can be limiting for certain content</li>
              <li>May feel cramped on very small screens</li>
            </ul>
          </div>

          <div>
            <h3 className='mb-2 text-lg font-medium'>Progressive Disclosure</h3>
            <p className='mb-2'>
              <strong>Strengths:</strong>
            </p>
            <ul className='mb-2 list-disc space-y-1 pl-5'>
              <li>Extremely clean initial presentation</li>
              <li>Adapts to the amount of information available</li>
              <li>Allows users to focus on specific information through tabs</li>
              <li>Most space-efficient when collapsed</li>
            </ul>
            <p className='mb-2'>
              <strong>Trade-offs:</strong>
            </p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>Requires user interaction to access complete information</li>
              <li>Less efficient for users who need to see all details at once</li>
              <li>Additional cognitive load from remembering what's behind each tab</li>
              <li>Interaction patterns may not be immediately obvious to all users</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
