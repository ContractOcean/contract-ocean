export interface Contract {
  id: string;
  name: string;
  counterparty: string;
  owner: string;
  category: string;
  status: 'draft' | 'in_review' | 'sent' | 'awaiting_signature' | 'signed' | 'completed' | 'expiring_soon' | 'archived';
  createdDate: string;
  lastUpdated: string;
  expiryDate: string;
  value: number;
  signatureStatus: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  tags: string[];
  contractCount: number;
  status: 'active' | 'inactive';
  lastActivity: string;
  avatar?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  estimatedTime: string;
  popular: boolean;
  recommended: boolean;
  usageCount: number;
}

export const contracts: Contract[] = [
  { id: 'CON-001', name: 'Master Service Agreement', counterparty: 'Meridian Technologies Ltd', owner: 'Sarah Chen', category: 'Service', status: 'signed', createdDate: '2026-01-15', lastUpdated: '2026-03-10', expiryDate: '2027-01-15', value: 128000, signatureStatus: 'Completed' },
  { id: 'CON-002', name: 'Software License Agreement', counterparty: 'CloudVault Inc.', owner: 'James Okafor', category: 'Sales', status: 'awaiting_signature', createdDate: '2026-03-01', lastUpdated: '2026-03-18', expiryDate: '2027-03-01', value: 45000, signatureStatus: '1 of 2 signed' },
  { id: 'CON-003', name: 'Non-Disclosure Agreement', counterparty: 'Apex Consulting Group', owner: 'Sarah Chen', category: 'NDA', status: 'draft', createdDate: '2026-03-15', lastUpdated: '2026-03-20', expiryDate: '2027-03-15', value: 0, signatureStatus: 'Not sent' },
  { id: 'CON-004', name: 'Employment Contract — Senior Engineer', counterparty: 'David Park', owner: 'Maria Santos', category: 'Employment', status: 'sent', createdDate: '2026-03-12', lastUpdated: '2026-03-19', expiryDate: '2027-03-12', value: 95000, signatureStatus: 'Sent to counterparty' },
  { id: 'CON-005', name: 'Vendor Supply Agreement', counterparty: 'GreenLeaf Materials Co.', owner: 'James Okafor', category: 'Vendor', status: 'completed', createdDate: '2025-09-20', lastUpdated: '2026-02-28', expiryDate: '2026-09-20', value: 320000, signatureStatus: 'Completed' },
  { id: 'CON-006', name: 'Marketing Partnership Agreement', counterparty: 'BrightWave Digital', owner: 'Sarah Chen', category: 'Partnership', status: 'in_review', createdDate: '2026-03-08', lastUpdated: '2026-03-21', expiryDate: '2027-03-08', value: 72000, signatureStatus: 'Under review' },
  { id: 'CON-007', name: 'Freelancer Services Agreement', counterparty: 'Lena Kovacs', owner: 'Maria Santos', category: 'Freelancer', status: 'expiring_soon', createdDate: '2025-04-01', lastUpdated: '2026-03-15', expiryDate: '2026-04-01', value: 18000, signatureStatus: 'Completed' },
  { id: 'CON-008', name: 'Office Lease Agreement', counterparty: 'Metro Property Holdings', owner: 'James Okafor', category: 'Operations', status: 'signed', createdDate: '2025-06-15', lastUpdated: '2026-01-10', expiryDate: '2028-06-15', value: 540000, signatureStatus: 'Completed' },
  { id: 'CON-009', name: 'Consulting Engagement Letter', counterparty: 'Stratton Advisory', owner: 'Sarah Chen', category: 'Consulting', status: 'draft', createdDate: '2026-03-19', lastUpdated: '2026-03-21', expiryDate: '2026-09-19', value: 35000, signatureStatus: 'Not sent' },
  { id: 'CON-010', name: 'Data Processing Agreement', counterparty: 'SecureNet Solutions', owner: 'Maria Santos', category: 'Service', status: 'awaiting_signature', createdDate: '2026-03-05', lastUpdated: '2026-03-20', expiryDate: '2027-03-05', value: 0, signatureStatus: '0 of 2 signed' },
  { id: 'CON-011', name: 'Sales Distribution Agreement', counterparty: 'Pacific Trade Group', owner: 'James Okafor', category: 'Sales', status: 'signed', createdDate: '2026-02-01', lastUpdated: '2026-03-14', expiryDate: '2027-02-01', value: 210000, signatureStatus: 'Completed' },
  { id: 'CON-012', name: 'Creative Services Agreement', counterparty: 'Studio Neon', owner: 'Sarah Chen', category: 'Marketing', status: 'sent', createdDate: '2026-03-10', lastUpdated: '2026-03-18', expiryDate: '2026-12-31', value: 28000, signatureStatus: 'Sent to counterparty' },
];

export const contacts: Contact[] = [
  { id: 'CT-001', name: 'Rachel Morrison', email: 'rachel@meridiantech.com', role: 'VP of Operations', company: 'Meridian Technologies Ltd', phone: '+1 (415) 555-0142', tags: ['Client', 'Enterprise'], contractCount: 4, status: 'active', lastActivity: '2026-03-18' },
  { id: 'CT-002', name: 'Tom Nakamura', email: 'tom.n@cloudvault.io', role: 'Head of Procurement', company: 'CloudVault Inc.', phone: '+1 (650) 555-0198', tags: ['Client', 'SaaS'], contractCount: 2, status: 'active', lastActivity: '2026-03-20' },
  { id: 'CT-003', name: 'Amara Obi', email: 'amara@apexconsulting.com', role: 'Managing Partner', company: 'Apex Consulting Group', phone: '+1 (212) 555-0267', tags: ['Partner', 'Consulting'], contractCount: 3, status: 'active', lastActivity: '2026-03-15' },
  { id: 'CT-004', name: 'David Park', email: 'david.park@email.com', role: 'Senior Engineer', company: 'Individual', phone: '+1 (310) 555-0134', tags: ['Employee', 'Engineering'], contractCount: 1, status: 'active', lastActivity: '2026-03-19' },
  { id: 'CT-005', name: 'Elena Fischer', email: 'elena@greenleaf.co', role: 'Supply Chain Director', company: 'GreenLeaf Materials Co.', phone: '+49 30 555-0321', tags: ['Vendor', 'Materials'], contractCount: 5, status: 'active', lastActivity: '2026-02-28' },
  { id: 'CT-006', name: 'Marcus Webb', email: 'marcus@brightwavedigital.com', role: 'CEO', company: 'BrightWave Digital', phone: '+1 (512) 555-0189', tags: ['Partner', 'Marketing'], contractCount: 2, status: 'active', lastActivity: '2026-03-21' },
  { id: 'CT-007', name: 'Lena Kovacs', email: 'lena.kovacs@freelance.dev', role: 'UX/UI Designer', company: 'Freelancer', phone: '+36 1 555-0456', tags: ['Freelancer', 'Design'], contractCount: 1, status: 'active', lastActivity: '2026-03-15' },
  { id: 'CT-008', name: 'Robert Chen', email: 'r.chen@metroproperty.com', role: 'Leasing Manager', company: 'Metro Property Holdings', phone: '+1 (415) 555-0277', tags: ['Vendor', 'Real Estate'], contractCount: 1, status: 'inactive', lastActivity: '2026-01-10' },
];

export const templates: Template[] = [
  { id: 'TPL-001', name: 'Master Service Agreement', category: 'Service', description: 'Comprehensive agreement for ongoing service relationships. Covers scope, SLAs, payment terms, and liability.', useCase: 'When engaging a vendor or client for recurring professional services', estimatedTime: '15 min', popular: true, recommended: true, usageCount: 2847 },
  { id: 'TPL-002', name: 'Mutual Non-Disclosure Agreement', category: 'NDA', description: 'Two-way confidentiality agreement protecting both parties\' proprietary information and trade secrets.', useCase: 'Before sharing sensitive business information with potential partners or vendors', estimatedTime: '5 min', popular: true, recommended: false, usageCount: 4213 },
  { id: 'TPL-003', name: 'Software-as-a-Service Agreement', category: 'Sales', description: 'License agreement for cloud-based software products covering access rights, data handling, and uptime guarantees.', useCase: 'When licensing your SaaS product to business customers', estimatedTime: '20 min', popular: true, recommended: true, usageCount: 1956 },
  { id: 'TPL-004', name: 'Employment Offer Letter', category: 'Employment', description: 'Formal employment offer including compensation, benefits, start date, and at-will terms.', useCase: 'Extending a job offer to a new full-time employee', estimatedTime: '10 min', popular: false, recommended: false, usageCount: 1432 },
  { id: 'TPL-005', name: 'Independent Contractor Agreement', category: 'Freelancer', description: 'Agreement establishing an independent contractor relationship with clear scope, deliverables, and payment milestones.', useCase: 'Hiring freelancers or contractors for project-based work', estimatedTime: '12 min', popular: true, recommended: true, usageCount: 3105 },
  { id: 'TPL-006', name: 'Consulting Engagement Letter', category: 'Consulting', description: 'Professional engagement letter for consulting services with scope definition, fees, and confidentiality terms.', useCase: 'Retaining a consulting firm or individual consultant', estimatedTime: '10 min', popular: false, recommended: false, usageCount: 987 },
  { id: 'TPL-007', name: 'Vendor Supply Agreement', category: 'Vendor', description: 'Supply agreement for goods or materials covering pricing, delivery schedules, quality standards, and warranties.', useCase: 'Establishing a supply relationship with a materials vendor', estimatedTime: '18 min', popular: false, recommended: true, usageCount: 856 },
  { id: 'TPL-008', name: 'Strategic Partnership Agreement', category: 'Partnership', description: 'Framework for business partnerships including revenue sharing, responsibilities, IP rights, and exit provisions.', useCase: 'Formalizing a strategic business partnership or joint venture', estimatedTime: '25 min', popular: false, recommended: false, usageCount: 634 },
  { id: 'TPL-009', name: 'Marketing Services Agreement', category: 'Marketing', description: 'Agreement for marketing agency engagements covering campaign scope, deliverables, usage rights, and performance metrics.', useCase: 'Engaging a marketing agency for campaigns or brand work', estimatedTime: '15 min', popular: false, recommended: false, usageCount: 723 },
  { id: 'TPL-010', name: 'Equipment Lease Agreement', category: 'Operations', description: 'Lease terms for business equipment including maintenance responsibilities, insurance, and return conditions.', useCase: 'Leasing equipment, machinery, or technology assets', estimatedTime: '12 min', popular: false, recommended: false, usageCount: 412 },
  { id: 'TPL-011', name: 'Sales Commission Agreement', category: 'Sales', description: 'Commission structure agreement for sales representatives defining territories, quotas, rates, and payment timing.', useCase: 'Setting up commission terms for sales team members or reps', estimatedTime: '10 min', popular: false, recommended: false, usageCount: 567 },
  { id: 'TPL-012', name: 'Statement of Work', category: 'Service', description: 'Detailed project scope document defining deliverables, timelines, acceptance criteria, and change management.', useCase: 'Defining specific project work under an existing MSA', estimatedTime: '15 min', popular: true, recommended: true, usageCount: 2341 },
];

export const activityFeed = [
  { id: 1, action: 'signed', description: 'Master Service Agreement was signed by Meridian Technologies', time: '2 hours ago', icon: 'check' },
  { id: 2, action: 'sent', description: 'Employment Contract sent to David Park for signature', time: '4 hours ago', icon: 'send' },
  { id: 3, action: 'created', description: 'New NDA draft created for Apex Consulting Group', time: '6 hours ago', icon: 'plus' },
  { id: 4, action: 'comment', description: 'Sarah Chen commented on Marketing Partnership Agreement', time: '1 day ago', icon: 'message' },
  { id: 5, action: 'expiring', description: 'Freelancer Services Agreement with Lena Kovacs expires in 11 days', time: '1 day ago', icon: 'alert' },
  { id: 6, action: 'signed', description: 'Sales Distribution Agreement fully executed with Pacific Trade Group', time: '2 days ago', icon: 'check' },
];

export const chartData = {
  contractsOverTime: [
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 12 },
    { month: 'Dec', count: 9 },
    { month: 'Jan', count: 15 },
    { month: 'Feb', count: 11 },
    { month: 'Mar', count: 18 },
  ],
  contractsByCategory: [
    { category: 'Service', count: 28, value: 540000 },
    { category: 'Sales', count: 22, value: 890000 },
    { category: 'Employment', count: 15, value: 320000 },
    { category: 'NDA', count: 34, value: 0 },
    { category: 'Vendor', count: 12, value: 720000 },
    { category: 'Consulting', count: 8, value: 180000 },
  ],
  signatureTurnaround: [
    { month: 'Oct', days: 4.2 },
    { month: 'Nov', days: 3.8 },
    { month: 'Dec', days: 5.1 },
    { month: 'Jan', days: 3.5 },
    { month: 'Feb', days: 2.9 },
    { month: 'Mar', days: 2.4 },
  ],
};

export const dashboardStats = {
  totalContracts: 47,
  drafts: 8,
  awaitingSignature: 5,
  signedThisMonth: 12,
  expiringSoon: 3,
  totalValue: '$2.4M',
  completionRate: 87,
  avgTurnaround: '2.4 days',
};

export const teamMembers = [
  { id: 'TM-001', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin', avatar: '', contractsOwned: 14, lastActive: '2026-03-21' },
  { id: 'TM-002', name: 'James Okafor', email: 'james@company.com', role: 'Manager', avatar: '', contractsOwned: 11, lastActive: '2026-03-21' },
  { id: 'TM-003', name: 'Maria Santos', email: 'maria@company.com', role: 'Member', avatar: '', contractsOwned: 8, lastActive: '2026-03-20' },
  { id: 'TM-004', name: 'Alex Turner', email: 'alex@company.com', role: 'Member', avatar: '', contractsOwned: 5, lastActive: '2026-03-19' },
];
