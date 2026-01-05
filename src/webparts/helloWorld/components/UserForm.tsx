import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from './UserForm.module.scss';

import {
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  DatePicker,
  MessageBar,
  MessageBarType,
  IconButton
} from '@fluentui/react';

/* 🔹 PnPjs v4 imports */
import { SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { SPHttpClient } from '@microsoft/sp-http';

/* 🔹 PROPS */
export interface IUserFormProps {
  context: WebPartContext;
  onClose: () => void;
}

/* 🔹 Passenger Row */
interface IRow {
  paxName: string;
  relationship: string;
}

/* 🔹 Form Data */
interface IFormData {
  NameofEmployee: string;
  StarEmployeeID: string;
  Department: string;
  PurposeofVisit: string;
  Date?: Date | null; // ✅ allow null
  Source: string;
  Destination: string;
}

const UserForm: React.FC<IUserFormProps> = ({ context, onClose }) => {

  /* 🔹 PnPjs SPFI instance */
  const [spInstance, setSpInstance] = React.useState<SPFI | null>(null);

  React.useEffect(() => {
    const spNew: SPFI = spfi().using(SPFx(context));
    setSpInstance(spNew);
  }, [context]);

  /* 🔹 Form State */
  const [formData, setFormData] = React.useState<IFormData>({
    NameofEmployee: '',
    StarEmployeeID: '',
    Department: '',
    PurposeofVisit: '',
    Date: undefined,
    Source: '',
    Destination: ''
  });

  /* 🔹 Passenger Rows */
  const [rows, setRows] = React.useState<IRow[]>([{ paxName: '', relationship: '' }]);

  /* 🔹 Messages */
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  /* 🔹 Load logged-in user details */
  React.useEffect(() => {
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
        SPHttpClient.configurations.v1
      )
      .then(res => res.json())
      .then(data => {
        const dept = data?.UserProfileProperties?.find((p: any) => p.Key === 'Department');
        setFormData(prev => ({
          ...prev,
          NameofEmployee: context.pageContext.user.displayName,
          Department: dept?.Value || ''
        }));
      })
      .catch(console.error);
  }, [context]);

  /* 🔹 Location dropdown options */
  const locationOptions: IDropdownOption[] = [
    'Belgum','Ahmedabad','Yapathi','BiAI','Hindon',
    'Surat','Nagpur','Pune','Kolhap','Lucknow',
    'Training Centre','HAL','Bangalore'
  ].map(l => ({ key: l, text: l }));

  /* 🔹 Passenger handlers */
  const addRow = () => setRows(prev => [...prev, { paxName: '', relationship: '' }]);
  const removeRow = (index: number) => setRows(prev => prev.filter((_, i) => i !== index));
  const updateRow = (index: number, field: keyof IRow, value: string) => {
    setRows(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* 🔹 Form change helpers */
const handleChange = (field: keyof IFormData, value: string | Date | null | undefined) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
  /* 🔹 Validation */
  const validate = (): boolean => {
    if (!formData.StarEmployeeID.trim()) { setError('Star Employee ID is required'); return false; }
    if (!formData.PurposeofVisit.trim()) { setError('Purpose of visit is required'); return false; }
    if (!formData.Date) { setError('Travel date is required'); return false; }
    if (!formData.Source || !formData.Destination) { setError('Source and Destination are required'); return false; }
    if (!rows.some(r => r.paxName.trim())) { setError('Add at least one passenger'); return false; }

    setError(null);
    return true;
  };

  /* 🔹 Submit */
  const submitForm = async () => {
    if (!validate()) return;
    if (!spInstance) return;

    try {
      for (const row of rows) {
        if (row.paxName.trim()) {
          await spInstance.web.lists.getByTitle('Staff On Leave').items.add({
            NameofEmployee: formData.NameofEmployee,
            StarEmployeeID: formData.StarEmployeeID,
            Department: formData.Department,
            PurposeofVisit: formData.PurposeofVisit,
            TravelDate: formData.Date,
            
            Source: formData.Source,
            Destination: formData.Destination,
            PaxName: row.paxName,
            RelationshipwithEmployee: row.relationship
          });
        }
      }

      setSuccess('Form submitted successfully');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1200);

    } catch (e) {
      console.error(e);
      setError('Error while submitting the form');
    }
  };

  /* 🔹 UI */
  return (
    <div className={styles.userForm}>
      <div className={styles.formBody}>
        <h2 className={styles.title}>User Travel Form</h2>

        {error && <MessageBar className={styles.message} messageBarType={MessageBarType.error}>{error}</MessageBar>}
        {success && <MessageBar className={styles.message} messageBarType={MessageBarType.success}>{success}</MessageBar>}

        <TextField label="Name of Employee" value={formData.NameofEmployee} disabled />
        <TextField label="Star Employee ID" required value={formData.StarEmployeeID} onChange={(_, v) => handleChange('StarEmployeeID', v)} />
        <TextField label="Department" value={formData.Department} disabled />
        <TextField label="Purpose of Visit" required multiline value={formData.PurposeofVisit} onChange={(_, v) => handleChange('PurposeofVisit', v)} />

        <DatePicker
  label="Travel Date"
  value={formData.Date ?? undefined} // convert null to undefined
  onSelectDate={d => handleChange('Date', d)} // d: Date | null | undefined
/>

        <Dropdown label="Source" options={locationOptions} selectedKey={formData.Source} onChange={(_, o) => handleChange('Source', o?.key as string)} />
        <Dropdown label="Destination" options={locationOptions} selectedKey={formData.Destination} onChange={(_, o) => handleChange('Destination', o?.key as string)} />

        <div className={styles.passengerTitle}>Passengers</div>
        {rows.map((row, i) => (
          <div key={i} className={styles.passengerRow}>
            <TextField placeholder="Passenger Name" value={row.paxName} onChange={(_, v) => updateRow(i, 'paxName', v || '')} />
            <TextField placeholder="Relationship" value={row.relationship} onChange={(_, v) => updateRow(i, 'relationship', v || '')} />
            {rows.length > 1 && <IconButton iconProps={{ iconName: 'Delete' }} title="Remove passenger" onClick={() => removeRow(i)} />}
          </div>
        ))}

        <DefaultButton className={styles.addPassenger} text="Add Passenger" iconProps={{ iconName: 'Add' }} onClick={addRow} />

        <div className={styles.footerActions}>
          <PrimaryButton text="Submit" onClick={submitForm} />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
