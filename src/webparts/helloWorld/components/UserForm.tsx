import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { TextField, PrimaryButton } from '@fluentui/react';

export interface IUserFormProps {
  context: WebPartContext;   // ✅ ADD THIS
  onClose: () => void;
}

const UserForm: React.FC<IUserFormProps> = (props) => {

  return (
    <div>
      <h2>User Details Form</h2>

      <TextField label="User Name" />
      <TextField label="Email" />

      <PrimaryButton text="Submit" />
      <PrimaryButton text="Close" onClick={props.onClose} />
    </div>
  );
};

export default UserForm;
