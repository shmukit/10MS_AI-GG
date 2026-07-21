import React from 'react';
import { BookOpen, Calendar, GraduationCap, Mail, MapPin } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import {
  displayValue,
  inputClass,
  inputDisabledClass,
  readOnlyBadgeClass,
} from './profileUtils';
import type { ProfileData, ProfileEditForm } from './types';

interface ProfileFormFieldsProps {
  profileData: ProfileData | null;
  user: User | null;
  isEditing: boolean;
  editForm: ProfileEditForm;
  onInputChange: (field: string, value: string) => void;
  fullNameDisplay: { firstName: string; lastName: string };
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profileData,
  user,
  isEditing,
  editForm,
  onInputChange,
  fullNameDisplay,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-6">
      <div className="flex items-start gap-3 min-w-0">
        <BookOpen className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Full Name</p>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={editForm.first_name}
                onChange={(e) => onInputChange('first_name', e.target.value)}
                className={`${inputClass} min-w-0`}
                placeholder="First Name"
              />
              <input
                type="text"
                value={editForm.last_name}
                onChange={(e) => onInputChange('last_name', e.target.value)}
                className={`${inputClass} min-w-0`}
                placeholder="Last Name"
              />
            </div>
          ) : (
            <p className="font-medium text-foreground">
              {fullNameDisplay.firstName} {fullNameDisplay.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 min-w-0">
        <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Degree</p>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={editForm.degree}
                onChange={(e) => onInputChange('degree', e.target.value)}
                className={`${inputClass} min-w-0`}
                placeholder="Degree"
              />
              <input
                type="text"
                value={editForm.subject}
                onChange={(e) => onInputChange('subject', e.target.value)}
                className={`${inputClass} min-w-0`}
                placeholder="Subject"
              />
            </div>
          ) : (
            <p className="font-medium text-foreground">
              {[profileData?.profile?.degree, profileData?.profile?.subject].filter((part) => part?.trim()).join(' ') || 'Not set'}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 min-w-0">
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Academic Institute</p>
          {isEditing ? (
            <input
              type="text"
              value={editForm.institute}
              onChange={(e) => onInputChange('institute', e.target.value)}
              className={inputClass}
              placeholder="Institute"
            />
          ) : (
            <p className="font-medium text-foreground">{displayValue(profileData?.profile?.institute)}</p>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="flex items-start gap-3 min-w-0">
        <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Email Address</p>
          {isEditing ? (
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                className={inputDisabledClass}
                placeholder="Email"
                disabled
              />
              <div className={readOnlyBadgeClass}>Read-only</div>
            </div>
          ) : (
            <p className="font-medium text-foreground">{user?.email || 'email@example.com'}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 min-w-0">
        <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Year of Study</p>
          {isEditing ? (
            <select
              value={editForm.year}
              onChange={(e) => onInputChange('year', e.target.value)}
              className={inputClass}
            >
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="5th">5th Year</option>
            </select>
          ) : (
            <p className="font-medium text-foreground">
              {profileData?.profile?.year ? `${profileData.profile.year} Year` : 'Not set'}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 min-w-0">
        <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Enrollment Date</p>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                value={
                  profileData?.profile?.enrollment_date
                    ? new Date(profileData.profile.enrollment_date).toISOString().split('T')[0]
                    : ''
                }
                className={inputDisabledClass}
                disabled
              />
              <div className={readOnlyBadgeClass}>Read-only</div>
            </div>
          ) : (
            <p className="font-medium text-foreground">
              {profileData?.profile?.enrollment_date
                ? new Date(profileData.profile.enrollment_date).toLocaleDateString()
                : 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
