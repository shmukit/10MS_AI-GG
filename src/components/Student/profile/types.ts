export interface ProfileEditForm {
  first_name: string;
  last_name: string;
  degree: string;
  subject: string;
  year: string;
  institute: string;
}

export interface ProfileData {
  profile: any;
  userData: any;
  [key: string]: any;
}

export const DEFAULT_EDIT_FORM: ProfileEditForm = {
  first_name: '',
  last_name: '',
  degree: '',
  subject: '',
  year: '',
  institute: '',
};
