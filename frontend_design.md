# AI-Powered Enterprise Collaboration Platform
# Authenticated Frontend Design (MVP)

---

# Overview

This document defines the frontend structure, pages, components, layouts, navigation, and user experience for the authenticated section of the platform.

The frontend should be built using:

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

The design should feel like a modern enterprise application similar to **Notion**, **Linear**, **Slack**, and **Microsoft Teams**.

---

# Layout Structure

```text
---------------------------------------------------------
|                     Top Navigation                    |
---------------------------------------------------------
| Sidebar |             Main Content                   |
|         |                                            |
|         |                                            |
|         |                                            |
---------------------------------------------------------
```

---

# Navigation

## Sidebar

### Workspace

- Dashboard
- Projects
- Documents
- Workflows
- AI Assistant
- Search

---

### Organization

- Teams
- Departments
- Members

---

### Administration

(Admin only)

- Users
- Roles
- Audit Logs
- Analytics
- Settings

---

### Bottom Section

- Notifications
- Profile
- Logout

---

# Top Navigation

Contains

- Workspace Switcher
- Global Search
- Notifications
- AI Quick Chat
- User Avatar

---

# Layout Hierarchy

```text
AuthenticatedLayout

├── Sidebar
├── Topbar
├── Notification Center
├── Main Content
└── Floating AI Assistant
```

---

# Pages

---

# 1. Dashboard

Route

```text
/dashboard
```

Widgets

- Welcome Card
- Recent Documents
- Recent Activities
- Pending Workflows
- Team Overview
- AI Suggestions
- Quick Actions

Quick Actions

- Upload Document
- Create Project
- Invite Member
- Ask AI

---

# 2. Projects

Route

```text
/projects
```

Features

- Grid View
- List View
- Search
- Filter
- Sort

Project Card

- Name
- Description
- Members
- Status
- Documents
- Last Updated

Actions

- Open
- Edit
- Archive
- Delete

---

# 3. Project Details

Route

```text
/projects/:id
```

Sections

- Overview
- Documents
- Members
- Activity
- Workflows

Tabs

```text
Overview

Documents

Members

Activity

Settings
```

---

# 4. Documents

Route

```text
/documents
```

Features

- Upload
- Search
- Filter
- Sort
- Preview

Views

- Grid
- Table

Actions

- Download
- Rename
- Delete
- Move
- Share
- View History

---

# 5. Document Viewer

Route

```text
/documents/:id
```

Layout

```text
---------------------------------------
Toolbar

---------------------------------------

Document Preview

---------------------------------------

Right Sidebar

AI Summary

Metadata

Versions

Activity
```

Toolbar

- Download
- Share
- Delete
- Version History

---

# 6. AI Assistant

Route

```text
/ai
```

Layout

```text
Chat Window

↓

Message History

↓

Suggested Questions
```

Capabilities

- Summarize document
- Explain policy
- Compare documents
- Search documents

---

# 7. Search

Route

```text
/search
```

Features

Global Search

Results

- Documents
- Projects
- Users

Filters

- Type
- Department
- Project
- Date

---

# 8. Workflow Board

Route

```text
/workflows
```

Kanban Columns

```text
Draft

Pending

Approved

Rejected

Completed
```

Workflow Card

- Title
- Status
- Assigned To
- Due Date

---

# 9. Audit Logs

Route

```text
/audit
```

Table

Columns

- User
- Action
- Resource
- Time
- Status

Filters

- User
- Date
- Action

---

# 10. Notifications

Route

```text
/notifications
```

Types

- Document Shared
- Approval Request
- Permission Change
- Mention
- AI Recommendation

---

# 11. Organization Members

Route

```text
/members
```

Table

Columns

- Avatar
- Name
- Email
- Role
- Department
- Status

Actions

- Edit
- Remove
- Change Role

---

# 12. Roles & Permissions

(Admin)

Route

```text
/admin/roles
```

Features

- Create Role
- Assign Permission
- Edit Role
- Delete Role

---

# 13. Analytics

(Admin)

Route

```text
/admin/analytics
```

Cards

- Users
- Documents
- Projects
- Storage
- AI Usage

Charts

- Activity Timeline
- Upload Trends
- Active Users

---

# 14. Settings

Route

```text
/settings
```

Tabs

- Profile
- Organization
- Notifications
- Security

---

# Reusable Components

## Layout

```text
Sidebar

Topbar

Page Header

Breadcrumb

Footer
```

---

## Cards

- Dashboard Card
- Project Card
- Document Card
- Activity Card
- AI Suggestion Card
- Analytics Card

---

## Tables

- Users Table
- Documents Table
- Audit Table
- Workflows Table

---

## Forms

- Upload Form
- Create Project
- Invite Member
- Workflow Form

---

## Modals

- Delete Confirmation
- Share Document
- Create Folder
- Invite User
- Edit Project

---

## Buttons

- Primary
- Secondary
- Danger
- Ghost
- Icon Button

---

## Badges

- Role
- Status
- Workflow
- Document Type

---

## Dialogs

- AI Chat
- Notifications
- User Profile

---

# Global Search

Accessible from

Top Navigation

Supports

- Documents
- Projects
- Members

Shortcut

```text
Ctrl + K
```

---

# AI Assistant

Floating Button

Bottom Right

Click

↓

Opens Chat Drawer

Questions

- Summarize
- Explain
- Search
- Help

---

# Notification Drawer

Right Side Panel

Contains

- Recent Notifications
- Mentions
- Approval Requests

---

# Dashboard Widgets

Recent Documents

Recent Activities

Pending Approvals

Storage Usage

Projects

AI Suggestions

---

# User Menu

Avatar Menu

- Profile
- Settings
- Notifications
- Logout

---

# Loading States

Every page should include

- Skeleton Loading
- Empty State
- Error State

---

# Responsive Design

Desktop

Sidebar Expanded

Tablet

Sidebar Collapsed

Mobile

Drawer Navigation

---

# Theme

Support

- Light Mode
- Dark Mode

---

# Folder Structure

```text
frontend/

app/

components/

features/

auth/

dashboard/

projects/

documents/

search/

workflows/

ai/

audit/

notifications/

members/

admin/

settings/

shared/

hooks/

services/

types/

lib/

styles/
```

---

# UI Libraries

- shadcn/ui
- Lucide Icons
- React Hook Form
- TanStack Query
- Recharts
- React PDF
- Sonner (Toasts)

---

# State Management

Server State

- TanStack Query

Client State

- React Context
- useState

Forms

- React Hook Form

---

# MVP Pages Checklist

## Authentication

- [ ] Login
- [ ] Organization Selection

---

## Dashboard

- [ ] Dashboard Overview
- [ ] Recent Activities
- [ ] AI Suggestions

---

## Projects

- [ ] Project List
- [ ] Project Details

---

## Documents

- [ ] Upload
- [ ] Document List
- [ ] Document Viewer

---

## AI

- [ ] AI Chat
- [ ] AI Summary

---

## Workflows

- [ ] Workflow Board
- [ ] Approval Page

---

## Organization

- [ ] Members
- [ ] Roles

---

## Admin

- [ ] Audit Logs
- [ ] Analytics

---

## Settings

- [ ] Profile
- [ ] Organization Settings
- [ ] Security

---

# MVP Demo Flow

1. User logs in with Clerk.
2. Selects or creates an organization.
3. Lands on the Dashboard showing recent activity and quick actions.
4. Creates a new Project.
5. Uploads a PDF document into the project.
6. Opens the Document Viewer and requests an AI summary.
7. Starts a document approval workflow.
8. An approver reviews and approves the workflow.
9. Admin checks the Audit Logs to verify all actions.
10. User receives a real-time notification confirming workflow completion.

---

# Future Enhancements (Post-MVP)

- Real-time collaborative document editing
- AI-powered permission recommendations
- Drag-and-drop workflow builder
- Team chat and comments
- Calendar integration
- Advanced analytics dashboards
- Offline support
- Mobile application
- Multi-language support
- Custom organization branding