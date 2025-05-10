import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface EmployeeData {
  name: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  vacation: string | null;
  businessTrip: string | null;
}

interface EmployeeNodeProps {
  data: EmployeeData;
  isConnectable: boolean;
}

export default memo(({ data, isConnectable }: EmployeeNodeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ishda':
        return '#4CAF50';
      case 'Ta\'tilda':
        return '#2196F3';
      case 'Xizmat safarida':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2" style={{ borderColor: getStatusColor(data.status) }}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <div className="font-bold">{data.name}</div>
      <div className="text-sm text-gray-700">Holat: {data.status}</div>

      {data.checkIn && data.checkOut && (
        <div className="text-xs text-gray-500">
          Ish vaqti: {data.checkIn} - {data.checkOut}
        </div>
      )}

      {data.vacation && (
        <div className="text-xs text-gray-500">
          Ta'til: {data.vacation}
        </div>
      )}

      {data.businessTrip && (
        <div className="text-xs text-gray-500">
          Xizmat safari: {data.businessTrip}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
});
