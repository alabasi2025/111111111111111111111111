import { pgTable, serial, text, boolean, timestamp, uniqueIndex, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ====================================================================================================
// 1. Organizations Table (المؤسسات)
// يمثل المستوى الثاني في الهيكل الهرمي (الوحدة ← المؤسسات ← الفروع)
// كل مؤسسة منفصلة تمامًا عن الأخرى وتوازي "الوحدة المحاسبية".
// ====================================================================================================
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(), // معرف فريد صديق للروابط
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (organization) => {
  return {
    slugIndex: uniqueIndex('organization_slug_idx').on(organization.slug),
  };
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  branches: many(branches),
  users: many(users),
}));

// ====================================================================================================
// 2. Branches Table (الفروع)
// يمثل المستوى الثالث في الهيكل الهرمي، تابع لمؤسسة معينة.
// ====================================================================================================
export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  organization_id: integer('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  address: text('address'),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const branchesRelations = relations(branches, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [branches.organization_id],
    references: [organizations.id],
  }),
  users: many(users),
}));

// ====================================================================================================
// 3. Users Table (المستخدمون)
// جدول المستخدمين الأساسي، مرتبط بمؤسسة وفرع.
// ====================================================================================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  organization_id: integer('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  branch_id: integer('branch_id').references(() => branches.id, { onDelete: 'set null' }), // يمكن أن يكون المستخدم غير مرتبط بفرع محدد
  full_name: varchar('full_name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password_hash: text('password_hash').notNull(), // لتخزين تجزئة كلمة المرور
  role: varchar('role', { length: 50 }).default('user').notNull(), // دور المستخدم (مثل admin, manager, user)
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (user) => {
  return {
    emailIndex: uniqueIndex('user_email_idx').on(user.email),
  };
});

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id],
  }),
  branch: one(branches, {
    fields: [users.branch_id],
    references: [branches.id],
  }),
}));