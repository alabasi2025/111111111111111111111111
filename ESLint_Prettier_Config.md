# المهمة 16: إعداد ملف ESLint وPrettier لضمان جودة الكود

تم إعداد ملفي `.eslintrc.json` و `.prettierrc` لضمان جودة الكود وتوحيد نمط الكتابة (Code Style) في المشروع. يعمل **ESLint** على تحليل الكود بشكل ثابت لتحديد المشاكل المحتملة والأخطاء البرمجية، بينما يعمل **Prettier** على تنسيق الكود تلقائيًا لضمان الاتساق.

---

## 1. ملف `.eslintrc.json`

يحتوي هذا الملف على إعدادات ESLint، وقد تم تكوينه لدعم بيئات **React** و **TypeScript**، بالإضافة إلى دمج **Prettier** ليتولى مسؤولية التنسيق وتجنب التعارض بين الأداتين.

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    // قواعد عامة
    "no-console": "warn", // تحذير عند استخدام console.log
    "no-debugger": "warn", // تحذير عند استخدام debugger
    "prefer-const": "error", // فرض استخدام const للمتغيرات التي لا تتغير
    // قواعد React
    "react/prop-types": "off", // يتم إيقافها لأن TypeScript يتعامل مع التحقق من الأنواع
    "react/react-in-jsx-scope": "off", // غير ضروري في React 17+
    // قواعد TypeScript
    "@typescript-eslint/explicit-module-boundary-types": "off", // إيقاف فرض تحديد نوع الإرجاع للدوال المصدرة
    "@typescript-eslint/no-explicit-any": "off", // السماح باستخدام النوع any
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }] // السماح بالمتغيرات غير المستخدمة التي تبدأ بـ _
  }
}
```

---

## 2. ملف `.prettierrc`

يحتوي هذا الملف على إعدادات Prettier لتنسيق الكود. تم اختيار هذه الإعدادات لضمان أقصى قدر من القراءة والاتساق.

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**شرح الإعدادات الرئيسية:**

| الخاصية | القيمة | الوصف |
| :--- | :--- | :--- |
| `printWidth` | `100` | الحد الأقصى لطول السطر قبل أن يقوم Prettier بلفه. |
| `tabWidth` | `2` | عدد المسافات المستخدمة لكل مستوى من مستويات المسافة البادئة. |
| `useTabs` | `false` | استخدام المسافات بدلاً من علامات الجدولة (Tabs). |
| `semi` | `true` | إضافة فاصلة منقوطة في نهاية كل عبارة. |
| `singleQuote` | `true` | استخدام علامات الاقتباس المفردة بدلاً من المزدوجة. |
| `trailingComma` | `all` | إضافة فاصلة زائدة (Trailing Comma) حيثما أمكن (لتحسين مقارنة التغييرات في Git). |
| `arrowParens` | `always` | إضافة أقواس حول معاملات دوال السهم (Arrow Functions) دائمًا. |
| `endOfLine` | `lf` | استخدام نمط نهاية السطر `LF` (Line Feed) لضمان الاتساق عبر أنظمة التشغيل. |