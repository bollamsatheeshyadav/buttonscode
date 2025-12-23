import * as React from 'react';
import { Modal } from '@fluentui/react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';

import UserForm from './UserForm';
import EmployeeForm from './EmployeeForm';
import StudentForm from './StudentForm';

export interface IHelloWorldState {
  activeForm: 'user' | 'employee' | 'student' | null;
}

export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {

  constructor(props: IHelloWorldProps) {
    super(props);
    this.state = { activeForm: null };
  }

  private closeModal = () => {
    this.setState({ activeForm: null });
  };

  private renderForm() {
    switch (this.state.activeForm) {
      case 'user':
        return <UserForm context={this.props.context} onClose={this.closeModal} />;
      case 'employee':
        return <EmployeeForm context={this.props.context} onClose={this.closeModal} />;
      case 'student':
        return <StudentForm context={this.props.context} onClose={this.closeModal} />;
      default:
        return null;
    }
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <>
        {/* DASHBOARD */}
        <div className={styles.cardGrid}>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'user' })}>
            User Form
          </div>

          <div className={styles.card} onClick={() => this.setState({ activeForm: 'employee' })}>
            Employee Form
          </div>

          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
          <div className={styles.card} onClick={() => this.setState({ activeForm: 'student' })}>
            Student Form
          </div>
        </div>

        {/* FOREGROUND MODAL */}
        <Modal
          isOpen={this.state.activeForm !== null}
          onDismiss={this.closeModal}
          isBlocking={true}
        >
          <div className={styles.modalContent}>
            {this.renderForm()}
          </div>
        </Modal>
      </>
    );
  }
}
