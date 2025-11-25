module.exports = {
  plugins: {
    // يتيح استيراد ملفات CSS داخل ملفات CSS أخرى
    'postcss-import': {},
    
    // يسمح باستخدام قواعد CSS المتداخلة (Nesting)
    'tailwindcss/nesting': {},
    
    // المكون الأساسي لإطار عمل Tailwind CSS
    tailwindcss: {},
    
    // يضيف البادئات الخاصة بالمتصفحات تلقائيًا لضمان التوافق
    autoprefixer: {},
  },
};
