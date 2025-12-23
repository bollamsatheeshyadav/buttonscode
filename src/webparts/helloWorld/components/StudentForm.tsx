import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IStudentFormProps {
  context: WebPartContext;   // ✅ REQUIRED
  onClose: () => void;
}

const StudentForm: React.FC<IStudentFormProps> = ({ context, onClose }) => {

  return (
    <div>
      <h2>Student Details</h2>

      <input placeholder="Student Name" />
      <br /><br />

      <button>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default StudentForm;
