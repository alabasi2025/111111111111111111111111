import type { Config } from "drizzle-kit";

/**
 * إعدادات Drizzle ORM
 *
 * هذا الملف يستخدمه `drizzle-kit` لإدارة المخطط (Schema) والترحيلات (Migrations).
 *
 * @see https://orm.drizzle.team/kit-docs/config
 */
export default {
  // نوع قاعدة البيانات المستخدمة (مثال: 'pg' لـ PostgreSQL)
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // يجب توفير متغير البيئة DATABASE_URL في ملف .env
    connectionString: process.env.DATABASE_URL!,
  },
  // إعدادات إضافية (اختياري)
  strict: true, // تفعيل الوضع الصارم
  verbose: true, // تفعيل وضع الإسهاب للمزيد من التفاصيل في السجل
} satisfies Config;