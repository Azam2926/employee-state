"use client"
import { useState } from 'react';
import { User, LayoutGrid, Network, Building } from 'lucide-react';

// Define our status types and their visual properties
const STATUS_TYPES = {
  AT_WORKSPACE: {
    borderColor: 'border-green-500',
    borderStyle: 'border-solid',
    borderWidth: 'border-4',
    label: 'At Workspace'
  },
  NOT_AT_WORKSPACE: {
    borderColor: 'border-gray-400',
    borderStyle: 'border-solid',
    borderWidth: 'border-4',
    label: 'Not at Workspace'
  },
  BUSINESS_TRIP_PLANNED: {
    borderColor: 'border-blue-400',
    borderStyle: 'border-dashed',
    borderWidth: 'border-4',
    label: 'Business Trip Planned',
    icon: '✈️'
  },
  VACATION_PLANNED: {
    borderColor: 'border-yellow-400',
    borderStyle: 'border-dotted',
    borderWidth: 'border-4',
    label: 'Vacation Planned',
    icon: '🏝️'
  }
};

const Page = ({ employee }) => {
  const status = STATUS_TYPES[employee.status];

  return (
    <div className="relative flex flex-col items-center mx-2">
      <div
        className={`relative rounded-full w-32 h-32 flex items-center justify-center
          ${status.borderColor} ${status.borderStyle} ${status.borderWidth}`}
      >
        {employee.avatarUrl ? (
          <img
            src={employee.avatarUrl}
            alt={employee.name}
            className="rounded-full w-14 h-14 object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-gray-600" />
        )}

        {status.icon && (
          <div className="absolute -top-1 -right-1 text-lg">
            {status.icon}
          </div>
        )}
      </div>
      <span className="text-xs mt-1 font-medium">{employee.name}</span>
      <span className="text-xs text-gray-500">{status.label}</span>
    </div>
  );
};

// Department component to display a group of employees
const Department = ({ name, employees }) => {
  return (
    <div className="p-4  rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">{name}</h3>
      <div className="flex flex-wrap space-y-8 space-x-8">
        {employees.map(employee => (
          <Page key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

// Network view using React Flow
const NetworkView = ({ departments }) => {
  // Import custom node components
  const DepartmentNode = ({ data }) => (
    <div className="w-48 h-16 bg-slate-50 border-2 border-slate-400 rounded-lg flex items-center justify-center shadow-md px-4">
      <Building className="w-5 h-5 mr-2 text-slate-600" />
      <div className="font-medium text-slate-800">{data.label}</div>
    </div>
  );

  const EmployeeNode = ({ data }) => {
    const status = STATUS_TYPES[data.status];

    return (
      <div
        className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-md"
        style={{
          border: `4px ${status.borderStyle === 'border-solid' ? 'solid' :
                        status.borderStyle === 'border-dashed' ? 'dashed' : 'dotted'} ${status.borderColor.replace('border-', '')}`,
        }}
      >
        <div className="relative">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.label}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}

          {status.icon && (
            <div className="absolute -top-2 -right-2 text-lg">
              {status.icon}
            </div>
          )}
        </div>
        <div className="mt-1 text-xs font-medium text-center">{data.label}</div>
        <div className="text-xs text-gray-500">{status.label}</div>
      </div>
    );
  };

  // Create nodes and edges for the network diagram
  const nodes = [];
  const edges = [];

  // Add department nodes
  departments.forEach((dept, deptIndex) => {
    const deptX = 300;
    const deptY = 100 + (deptIndex * 300);

    // Add department node
    nodes.push({
      id: `dept-${dept.id}`,
      type: 'department',
      position: { x: deptX, y: deptY },
      data: { label: dept.name }
    });

    // Add employee nodes in a circle around department
    const employeeCount = dept.employees.length;
    const radius = 150;

    dept.employees.forEach((emp, empIndex) => {
      // Calculate position in a circle around department
      const angle = (Math.PI * 2 * empIndex) / employeeCount;
      const empX = deptX + radius * Math.cos(angle);
      const empY = deptY + radius * Math.sin(angle);

      // Add employee node
      nodes.push({
        id: `emp-${emp.id}`,
        type: 'employee',
        position: { x: empX, y: empY },
        data: {
          label: emp.name,
          status: emp.status,
          avatarUrl: "https://www.claudeusercontent.com/" + emp.avatarUrl
        }
      });

      // Add edge connecting employee to department
      edges.push({
        id: `edge-${dept.id}-${emp.id}`,
        source: `dept-${dept.id}`,
        target: `emp-${emp.id}`,
        data: { deptId: dept.id }
      });
    });
  });

  return (
    <div className="w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border overflow-hidden">
      <div className="p-4 h-full relative">
        <svg width="100%" height="100%" className="absolute top-0 left-0">
          {/* Draw edges */}
          {edges.map(edge => {
            const source = nodes.find(node => node.id === edge.source);
            const target = nodes.find(node => node.id === edge.target);

            // Calculate center points
            const sourceX = source.position.x + (source.type === 'department' ? 96 : 48);
            const sourceY = source.position.y + (source.type === 'department' ? 32 : 48);
            const targetX = target.position.x + (target.type === 'department' ? 96 : 48);
            const targetY = target.position.y + (target.type === 'department' ? 32 : 48);

            return (
              <g key={edge.id}>
                <path
                  d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
                  className="stroke-slate-300"
                  strokeWidth={1.5}
                  fill="none"
                />
              </g>
            );
          })}
        </svg>

        {/* Draw nodes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {nodes.map(node => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: node.position.x,
                top: node.position.y,
                zIndex: node.type === 'department' ? 10 : 5
              }}
            >
              {node.type === 'department' ?
                <DepartmentNode data={node.data} /> :
                <EmployeeNode data={node.data} />
              }
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col bg-white rounded-md shadow-md">
          <button className="p-2 hover:bg-slate-100 rounded-t-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>
          <button className="p-2 hover:bg-slate-100 border-t border-slate-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-b-md border-t border-slate-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 12h.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo component with sample data
const EmployeeStatusDashboard = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Development Team",
      employees: [
        { id: 1, name: "Alex Kim", status: "AT_WORKSPACE" },
        { id: 2, name: "Jamie Smith", status: "NOT_AT_WORKSPACE" },
        { id: 3, name: "Morgan Lee", status: "BUSINESS_TRIP_PLANNED" },
        { id: 4, name: "Taylor Doe", status: "VACATION_PLANNED" },
        { id: 5, name: "Jordan Park", status: "AT_WORKSPACE" },

        { id: 6, name: "Casey Green", status: "AT_WORKSPACE", avatarUrl: "https://www.claudeusercontent.com/api/placeholder/150/150" },
        { id: 7, name: "Riley Brown", status: "BUSINESS_TRIP_PLANNED", avatarUrl: "https://www.claudeusercontent.com/api/placeholder/150/150" },
        { id: 8, name: "Quinn Jones", status: "NOT_AT_WORKSPACE", avatarUrl: "https://www.claudeusercontent.com/api/placeholder/150/150" }

      ]
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 ">Department Status Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'grid' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('grid')}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Grid View
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'network' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('network')}
        >
          <Network className="w-4 h-4 mr-2" />
          Network View
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'grid' ? (
        <div className="grid grid-cols-1 gap-6">
          {departments.map(department => (
            <Department key={department.id} name={department.name} employees={department.employees} />
          ))}
        </div>
      ) : (
        <NetworkView departments={departments} />
      )}

      <div className="mt-8  p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-green-500 border-solid border-4 mr-2"></div>
            <span className="text-sm">At Workspace</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-gray-400 border-solid border-4 mr-2"></div>
            <span className="text-sm">Not at Workspace</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-blue-400 border-dashed border-4 mr-2"></div>
            <span className="text-sm">Business Trip Planned</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-yellow-400 border-dotted border-4 mr-2"></div>
            <span className="text-sm">Vacation Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatusDashboard;
