/**
 * Little Steps Full-Stack Server
 * Integrates Express API + Vite middlewares with real authentication,
 * sessions, audit logging, RBAC, content management, and security controls.
 */

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { store, UserRecord } from './src/server/store.js';

// In AI Studio, ensure HMR is disabled to avoid websocket transport errors in iframe
if (process.env.DISABLE_HMR === undefined) {
  process.env.DISABLE_HMR = 'true';
}

// Extend Request type with user
export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  sessionId?: string;
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_COOKIE_NAME = 'ls_session';

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Client IP helper
const getClientIp = (req: Request) => {
  return (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
};

// Session & User Context Middleware
app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if (sessionId) {
    const session = store.findSession(sessionId);
    if (session) {
      const user = store.findUserById(session.userId);
      if (user && user.status !== 'suspended') {
        req.user = user;
        req.sessionId = sessionId;
      }
    }
  }
  next();
});

// Auth Guard Middlewares
const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  if (req.user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account is suspended. Please contact support.' });
  }
  next();
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'admin' && req.user.role !== 'support') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
};

// ==========================================
// API Routes
// ==========================================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Little Steps API',
  });
});

// --- Authentication Endpoints ---

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a child or caregiver name.' });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = store.createUser({
      email: email.trim().toLowerCase(),
      passwordHash,
      name: name.trim(),
      role: 'user',
      status: 'active',
      emailVerified: false,
      avatar: avatar || 'boy',
      lastLoginAt: null,
    });

    // Create session
    const session = store.createSession(newUser.id, getClientIp(req), req.headers['user-agent']);
    res.cookie(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const verifyToken = store.createVerificationToken(newUser.id);

    store.logAudit({
      actorId: newUser.id,
      actorEmail: newUser.email,
      eventType: 'register',
      targetType: 'user',
      targetId: newUser.id,
      details: { name: newUser.name },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    const preferences = store.getUserPreferences(newUser.id);

    res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        emailVerified: newUser.emailVerified,
        avatar: newUser.avatar,
        preferences,
      },
      devVerificationToken: verifyToken,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      store.logAudit({
        actorId: null,
        actorEmail: email,
        eventType: 'login_failed',
        targetType: null,
        targetId: null,
        details: { reason: 'User not found' },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      store.logAudit({
        actorId: user.id,
        actorEmail: user.email,
        eventType: 'login_failed',
        targetType: 'user',
        targetId: user.id,
        details: { reason: 'Account suspended' },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      return res.status(403).json({ error: 'This account has been suspended. Please contact support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      store.logAudit({
        actorId: user.id,
        actorEmail: user.email,
        eventType: 'login_failed',
        targetType: 'user',
        targetId: user.id,
        details: { reason: 'Incorrect password' },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create session
    const session = store.createSession(user.id, getClientIp(req), req.headers['user-agent']);
    res.cookie(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    store.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    store.logAudit({
      actorId: user.id,
      actorEmail: user.email,
      eventType: 'login_success',
      targetType: 'user',
      targetId: user.id,
      details: {},
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    const preferences = store.getUserPreferences(user.id);

    res.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        preferences,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Logout
app.post('/api/auth/logout', (req: AuthenticatedRequest, res) => {
  if (req.sessionId) {
    store.deleteSession(req.sessionId);
  }
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
  if (req.user) {
    store.logAudit({
      actorId: req.user.id,
      actorEmail: req.user.email,
      eventType: 'logout',
      targetType: 'user',
      targetId: req.user.id,
      details: {},
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
  }
  res.json({ message: 'Logged out successfully.' });
});

// Get Current User
app.get('/api/auth/me', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const preferences = store.getUserPreferences(req.user.id);
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      status: req.user.status,
      emailVerified: req.user.emailVerified,
      avatar: req.user.avatar,
      preferences,
    },
  });
});

// Verify Email
app.post('/api/auth/verify-email', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }
  const success = store.verifyEmailWithToken(token);
  if (!success) {
    return res.status(400).json({ error: 'Invalid or expired verification link.' });
  }
  res.json({ message: 'Email verified successfully!' });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const user = store.findUserByEmail(email);
  let devResetToken: string | undefined;

  if (user && user.status !== 'suspended') {
    devResetToken = store.createPasswordResetToken(user.id);
    store.logAudit({
      actorId: user.id,
      actorEmail: user.email,
      eventType: 'password_reset_request',
      targetType: 'user',
      targetId: user.id,
      details: {},
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
  }

  // Consistent message to prevent email enumeration
  res.json({
    message: 'If an active account exists with that email, a password reset link has been dispatched.',
    devResetToken: !IS_PROD ? devResetToken : undefined,
  });
});

// Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Valid token and new password (min 8 characters) required.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  const success = store.resetPasswordWithToken(token, hash);

  if (!success) {
    return res.status(400).json({ error: 'Invalid or expired password reset link.' });
  }

  res.json({ message: 'Password has been reset successfully. You may now log in.' });
});

// Update Profile & Preferences
app.put('/api/users/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { name, avatar, soundEnabled, reducedMotion, highContrast, theme, dailyGoalMinutes } = req.body;

  if (name && typeof name === 'string') {
    store.updateUser(user.id, { name: name.trim() });
  }
  if (avatar && typeof avatar === 'string') {
    store.updateUser(user.id, { avatar });
  }

  const prefUpdates: any = {};
  if (typeof soundEnabled === 'boolean') prefUpdates.soundEnabled = soundEnabled;
  if (typeof reducedMotion === 'boolean') prefUpdates.reducedMotion = reducedMotion;
  if (typeof highContrast === 'boolean') prefUpdates.highContrast = highContrast;
  if (theme && typeof theme === 'string') prefUpdates.theme = theme;
  if (typeof dailyGoalMinutes === 'number') prefUpdates.dailyGoalMinutes = dailyGoalMinutes;

  const updatedPrefs = store.updateUserPreferences(user.id, prefUpdates);
  const updatedUser = store.findUserById(user.id)!;

  res.json({
    message: 'Profile updated successfully.',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      status: updatedUser.status,
      emailVerified: updatedUser.emailVerified,
      avatar: updatedUser.avatar,
      preferences: updatedPrefs,
    },
  });
});

// --- Content Endpoints ---

// List Activities / Content
app.get('/api/content/activities', (req, res) => {
  const { category, type } = req.query;
  const items = store.getContentItems('published', type as string);
  const filtered = category
    ? items.filter((i) => i.category.toLowerCase() === (category as string).toLowerCase())
    : items;
  res.json(filtered);
});

// Get Single Content Item
app.get('/api/content/item/:id', (req, res) => {
  const item = store.getContentItemById(req.params.id);
  if (!item || item.status !== 'published') {
    return res.status(404).json({ error: 'Content item not found.' });
  }
  res.json(item);
});

// --- User Goals & Progress ---

app.get('/api/progress/goals', requireAuth, (req: AuthenticatedRequest, res) => {
  const goals = store.getUserGoals(req.user!.id);
  res.json(goals);
});

app.put('/api/progress/goals/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const updated = store.toggleGoal(req.user!.id, req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Goal not found.' });
  }
  res.json(updated);
});

app.post('/api/progress/complete/:activityId', requireAuth, (req: AuthenticatedRequest, res) => {
  const { steps, percent } = req.body;
  const progress = store.completeActivity(req.user!.id, req.params.activityId, steps, percent);
  res.json({ success: true, progress });
});

// ==========================================
// Admin Endpoints (RBAC Enforced)
// ==========================================

// Admin Overview
app.get('/api/admin/overview', requireAdmin, (req, res) => {
  const stats = store.getOverviewStats();
  res.json(stats);
});

// Admin Users List
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const { search, role, status, page = '1', limit = '20' } = req.query;
  let users = store.getAllUsers();

  if (search) {
    const q = (search as string).toLowerCase();
    users = users.filter((u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  }
  if (role) {
    users = users.filter((u) => u.role === role);
  }
  if (status) {
    users = users.filter((u) => u.status === status);
  }

  const p = Math.max(1, parseInt(page as string, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
  const total = users.length;
  const paginated = users.slice((p - 1) * l, p * l).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status,
    emailVerified: u.emailVerified,
    avatar: u.avatar,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  }));

  res.json({
    users: paginated,
    total,
    page: p,
    limit: l,
  });
});

// Update User Status (Suspend / Reactivate)
app.put('/api/admin/users/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const targetId = req.params.id;
  const { status, reason } = req.body;

  if (targetId === actor.id && status === 'suspended') {
    return res.status(400).json({ error: 'You cannot suspend your own administrative account.' });
  }

  const target = store.findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  store.updateUser(targetId, { status });
  if (status === 'suspended') {
    store.revokeUserSessions(targetId);
  }

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: status === 'suspended' ? 'user_suspended' : 'user_activated',
    targetType: 'user',
    targetId,
    details: { newStatus: status, reason },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({ message: `User status changed to ${status}.`, status });
});

// Update User Role
app.put('/api/admin/users/:id/role', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const targetId = req.params.id;
  const { role } = req.body;

  if (!['user', 'support', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  if (targetId === actor.id && role !== 'admin') {
    return res.status(400).json({ error: 'You cannot remove your own admin privileges.' });
  }

  const target = store.findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  store.updateUser(targetId, { role });

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'role_changed',
    targetType: 'user',
    targetId,
    details: { oldRole: target.role, newRole: role },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({ message: `Role updated to ${role}.`, role });
});

// Revoke User Sessions
app.post('/api/admin/users/:id/revoke-sessions', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const targetId = req.params.id;

  const count = store.revokeUserSessions(targetId);

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'sessions_revoked',
    targetType: 'user',
    targetId,
    details: { revokedCount: count },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({ message: `Revoked ${count} session(s) successfully.` });
});

// Trigger Password Reset for User
app.post('/api/admin/users/:id/trigger-reset', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const target = store.findUserById(req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const resetToken = store.createPasswordResetToken(target.id);

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'admin_password_reset_triggered',
    targetType: 'user',
    targetId: target.id,
    details: { targetEmail: target.email },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({
    message: `Password reset link generated for ${target.email}.`,
    devResetToken: resetToken,
  });
});

// Delete User Account
app.delete('/api/admin/users/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const targetId = req.params.id;

  if (targetId === actor.id) {
    return res.status(400).json({ error: 'You cannot delete your own administrative account.' });
  }

  const target = store.findUserById(targetId);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  store.deleteUser(targetId);

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'user_deleted',
    targetType: 'user',
    targetId,
    details: { email: target.email, name: target.name },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({ message: `User account deleted.` });
});

// Manage Content List
app.get('/api/admin/content', requireAdmin, (req, res) => {
  const { type, status } = req.query;
  const items = store.getContentItems(status as string, type as string);
  res.json(items);
});

// Create Content
app.post('/api/admin/content', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const { id, type, title, description, category, categoryName, ageRange, difficulty, duration, status, orderIndex, details } = req.body;

  if (!id || !title || !description || !category || !type) {
    return res.status(400).json({ error: 'Missing required content fields.' });
  }

  const existing = store.getContentItemById(id);
  if (existing) {
    return res.status(409).json({ error: 'Content item with this ID already exists.' });
  }

  const newItem = store.createContentItem({
    id,
    type,
    title,
    description,
    category,
    categoryName: categoryName || category,
    ageRange: ageRange || '3-7 yrs',
    difficulty: difficulty || 'Gentle',
    duration: duration || '5 mins',
    status: status || 'published',
    orderIndex: orderIndex || 10,
    details: details || {},
  });

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'content_created',
    targetType: 'content',
    targetId: id,
    details: { title, type },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.status(201).json(newItem);
});

// Update Content
app.put('/api/admin/content/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const id = req.params.id;
  const updates = req.body;

  const updated = store.updateContentItem(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Content item not found.' });
  }

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'content_updated',
    targetType: 'content',
    targetId: id,
    details: { title: updated.title, status: updated.status },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json(updated);
});

// Delete Content
app.delete('/api/admin/content/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const id = req.params.id;

  const existing = store.getContentItemById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Content item not found.' });
  }

  store.deleteContentItem(id);

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'content_deleted',
    targetType: 'content',
    targetId: id,
    details: { title: existing.title },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json({ message: 'Content item deleted successfully.' });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  const logs = store.getAuditLogs(100);
  res.json(logs);
});

// Admin App Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  res.json(store.getSettings());
});

app.put('/api/admin/settings', requireAdmin, (req: AuthenticatedRequest, res) => {
  const actor = req.user!;
  const updates = req.body;

  const updated = store.updateSettings(updates);

  store.logAudit({
    actorId: actor.id,
    actorEmail: actor.email,
    eventType: 'settings_updated',
    targetType: 'settings',
    targetId: 'global',
    details: { updates },
    ipAddress: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });

  res.json(updated);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ==========================================
// Vite Middleware / Static Frontend Serving
// ==========================================
async function startServer() {
  const httpServer = http.createServer(app);

  if (!IS_PROD) {
    const isHmrDisabled = process.env.DISABLE_HMR !== 'false';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Little Steps service active on http://0.0.0.0:${PORT}`);
    console.log(`🔐 Admin credentials: admin@littlesteps.org / AdminPassword123!`);
  });
}

startServer();
