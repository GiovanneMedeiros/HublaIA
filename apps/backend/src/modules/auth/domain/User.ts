/**
 * Auth Domain - Entidades e Value Objects
 */

import { Entity } from '@shared/domain/Entity';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { UserRole, UserStatus } from '@shared/domain/enums';

interface UserProps {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  tenantId: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: Omit<UserProps, 'createdAt'>, id?: UniqueEntityID): User {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
    return user;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified || false;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  updateLastLogin(): void {
    this.props.lastLogin = new Date();
  }

  validate(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      this.props.email &&
      emailRegex.test(this.props.email) &&
      this.props.firstName &&
      this.props.firstName.length > 0 &&
      this.props.passwordHash &&
      this.props.passwordHash.length > 0
    );
  }
}
