-- College Placement Tracker — Relational Database Schema (PostgreSQL)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college VARCHAR(255),
    degree VARCHAR(100),
    graduation_year INT,
    skills TEXT[] DEFAULT '{}',
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    location VARCHAR(150),
    industry VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_company UNIQUE (user_id, name)
);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    company_name VARCHAR(150) NOT NULL,
    job_role VARCHAR(150) NOT NULL,
    job_type VARCHAR(50) DEFAULT 'Full-Time',
    location VARCHAR(150),
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    application_deadline DATE,
    salary_package VARCHAR(100),
    job_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Interested',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_application_status CHECK (
        status IN (
            'Interested',
            'Applied',
            'Online Assessment',
            'Interview',
            'Selected',
            'Rejected',
            'Withdrawn'
        )
    )
);

-- 4. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_date TIMESTAMPTZ NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    round_number INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Scheduled',
    result VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_interview_type CHECK (
        interview_type IN (
            'Online Assessment',
            'Technical',
            'Coding',
            'System Design',
            'HR',
            'Managerial'
        )
    ),
    CONSTRAINT chk_interview_status CHECK (
        status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')
    ),
    CONSTRAINT chk_interview_result CHECK (
        result IN ('Passed', 'Failed', 'Pending', 'N/A')
    )
);

-- 5. DEADLINES / TASKS TABLE
CREATE TABLE IF NOT EXISTS deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    task_type VARCHAR(50) DEFAULT 'Application Deadline',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_deadline ON applications(application_deadline);
CREATE INDEX IF NOT EXISTS idx_interviews_app_id ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_user_id ON deadlines(user_id);
