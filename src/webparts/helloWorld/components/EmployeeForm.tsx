import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IEmployeeFormProps {
  context: WebPartContext;   // ✅ ADD THIS
  onClose: () => void;
}

const EmployeeForm: React.FC<IEmployeeFormProps> = ({ context, onClose }) => {

  return (
    <div>
      <h2>Employee Details</h2>

      <input placeholder="Employee ID" />
      <br /><br />

      <button>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EmployeeForm;
