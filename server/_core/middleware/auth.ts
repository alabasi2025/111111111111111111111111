/**
 * Middleware للمصادقة والتحقق من الصلاحيات - النظام المحاسبي الذكي
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * واجهة بيانات المستخدم في Token
 */
export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  organizationId?: number;
}

/**
 * تمديد واجهة Request لإضافة user
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware للتحقق من المصادقة
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // الحصول على Token من header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'غير مصرح - يجب تسجيل الدخول',
        code: 'UNAUTHORIZED' 
      });
      return;
    }
    
    const token = authHeader.substring(7); // إزالة 'Bearer '
    
    // التحقق من صحة Token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // إضافة بيانات المستخدم إلى الطلب
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Token غير صالح',
        code: 'INVALID_TOKEN' 
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'انتهت صلاحية الجلسة - يرجى تسجيل الدخول مرة أخرى',
        code: 'TOKEN_EXPIRED' 
      });
      return;
    }
    
    res.status(500).json({ 
      error: 'خطأ في التحقق من المصادقة',
      code: 'AUTH_ERROR' 
    });
  }
};

/**
 * Middleware الأساسي للمصادقة (متوافق مع الكود القديم)
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware للتحقق من الصلاحيات
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'غير مصرح - يجب تسجيل الدخول',
        code: 'UNAUTHORIZED' 
      });
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'ليس لديك صلاحية للوصول إلى هذا المورد',
        code: 'FORBIDDEN',
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
      return;
    }
    
    next();
  };
};

/**
 * Middleware للتحقق من ملكية المورد
 */
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'غير مصرح - يجب تسجيل الدخول',
        code: 'UNAUTHORIZED' 
      });
      return;
    }
    
    // السماح للمسؤولين بالوصول إلى كل شيء
    if (req.user.role === 'admin') {
      next();
      return;
    }
    
    // التحقق من أن المستخدم يملك المورد
    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    
    if (resourceUserId && parseInt(resourceUserId) !== req.user.userId) {
      res.status(403).json({ 
        error: 'ليس لديك صلاحية للوصول إلى هذا المورد',
        code: 'FORBIDDEN' 
      });
      return;
    }
    
    next();
  };
};

/**
 * دالة لتوليد Token
 */
export const generateToken = (payload: TokenPayload, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * دالة للتحقق من Token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * دالة لفك تشفير Token بدون التحقق
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware اختياري للمصادقة (لا يفشل إذا لم يكن هناك token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // تجاهل الأخطاء والمتابعة بدون user
    next();
  }
};

/**
 * Middleware للتحقق من المؤسسة
 */
export const checkOrganization = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      error: 'غير مصرح - يجب تسجيل الدخول',
      code: 'UNAUTHORIZED' 
    });
    return;
  }
  
  if (!req.user.organizationId) {
    res.status(403).json({ 
      error: 'المستخدم غير مرتبط بمؤسسة',
      code: 'NO_ORGANIZATION' 
    });
    return;
  }
  
  next();
};

/**
 * Middleware لتحديد معدل الطلبات (Rate Limiting)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = req.user?.userId.toString() || req.ip || 'anonymous';
    const now = Date.now();
    
    const record = requestCounts.get(identifier);
    
    if (!record || now > record.resetTime) {
      requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }
    
    if (record.count >= maxRequests) {
      res.status(429).json({ 
        error: 'تم تجاوز الحد الأقصى للطلبات - يرجى المحاولة لاحقاً',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }
    
    record.count++;
    next();
  };
};

export default {
  authenticate,
  authMiddleware,
  authorize,
  checkOwnership,
  generateToken,
  verifyToken,
  decodeToken,
  optionalAuth,
  checkOrganization,
  rateLimit,
};
