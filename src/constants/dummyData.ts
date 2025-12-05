// src/constants/dummyData.ts

// Home Screen
export const steps = [
  {
    id: 1,
    title: 'Sign Up',
    desc: 'Create your account in less than a minute with just your basic details.',
    btnText: 'Sign Up Now',
    icon: 'user-plus',
  },
  {
    id: 2,
    title: 'Select PG Room',
    desc: 'Browse through our verified PG listings and choose your perfect room.',
    btnText: 'Browse Rooms',
    icon: 'home',
  },
  {
    id: 3,
    title: 'Pay Rent Online',
    desc: 'Secure online payment with multiple options. No hidden charges.',
    btnText: 'Pay Now',
    icon: 'credit-card',
  },
];

export const whyChooseUs = [
  {
    title: 'Why We Exist',
    desc: 'Our company stands out for quality, trust, and innovation. We ensure every client receives the best service experience possible.',
  },
  {
    title: 'Our Mission',
    desc: 'To deliver innovative and reliable solutions that help our customers grow and achieve their goals.',
  },
  {
    title: 'Our Vision',
    desc: 'To be the leading brand in our industry, recognized for excellence, integrity, and customer satisfaction.',
  },
];

// Profile Menu
export const menuItems = [
  { id: 1, title: 'Update Profile', icon: 'user', navKey: 'ProfileScreen' },
  {
    id: 2,
    title: 'Change Password',
    icon: 'lock',
    navKey: 'ChangePasswordScreen',
  },
  {
    id: 3,
    title: 'Enquiry',
    icon: 'list',
    navKey: 'ENQUIRY',
  },
  {
    id: 4,
    title: 'Privacy Policy',
    icon: 'shield',
    navKey: 'PrivacyPolicyScreen',
  },
  {
    id: 5,
    title: 'Terms & Conditions',
    icon: 'file-text',
    navKey: 'TermsConditionsScreen',
  },
  {
    id: 6,
    title: 'Share App',
    icon: 'share-alt',
    navKey: 'SHARE_APP',
  },
];

// Any other dummy data
export const exampleDropdownOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

// Dropdown Options
export const dropdownOptions = {
  pgForOptions: [
    { label: 'Boys', value: 'Boys' },
    { label: 'Girls', value: 'Girls' },
  ],

  furnitureOptions: [
    { label: 'Fully Furnished', value: 'Full Furnished' },
    { label: 'Semi Furnished', value: 'Semi Furnished' },
    { label: 'Unfurnished', value: 'Unfurnished' },
  ],

  parkingOptions: ['2 Wheeler', '4 Wheeler', 'No Parking'],

  noticePeriodOptions: [
    { label: 'No Notice Period', value: '0' },
    { label: '15 Days', value: '15' },
    { label: '30 Days', value: '30' },
  ],

  lockInPeriodOptions: [
    { label: 'No Notice Period', value: '0' },
    { label: '15 Days', value: '15' },
    { label: '30 Days', value: '30' },
  ],
};

// Upload Items
export const uploadItems = [
  { key: 'mainPicture', label: 'Main Picture (Single)' },
  { key: 'livingRoom', label: 'Living Room (Multiple)' },
  { key: 'bedroom', label: 'Bedroom (Multiple)' },
  { key: 'kitchen', label: 'Kitchen (Multiple)' },
  { key: 'bathroom', label: 'Bathroom (Multiple)' },
  { key: 'floorplan', label: 'Floorplan (Multiple)' },
  { key: 'extraImages', label: 'Extra Images (Multiple)' },
  { key: 'video', label: 'Video (Single)' },
];

// Status Options
export const statusList = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Rejected', value: 'Rejected' },
];
