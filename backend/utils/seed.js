import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import ChecklistTemplate from '../models/ChecklistTemplate.js';
import ChecklistInstance from '../models/ChecklistInstance.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/checklist_db');
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Tag.deleteMany({}),
    ChecklistTemplate.deleteMany({}), ChecklistInstance.deleteMany({})
  ]);

  // create() triggers pre-save hook so passwords get hashed correctly
  const admin     = await User.create({ name: 'Admin',    email: 'admin@company.com',   password: 'Admin123!',    role: 'admin',    department: 'IT' });
  const manager   = await User.create({ name: 'Manager',  email: 'manager@company.com', password: 'Manager123!',  role: 'manager',  department: 'HR' });
  const employee1 = await User.create({ name: 'Ivan',     email: 'ivan@company.com',    password: 'Employee123!', role: 'employee', department: 'Development' });
  const employee2 = await User.create({ name: 'Olena',    email: 'olena@company.com',   password: 'Employee123!', role: 'employee', department: 'QA' });

  const [hrCat, devCat, qaCat, secCat, routineCat] = await Category.insertMany([
    { name: 'HR & Onboarding', color: '#8b5cf6', icon: '👥', createdBy: admin._id },
    { name: 'Development',     color: '#3b82f6', icon: '💻', createdBy: admin._id },
    { name: 'Quality',         color: '#10b981', icon: '✅', createdBy: admin._id },
    { name: 'Security',        color: '#ef4444', icon: '🔒', createdBy: admin._id },
    { name: 'Routines',        color: '#f59e0b', icon: '🔄', createdBy: admin._id }
  ]);

  const [tagOnboarding, tagRelease, tagAudit, tagDaily, tagUrgent] = await Tag.insertMany([
    { name: 'onboarding', color: '#8b5cf6' },
    { name: 'release',    color: '#3b82f6' },
    { name: 'audit',      color: '#ef4444' },
    { name: 'daily',      color: '#f59e0b' },
    { name: 'urgent',     color: '#ec4899' }
  ]);

  const templates = await ChecklistTemplate.insertMany([
    {
      title: 'Employee Onboarding',
      description: 'Standard checklist for onboarding a new employee',
      category: hrCat._id,
      tags: [tagOnboarding],
      priority: 'high',
      estimatedDuration: 480,
      createdBy: manager._id,
      items: [
        { title: 'Prepare workstation and equipment', order: 0, estimatedTime: 60 },
        { title: 'Set up corporate email', order: 1, estimatedTime: 15 },
        { title: 'Grant system access', order: 2, estimatedTime: 30 },
        { title: 'Introduce to company culture', order: 3, estimatedTime: 90 },
        { title: 'Office tour', order: 4, estimatedTime: 20 },
        { title: 'Meet the team', order: 5, estimatedTime: 30 },
        { title: 'Sign NDA and documents', order: 6, estimatedTime: 45 },
        { title: 'Security briefing', order: 7, estimatedTime: 60 }
      ]
    },
    {
      title: 'Release Preparation',
      description: 'Checklist for preparing a new product release',
      category: devCat._id,
      tags: [tagRelease],
      priority: 'critical',
      estimatedDuration: 240,
      createdBy: manager._id,
      items: [
        { title: 'Run all unit tests', order: 0, estimatedTime: 30 },
        { title: 'Code review', order: 1, estimatedTime: 60 },
        { title: 'Test on staging', order: 2, estimatedTime: 45 },
        { title: 'Update documentation', order: 3, estimatedTime: 30 },
        { title: 'Prepare release notes', order: 4, estimatedTime: 20 },
        { title: 'Notify stakeholders', order: 5, estimatedTime: 10 },
        { title: 'Database backup', order: 6, estimatedTime: 15 },
        { title: 'Deploy to production', order: 7, estimatedTime: 30 }
      ]
    },
    {
      title: 'QA Checklist',
      description: 'Weekly quality audit',
      category: qaCat._id,
      tags: [tagAudit],
      priority: 'high',
      estimatedDuration: 180,
      createdBy: manager._id,
      items: [
        { title: 'Functional testing', order: 0, estimatedTime: 60 },
        { title: 'Regression testing', order: 1, estimatedTime: 45 },
        { title: 'UI/UX testing', order: 2, estimatedTime: 30 },
        { title: 'Performance check', order: 3, estimatedTime: 20 },
        { title: 'Mobile testing', order: 4, estimatedTime: 25 }
      ]
    },
    {
      title: 'Security Audit',
      description: 'Monthly security audit',
      category: secCat._id,
      tags: [tagAudit, tagUrgent],
      priority: 'critical',
      estimatedDuration: 300,
      createdBy: admin._id,
      items: [
        { title: 'Review user access rights', order: 0, estimatedTime: 60 },
        { title: 'Update SSL certificates', order: 1, estimatedTime: 20 },
        { title: 'Check logs for suspicious activity', order: 2, estimatedTime: 45 },
        { title: 'Penetration testing', order: 3, estimatedTime: 90 },
        { title: 'Update service account passwords', order: 4, estimatedTime: 30 },
        { title: 'Review firewall rules', order: 5, estimatedTime: 30 },
        { title: 'Management report', order: 6, estimatedTime: 25 }
      ]
    },
    {
      title: 'Daily Developer Routine',
      description: 'Standard daily checklist for development team',
      category: routineCat._id,
      tags: [tagDaily],
      priority: 'medium',
      estimatedDuration: 60,
      createdBy: manager._id,
      items: [
        { title: 'Check and reply to messages', order: 0, estimatedTime: 15 },
        { title: 'Daily standup', order: 1, estimatedTime: 15 },
        { title: 'Check CI/CD pipelines', order: 2, estimatedTime: 10 },
        { title: 'Update task tracker', order: 3, estimatedTime: 10 },
        { title: 'Git pull and code review', order: 4, estimatedTime: 10 }
      ]
    }
  ]);

  await ChecklistInstance.insertMany([
    {
      title: 'Onboarding: New Employee',
      template: templates[0]._id,
      category: hrCat._id,
      tags: [tagOnboarding],
      assignedTo: employee1._id,
      createdBy: manager._id,
      priority: 'high',
      status: 'in_progress',
      progress: 50,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: templates[0].items.map((item, i) => ({
        ...item.toObject(),
        isCompleted: i < 4,
        completedBy: i < 4 ? employee1._id : null,
        completedAt: i < 4 ? new Date() : null
      }))
    },
    {
      title: 'Release v2.4.0',
      template: templates[1]._id,
      category: devCat._id,
      tags: [tagRelease, tagUrgent],
      assignedTo: employee1._id,
      createdBy: manager._id,
      priority: 'critical',
      status: 'pending',
      progress: 0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: templates[1].items.map(item => ({ ...item.toObject(), isCompleted: false }))
    },
    {
      title: 'QA: Weekly Audit #12',
      template: templates[2]._id,
      category: qaCat._id,
      tags: [tagAudit],
      assignedTo: employee2._id,
      createdBy: manager._id,
      priority: 'high',
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
      items: templates[2].items.map(item => ({
        ...item.toObject(),
        isCompleted: true,
        completedBy: employee2._id,
        completedAt: new Date()
      }))
    }
  ]);

  console.log('');
  console.log('Seed complete!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  admin@company.com    / Admin123!');
  console.log('  manager@company.com  / Manager123!');
  console.log('  ivan@company.com     / Employee123!');
  console.log('  olena@company.com    / Employee123!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });