-- ═══════════════════════════════════════════════════════════════════════
-- Contract Ocean — Seed Data (Templates)
-- Run AFTER schema.sql in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

insert into public.templates (name, category, description, use_case, estimated_time, popular, recommended, usage_count) values
  ('Master Service Agreement', 'Service', 'Comprehensive agreement for ongoing service relationships. Covers scope, SLAs, payment terms, and liability.', 'When engaging a vendor or client for recurring professional services', '15 min', true, true, 2847),
  ('Mutual Non-Disclosure Agreement', 'NDA', 'Two-way confidentiality agreement protecting both parties'' proprietary information and trade secrets.', 'Before sharing sensitive business information with potential partners or vendors', '5 min', true, false, 4213),
  ('Software-as-a-Service Agreement', 'Sales', 'License agreement for cloud-based software products covering access rights, data handling, and uptime guarantees.', 'When licensing your SaaS product to business customers', '20 min', true, true, 1956),
  ('Employment Offer Letter', 'Employment', 'Formal employment offer including compensation, benefits, start date, and at-will terms.', 'Extending a job offer to a new full-time employee', '10 min', false, false, 1432),
  ('Independent Contractor Agreement', 'Freelancer', 'Agreement establishing an independent contractor relationship with clear scope, deliverables, and payment milestones.', 'Hiring freelancers or contractors for project-based work', '12 min', true, true, 3105),
  ('Consulting Engagement Letter', 'Consulting', 'Professional engagement letter for consulting services with scope definition, fees, and confidentiality terms.', 'Retaining a consulting firm or individual consultant', '10 min', false, false, 987),
  ('Vendor Supply Agreement', 'Vendor', 'Supply agreement for goods or materials covering pricing, delivery schedules, quality standards, and warranties.', 'Establishing a supply relationship with a materials vendor', '18 min', false, true, 856),
  ('Strategic Partnership Agreement', 'Partnership', 'Framework for business partnerships including revenue sharing, responsibilities, IP rights, and exit provisions.', 'Formalizing a strategic business partnership or joint venture', '25 min', false, false, 634),
  ('Marketing Services Agreement', 'Marketing', 'Agreement for marketing agency engagements covering campaign scope, deliverables, usage rights, and performance metrics.', 'Engaging a marketing agency for campaigns or brand work', '15 min', false, false, 723),
  ('Equipment Lease Agreement', 'Operations', 'Lease terms for business equipment including maintenance responsibilities, insurance, and return conditions.', 'Leasing equipment, machinery, or technology assets', '12 min', false, false, 412),
  ('Sales Commission Agreement', 'Sales', 'Commission structure agreement for sales representatives defining territories, quotas, rates, and payment timing.', 'Setting up commission terms for sales team members or reps', '10 min', false, false, 567),
  ('Statement of Work', 'Service', 'Detailed project scope document defining deliverables, timelines, acceptance criteria, and change management.', 'Defining specific project work under an existing MSA', '15 min', true, true, 2341);
