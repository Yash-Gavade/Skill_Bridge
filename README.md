
# Skill Bridge
![skillbridge](https://github.com/user-attachments/assets/1f8b9208-b72f-4ca7-b073-24be457cb818)



## Introduction

Skill Bridge is an AI-powered consultant management platform designed to efficiently connect skilled consultants with the right projects. The platform solves the challenge of talent utilization and project staffing by using intelligent matching algorithms to align consultant skills with project requirements.

## Problem Statement

Organizations face significant challenges when staffing projects with the right consultants:

- *Inefficient Matching*: Traditional methods of matching consultants to projects are manual and time-consuming
- *Underutilized Talent*: Consultant skills often remain unused due to poor visibility of their capabilities
- *Project Delays*: Finding the right talent at the right time can lead to project delays
- *Lack of Transparency*: Limited visibility into consultant availability and skill sets
- *Administrative Overhead*: Managing consultant allocation requires significant administrative effort

Skill Bridge addresses these challenges through an intelligent, AI-driven approach to consultant management and project staffing.

## Key Features

### Dashboard & Analytics
- Real-time metrics on consultant utilization, project status, and team performance
- Interactive charts and data visualizations
- Personalized activity feeds and notifications

### Consultant Management
- Comprehensive consultant profiles with skills, experience, and preferences
- AI-generated consultant summaries
- Availability tracking and scheduling
- Performance metrics and feedback history

### Project Management
- Project requirement definition and tracking
- Milestone management with progress indicators
- Team composition and resource allocation
- Document management and collaboration tools

### AI-Powered Matching
- Intelligent matching of consultants to projects based on skills, experience, and preferences
- Automated recommendations for optimal team composition
- Predictive analytics for resource planning

### Notifications & Communications
- Real-time notifications for important updates
- In-app messaging between team members and consultants
- Customizable notification preferences
- Notification review system with dashboard redirection

## Technology Stack

- *Frontend*: React, TypeScript, TailwindCSS
- *State Management*: React Context API
- *UI Components*: Shadcn UI
- *Routing*: React Router
- *Notifications*: Sonner Toast
- *Icons*: Lucide React
- *Build Tools*: Vite

## Installation

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Setup Instructions

1. Clone the repository:
   bash
   git clone https://github.com/your-username/skill-bridge.git
   cd skill-bridge
   

2. Install dependencies:
   bash
   npm install
   

3. Start the development server:
   bash
   npm run dev
   

4. Open your browser and navigate to:
   
   http://localhost:5173
   

## Usage Guide

### Authentication
- Use the default credentials:
  - Username: admin
  - Password: 0000

### Navigation
- *Dashboard*: Overview of key metrics and recent activities
- *Projects*: Browse, create, and manage projects
- *Consultants*: View and manage consultant profiles
- *Messages*: In-app communication system
- *Settings*: Configure your account and application preferences

### Notification System
The platform features a comprehensive notification system:
- *Important Updates*: Alerts about critical events like employee misconduct, consultant availability, and project milestones
- *Messages & Invitations*: Communication notifications for interviews, project assignments, and other events
- *Review Process*: All notifications include a "Mark as Reviewed" option that redirects to the dashboard after acknowledgment

## Deployment

### Production Build
To create a production build:

bash
npm run build


The built files will be in the dist directory.

### Deployment Options

#### Static Hosting
Upload the contents of the dist directory to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

#### Docker Deployment
A Dockerfile is provided for containerized deployment:

bash
# Build the Docker image
docker build -t skill-bridge .

# Run the container
docker run -p 8080:80 skill-bridge


## Roadmap

- *AI Enhancement*: Advanced machine learning for more precise consultant-project matching
- *Mobile Application*: Native mobile apps for iOS and Android
- *Analytics Dashboard*: Enhanced reporting and analytics features
- *Integration Ecosystem*: APIs for integration with external HRMS and project management tools
- *Multilingual Support*: Support for additional languages

## Contributing

We welcome contributions to Skill Bridge! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.


## Support

For support, please reach out to support@skillbridge.com or open an issue on GitHub.
