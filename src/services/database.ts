import {
  User,
  StudentProfile,
  MentorProfile,
  Batch,
  Roadmap,
  RoadmapWeek,
  RoadmapTask,
  StudentProgress,
  Notice
} from '../types/models';

import * as UserService from './db/userService';
import * as StudentService from './db/studentService';
import * as MentorService from './db/mentorService';
import * as BatchService from './db/batchService';
import * as RoadmapService from './db/roadmapService';
import * as ProgressService from './db/progressService';
import * as NoticeService from './db/noticeService';
import * as DashboardService from './db/dashboardService';

// Re-export types
export type {
  User,
  StudentProfile,
  MentorProfile,
  Batch,
  Roadmap,
  RoadmapWeek,
  RoadmapTask,
  StudentProgress,
  Notice
};

// Database service class acting as a facade
export class DatabaseService {
  // User management
  static getCurrentUser = UserService.getCurrentUser;
  static getUserRole = UserService.getUserRole;
  static getUserById = UserService.getUserById;
  static getUserByEmail = UserService.getUserByEmail;
  static updateUser = UserService.updateUser;

  // Student profile management
  static getStudentProfile = StudentService.getStudentProfile;
  static createDefaultStudentProfile = StudentService.createDefaultStudentProfile;
  static updateStudentProfile = StudentService.updateStudentProfile;
  static cleanupDuplicateProfiles = StudentService.cleanupDuplicateProfiles;
  static cleanupAllDuplicateProfiles = StudentService.cleanupAllDuplicateProfiles;
  static getStudentsByBatch = StudentService.getStudentsByBatch;

  // Batch management
  static getStudentBatch = BatchService.getStudentBatch;
  static assignUserToAvailableBatch = BatchService.assignUserToAvailableBatch;
  static assignUserToExistingBatch = BatchService.assignUserToExistingBatch;
  static generateBatchSlug = BatchService.generateBatchSlug;
  static getBatchBySlug = BatchService.getBatchBySlug;

  // Roadmap management
  static getStudentRoadmap = RoadmapService.getStudentRoadmap;
  static getEnrolledRoadmaps = RoadmapService.getEnrolledRoadmaps;
  static getRoadmapWeeks = RoadmapService.getRoadmapWeeks;
  static getRoadmapTasks = RoadmapService.getRoadmapTasks;
  static generateRoadmapSlug = RoadmapService.generateRoadmapSlug;
  static getRoadmapBySlug = RoadmapService.getRoadmapBySlug;
  static getCurrentWeekTasks = RoadmapService.getCurrentWeekTasks;
  static getUpcomingTasks = RoadmapService.getUpcomingTasks;

  // Progress tracking
  static getStudentProgress = ProgressService.getStudentProgress;
  static updateTaskProgress = ProgressService.updateTaskProgress;
  static markWeekAsComplete = ProgressService.markWeekAsComplete;
  static getWeekCompletionStats = ProgressService.getWeekCompletionStats;
  static getWeekStudentCompletionDetails = ProgressService.getWeekStudentCompletionDetails;

  // Notices management
  static getNotices = NoticeService.getNotices;
  static markNoticeAsRead = NoticeService.markNoticeAsRead;

  // Mentor management
  static getMentors = MentorService.getMentors;
  static createMentorProfile = MentorService.createMentorProfile;

  // Dashboard data aggregation
  static getDashboardData = DashboardService.getDashboardData;
}

// Re-export standalone functions for convenience if needed elsewhere
export const generateBatchSlug = BatchService.generateBatchSlug;
export const generateRoadmapSlug = RoadmapService.generateRoadmapSlug;
export const getBatchBySlug = BatchService.getBatchBySlug;
export const getRoadmapBySlug = RoadmapService.getRoadmapBySlug;
