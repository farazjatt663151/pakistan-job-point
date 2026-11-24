export type JobCategory = 'Government' | 'Private';

export type EducationLevel =
  | 'Primary'
  | 'Matric'
  | 'Intermediate'
  | 'Bachelor'
  | 'Master';

export type CityName =
  | 'Karachi'
  | 'Lahore'
  | 'Islamabad'
  | 'Rawalpindi'
  | 'Peshawar'
  | 'Quetta'
  | 'Multan'
  | 'Faisalabad'
  | 'Other Cities';

export type SortOption = 'latest' | 'deadline' | 'vacancies' | 'title';

export interface JobListing {
  id: string;
  slug: string;
  title: string;
  category: JobCategory;
  department: string;
  city: CityName;
  education: EducationLevel;
  salary: string;
  ageLimit: string;
  vacancies: number;
  deadline: string; // ISO YYYY-MM-DD
  postedDate: string; // ISO YYYY-MM-DD
  description: string;
  applicationProcedure: string[];
  officialApplyUrl: string;
  isDemo: boolean;
  featured?: boolean;
}

export interface JobFilters {
  query: string;
  category: 'All' | JobCategory;
  city: 'All' | CityName;
  education: 'All' | EducationLevel;
  sortBy: SortOption;
}

export const MAJOR_CITIES: CityName[] = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Other Cities',
];

export const EDUCATION_LEVELS: EducationLevel[] = [
  'Primary',
  'Matric',
  'Intermediate',
  'Bachelor',
  'Master',
];
