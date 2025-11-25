# المهمة 5: تصميم قاعدة البيانات - مخطط قاعدة البيانات (Database Schema)

**عنوان المهمة:** تصميم قاعدة البيانات - إنشاء schema كامل لقاعدة البيانات مع جميع الجداول والعلاقات.
**الهدف:** توفير مخطط قاعدة بيانات (Schema) شامل ومفصل، مصمم ليكون قابلاً للتوسع (Scalable) ويدعم الأنظمة المتكاملة، مع الالتزام الصارم باستخدام قاعدة بيانات **PostgreSQL** فقط.

---

## 1. المبادئ التوجيهية للتصميم

تم تصميم مخطط قاعدة البيانات بناءً على المبادئ التالية:

1.  **الالتزام بـ PostgreSQL:** استخدام أنواع البيانات والميزات الخاصة بـ PostgreSQL لضمان الأداء الأمثل والالتزام بالقيد الصارم [1].
2.  **قابلية التوسع (Scalability):** هيكلة الجداول لدعم نمو كبير في البيانات والمستخدمين، بما يتماشى مع متطلبات الشركات الكبيرة [2].
3.  **التكامل المحاسبي:** دمج نظام محاسبي أساسي (Accounting System) كجزء هيكلي لا يمكن إغفاله [3].
4.  **دعم الذكاء الاصطناعي (AI-Driven):** تضمين جداول لدعم تخزين النماذج، البيانات التدريبية، وسجلات العمليات الذكية.

---

## 2. مخطط الجداول والعلاقات (Schema)

يتم تقسيم المخطط إلى مجموعات وظيفية رئيسية:

### المجموعة أ: إدارة المستخدمين والصلاحيات (Users & Authentication)

| الجدول | الوصف | المفتاح الأساسي (PK) | المفاتيح الخارجية (FK) |
| :--- | :--- | :--- | :--- |
| `users` | معلومات المستخدمين الأساسية وتسجيل الدخول. | `id` (UUID) | `role_id` (-> `roles.id`) |
| `roles` | تعريف الأدوار المتاحة في النظام (مثل: Admin, Editor, Basic). | `id` (SERIAL) | - |
| `user_roles` | جدول وسيط لعلاقة متعدد لمتعدد بين المستخدمين والأدوار. | `user_id`, `role_id` (مركب) | `user_id` (-> `users.id`), `role_id` (-> `roles.id`) |
| `sessions` | لتخزين جلسات المستخدمين (لأغراض الأمان وإدارة الجلسات). | `id` (UUID) | `user_id` (-> `users.id`) |

**جدول `users` (المستخدمون)**

| العمود | نوع البيانات (PostgreSQL) | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | المعرف الفريد للمستخدم. |
| `username` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | اسم المستخدم. |
| `email` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | البريد الإلكتروني. |
| `password_hash` | `TEXT` | `NOT NULL` | تجزئة كلمة المرور. |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | حالة تفعيل الحساب. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()` | تاريخ إنشاء الحساب. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT NOW()` | تاريخ آخر تحديث. |

### المجموعة ب: النظام المحاسبي (Accounting System)

| الجدول | الوصف | المفتاح الأساسي (PK) | المفاتيح الخارجية (FK) |
| :--- | :--- | :--- | :--- |
| `accounts` | دليل الحسابات (Chart of Accounts). | `id` (SERIAL) | `parent_id` (-> `accounts.id`) |
| `journal_entries` | قيد اليومية (يجمع المعاملات). | `id` (UUID) | `user_id` (-> `users.id`), `fiscal_year_id` (-> `fiscal_years.id`) |
| `transactions` | المعاملات الفردية (المدين/الدائن). | `id` (UUID) | `journal_entry_id` (-> `journal_entries.id`), `account_id` (-> `accounts.id`) |
| `fiscal_years` | السنوات المالية. | `id` (SERIAL) | - |

**جدول `transactions` (المعاملات)**

| العمود | نوع البيانات (PostgreSQL) | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | المعرف الفريد للمعاملة. |
| `journal_entry_id` | `UUID` | `NOT NULL`, `FOREIGN KEY` | ربط المعاملة بقيد اليومية. |
| `account_id` | `INTEGER` | `NOT NULL`, `FOREIGN KEY` | الحساب المتأثر (مدين أو دائن). |
| `transaction_type` | `VARCHAR(10)` | `NOT NULL`, `CHECK ('Debit' OR 'Credit')` | نوع المعاملة (مدين/دائن). |
| `amount` | `NUMERIC(18, 2)` | `NOT NULL`, `CHECK (amount > 0)` | قيمة المعاملة. |
| `transaction_date` | `DATE` | `NOT NULL` | تاريخ حدوث المعاملة. |

### المجموعة ج: إدارة النظام والمخططات (System & AI Management)

| الجدول | الوصف | المفتاح الأساسي (PK) | المفاتيح الخارجية (FK) |
| :--- | :--- | :--- | :--- |
| `system_features` | قائمة المميزات الموثقة للنظام (دليل المخطط العلمي) [4]. | `id` (SERIAL) | `parent_feature_id` (-> `system_features.id`) |
| `ai_models` | لتخزين معلومات نماذج الذكاء الاصطناعي المستخدمة. | `id` (UUID) | `user_id` (-> `users.id`) |
| `ai_logs` | سجلات عمليات الذكاء الاصطناعي (للتتبع والتحسين). | `id` (UUID) | `model_id` (-> `ai_models.id`), `user_id` (-> `users.id`) |
| `settings` | إعدادات النظام العامة (مفتاح/قيمة). | `key` (VARCHAR) | - |

**جدول `system_features` (مميزات النظام)**

| العمود | نوع البيانات (PostgreSQL) | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | المعرف الفريد للميزة. |
| `feature_name` | `VARCHAR(255)` | `NOT NULL` | اسم الميزة. |
| `description` | `TEXT` | - | وصف تفصيلي للميزة. |
| `status` | `VARCHAR(50)` | `NOT NULL` | حالة التنفيذ (مثال: Completed, In Progress, Planned). |
| `implementation_date` | `DATE` | - | تاريخ الانتهاء من التنفيذ. |
| `is_ai_driven` | `BOOLEAN` | `DEFAULT FALSE` | هل الميزة مدفوعة بالذكاء الاصطناعي؟ [5] |
| `parent_feature_id` | `INTEGER` | `FOREIGN KEY` | لربط المميزات الفرعية بالمميزات الرئيسية. |

---

## 3. العلاقات الرئيسية (Key Relationships)

تمثل العلاقات التالية الروابط الأساسية بين الجداول:

| العلاقة | الجداول المرتبطة | النوع | الوصف |
| :--- | :--- | :--- | :--- |
| **المستخدم - الدور** | `users` <-> `user_roles` <-> `roles` | متعدد لمتعدد (Many-to-Many) | يتيح للمستخدم الواحد أن يكون له عدة أدوار، وللدور الواحد أن يُسند لعدة مستخدمين. |
| **قيد اليومية - المعاملات** | `journal_entries` <-> `transactions` | واحد لمتعدد (One-to-Many) | كل قيد يومية يحتوي على معاملتين أو أكثر (مدين ودائن). |
| **المعاملة - الحساب** | `transactions` <-> `accounts` | متعدد لواحد (Many-to-One) | كل معاملة ترتبط بحساب واحد في دليل الحسابات. |
| **الحساب - الحساب الأب** | `accounts` (Self-Referencing) | واحد لمتعدد (One-to-Many) | لتنظيم دليل الحسابات في هيكل شجري (Parent-Child). |
| **المستخدم - السجلات الذكية** | `users` <-> `ai_logs` | واحد لمتعدد (One-to-Many) | لتتبع عمليات الذكاء الاصطناعي التي قام بها كل مستخدم. |
| **الميزة - الميزة الأب** | `system_features` (Self-Referencing) | واحد لمتعدد (One-to-Many) | لتنظيم خارطة الطريق والمميزات في هيكل هرمي. |

---

## 4. مقتطف SQL (PostgreSQL)

للتوضيح، هذا مقتطف لإنشاء جدول `users` وجدول `roles` في PostgreSQL:

\`\`\`sql
-- تمكين توليد UUID عشوائي
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الأدوار
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- جدول المستخدمين
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL, -- مثال على ربط دور أساسي
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول وسيط للأدوار المتعددة
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
\`\`\`

---

## المراجع

[1] تفضيل استخدام قاعدة بيانات PostgreSQL فقط في جميع المشاريع المستقبلية.
[2] تفضيل استخدام أحدث التقنيات لضمان قابلية النظام للتوسع (Scalability) للشركات الكبيرة وتطبيق أعلى المعايير.
[3] القيد الصارم على عدم إغفال أو نسيان النظام المحاسبي عند بناء أي نظام متكامل.
[4] تفضيل إنشاء دليل المخطط للنظام العلمي داخل النظام لتتبع الإنجازات المستقبلية والحالية وتحديثه تلقائيًا.
[5] تفضيل خارطة طريق مدفوعة بالذكاء الاصطناعي وجعل كل ما في النظام ذكيًا لمواكبة التطورات العالمية.