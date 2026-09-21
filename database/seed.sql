-- Sample Seed Data for College Placement Tracker (Local Development)

-- 1. SEED TEST USER (Password hash for "password123")
INSERT INTO users (id, name, email, password_hash, college, degree, graduation_year, skills, github_url, linkedin_url)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Rahul Sharma',
    'rahul.sharma@example.com',
    '$2a$10$76gXFqK1lT1o5U5l.k.QCe.hX7uV/rN0F5U7p9yK1v4T0j5U5l.k.',
    'Indian Institute of Technology',
    'B.Tech Computer Science',
    2026,
    ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Data Structures', 'Python'],
    'https://github.com/rahulsharma',
    'https://linkedin.com/in/rahulsharma'
)
ON CONFLICT (email) DO NOTHING;

-- 2. SEED SAMPLE COMPANIES
INSERT INTO companies (id, user_id, name, website, location, industry)
VALUES 
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Google', 'https://careers.google.com', 'Bengaluru, India', 'Technology'),
    ('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Microsoft', 'https://careers.microsoft.com', 'Hyderabad, India', 'Software'),
    ('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Amazon', 'https://amazon.jobs', 'Bengaluru, India', 'E-commerce & Cloud')
ON CONFLICT DO NOTHING;

-- 3. SEED SAMPLE APPLICATIONS
INSERT INTO applications (id, user_id, company_id, company_name, job_role, job_type, location, application_date, application_deadline, salary_package, status, notes)
VALUES 
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'Google',
        'Software Development Engineer (SDE-1)',
        'Full-Time',
        'Bengaluru',
        '2026-08-15',
        '2026-09-01',
        '₹18 LPA',
        'Interview',
        'Cleared OA on HackerEarth. Round 1 Technical scheduled.'
    ),
    (
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'Microsoft',
        'Software Engineer',
        'Full-Time',
        'Hyderabad',
        '2026-08-20',
        '2026-09-05',
        '₹16 LPA',
        'Online Assessment',
        'Completed online assessment on 25th Aug.'
    ),
    (
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'Amazon',
        'SDE Intern',
        'Internship',
        'Bengaluru',
        '2026-09-01',
        '2026-09-25',
        '₹80,000/mo',
        'Applied',
        'Applied via Amazon university portal.'
    )
ON CONFLICT DO NOTHING;

-- 4. SEED SAMPLE INTERVIEWS
INSERT INTO interviews (id, application_id, user_id, interview_date, interview_type, round_number, status, result, notes)
VALUES 
    (
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '2026-09-25 14:00:00+05:30',
        'Technical',
        1,
        'Scheduled',
        'Pending',
        'Focus on Data Structures, Trees, Graphs, and Dynamic Programming.'
    )
ON CONFLICT DO NOTHING;
