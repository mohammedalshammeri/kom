import type { Metadata } from "next";
import Link from "next/link";
import React, { JSX } from "react";

export const metadata: Metadata = {
  title: "King of the Market | ملك السوق – سوق السيارات في البحرين",
  description:
    "King of the Market (ملك السوق) – تطبيق سوق السيارات الأول في البحرين. بيع واشترِ سيارتك بسهولة مع آلاف الإعلانات من الأفراد والمعارض في البحرين. حمّل التطبيق مجاناً.",
  alternates: { canonical: "https://kotm.app" },
};

// ─── Small reusable icon SVGs ──────────────────────────────────────────────
function IconCar() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l3-3A1 1 0 0 1 6 8h12a1 1 0 0 1 .707.293l3 3A1 1 0 0 1 22 12v4a1 1 0 0 1-1 1h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" />
      <path d="M5 12h14" />
    </svg>
  );
}
function IconStore() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l1-5h16l1 5" /><rect x="2" y="9" width="20" height="12" rx="2" />
      <path d="M8 9v12M16 9v12M2 15h20" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─── Apple & Google store buttons ──────────────────────────────────────────
function AppStoreButton() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-3 bg-white text-navy px-5 py-3 rounded-2xl font-bold text-sm hover:bg-gold-light transition-colors shadow-lg"
      aria-label="تنزيل من App Store"
    >
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.36 2.77M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div className="text-right leading-tight">
        <div className="text-xs font-normal opacity-70">تنزيل من</div>
        <div className="text-base font-black">App Store</div>
      </div>
    </a>
  );
}
function GooglePlayButton() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-3 bg-white text-navy px-5 py-3 rounded-2xl font-bold text-sm hover:bg-gold-light transition-colors shadow-lg"
      aria-label="تنزيل من Google Play"
    >
      <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.18 23.76a2 2 0 0 0 2.85-.56L17 14 6 3a2.5 2.5 0 0 0-2.82.37C2.4 4.1 2 5 2 6v12c0 1.05.44 2.04 1.18 2.76zM17.5 14l2.64-1.53c.89-.52.89-1.42 0-1.94L17.5 9 14 12.5l3.5 1.5zM5.89 2.24L16.5 9 13 12.5l-7.11-10.26z" />
      </svg>
      <div className="text-right leading-tight">
        <div className="text-xs font-normal opacity-70">تنزيل من</div>
        <div className="text-base font-black">Google Play</div>
      </div>
    </a>
  );
}

// ─── Feature card ────────────────────────────────────────────────────────────
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:border-gold/40 hover:bg-gold/5 transition-all">
      <div className="p-3 rounded-2xl bg-gold/10 text-gold">{icon}</div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-gold flex items-center justify-center font-black text-xl text-navy">{num}</div>
      <div>
        <h4 className="font-bold text-white text-base">{title}</h4>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── FAQ item ────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border border-white/10 rounded-2xl p-5 hover:border-gold/30 transition-colors">
      <h3 className="font-bold text-white mb-2 text-base">{q}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
    </div>
  );
}

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────
const mobileAppSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "King of the Market – ملك السوق",
  alternateName: ["KOM", "KOTM", "ملك السوق"],
  operatingSystem: "iOS, Android",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Automotive",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BHD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1200" },
  description:
    "King of the Market هو تطبيق سوق السيارات الأول في البحرين. بيع واشترِ سيارتك بسهولة مع آلاف الإعلانات من الأفراد والمعارض.",
  url:      "https://kotm.app",
  image:    "https://kotm.app/logo.png",
  author:   { "@type": "Organization", name: "King of the Market", url: "https://kotm.app" },
  publisher:{ "@type": "Organization", name: "King of the Market" },
  inLanguage:       ["ar", "en"],
  availableOnDevice: ["Mobile", "Tablet"],
  countriesSupported: "BH",
  softwareVersion:  "1.0.0",
  releaseNotes:     "الإصدار الأول – سوق السيارات الأول في البحرين",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ما هو تطبيق King of the Market؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "King of the Market (ملك السوق) هو تطبيق سوق السيارات الأول في البحرين. يتيح للأفراد والمعارض بيع وشراء السيارات بسهولة مع آلاف الإعلانات وإمكانية التواصل المباشر.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أضيف إعلان سيارة في التطبيق؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "حمّل تطبيق King of the Market، سجّل حساباً، ثم اضغط على 'إضافة إعلان'، صوّر سيارتك وأدخل المعلومات التفصيلية كالسعر والموديل والحالة، ثم انشر الإعلان مجاناً في أقل من دقيقتين.",
      },
    },
    {
      "@type": "Question",
      name: "هل التطبيق مجاني؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، تحميل واستخدام تطبيق King of the Market مجاني تماماً. تتوفر باقات اشتراك مدفوعة لمن يريد زيادة عدد إعلاناته أو الحصول على أولوية الظهور في نتائج البحث.",
      },
    },
    {
      "@type": "Question",
      name: "على أي أجهزة يعمل التطبيق؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يعمل تطبيق King of the Market على أجهزة iPhone وiPad عبر App Store، وعلى أجهزة Android عبر Google Play Store.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أتواصل مع دعم التطبيق؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني support@kotm.app أو عبر صفحة الدعم داخل التطبيق.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن للمعارض استخدام التطبيق؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، يوفر تطبيق King of the Market حسابات خاصة للمعارض مع مميزات إضافية كإضافة كتالوج كامل من السيارات وإبراز المعرض في نتائج البحث.",
      },
    },
    {
      "@type": "Question",
      name: "ما هي طرق الدفع المتاحة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يدعم تطبيق King of the Market الدفع عبر بطاقات الائتمان وتحويل Benefit Pay المحلي في البحرين لباقات الاشتراك.",
      },
    },
    {
      "@type": "Question",
      name: "هل بيانات المستخدم آمنة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، يستخدم تطبيق King of the Market تشفيراً كاملاً لحماية بياناتك ولا يشاركها مع أطراف ثالثة. راجع سياسة الخصوصية على kotm.app/privacy للتفاصيل.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "كيفية بيع سيارة عبر تطبيق King of the Market",
  description: "دليل خطوة بخطوة لبيع سيارتك بسرعة وأمان عبر تطبيق King of the Market في البحرين.",
  image: "https://kotm.app/logo.png",
  totalTime: "PT5M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "BHD", value: "0" },
  step: [
    { "@type": "HowToStep", name: "سجّل حسابك", text: "حمّل التطبيق وأنشئ حساباً جديداً بالبريد الإلكتروني في دقيقة واحدة." },
    { "@type": "HowToStep", name: "صوّر سيارتك", text: "التقط صوراً واضحة للسيارة من زوايا مختلفة مباشرة من التطبيق." },
    { "@type": "HowToStep", name: "أدخل المعلومات", text: "أضف تفاصيل السيارة: الموديل، السنة، الحالة، العداد، والسعر المطلوب." },
    { "@type": "HowToStep", name: "انشر الإعلان", text: "اضغط نشر وسيظهر إعلانك لآلاف المشترين في البحرين فوراً." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://kotm.app" },
    { "@type": "ListItem", position: 2, name: "سياسة الخصوصية", item: "https://kotm.app/privacy" },
    { "@type": "ListItem", position: 3, name: "الشروط والأحكام", item: "https://kotm.app/terms" },
    { "@type": "ListItem", position: 4, name: "الدعم", item: "https://kotm.app/support" },
  ],
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── All JSON-LD Structured Data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="min-h-screen font-cairo" dir="rtl">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-navy/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="King of the Market" className="h-10 w-10 rounded-full" />
            <span className="text-white font-black text-lg hidden sm:block">King of the Market</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link href="#features" className="hover:text-gold transition-colors">المميزات</Link>
            <Link href="#steps"    className="hover:text-gold transition-colors">كيف يعمل</Link>
            <Link href="#faq"      className="hover:text-gold transition-colors">الأسئلة الشائعة</Link>
            <Link href="/support"  className="hover:text-gold transition-colors">الدعم</Link>
          </nav>
          <a href="#download" className="bg-gold text-navy text-sm font-black px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
            حمّل التطبيق
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Gradient blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            🇧🇭 سوق السيارات الأول في البحرين
          </div>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="King of the Market" className="w-40 h-40 rounded-full shadow-2xl border-4 border-gold/30" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
            King of the Market
          </h1>
          <p className="text-gold text-xl font-bold mb-4">ملك السوق</p>
          <p className="text-xl md:text-2xl font-bold text-slate-200 mb-4">
            بيع واشترِ سيارتك بكل سهولة
          </p>
          <p className="text-base text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            منصة King of the Market تجمع آلاف الإعلانات من الأفراد والمعارض في البحرين.
            أعلن عن سيارتك أو تصفح أحدث السيارات المتاحة الآن.
          </p>

          <div id="download" className="flex flex-wrap justify-center gap-4">
            <AppStoreButton />
            <GooglePlayButton />
          </div>

          <p className="mt-6 text-xs text-slate-500">متوفر على iOS وAndroid · مجاناً</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 border-y border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { n: "+1,000", l: "إعلان سيارة" },
            { n: "+200",   l: "معرض سيارات" },
            { n: "+5,000", l: "مستخدم" },
          ].map(({ n, l }) => (
            <div key={l}>
              <div className="text-2xl md:text-4xl font-black text-gold">{n}</div>
              <div className="text-sm text-slate-400 mt-1 font-semibold">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">مميزات التطبيق</h2>
            <p className="text-slate-400 mt-2">كل ما تحتاجه في مكان واحد</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<IconCar />}    title="إعلانات السيارات"       desc="أضف إعلانك بصور عالية الجودة ومعلومات تفصيلية في أقل من دقيقتين." />
            <Feature icon={<IconStore />}  title="معارض السيارات"        desc="تصفح المعارض الرسمية وتواصل مباشرة مع البائعين المعتمدين." />
            <Feature icon={<IconChat />}   title="تواصل مباشر"           desc="تحدث مع البائع أو المشتري مباشرة داخل التطبيق بدون وسيط." />
            <Feature icon={<IconShield />} title="آمان وموثوقية"         desc="نتحقق من هوية التجار ونُراجع الإعلانات لضمان تجربة آمنة." />
            <Feature icon={<IconStar />}   title="باقات الاشتراك"        desc="اختر الباقة المناسبة لزيادة عدد إعلاناتك والحصول على أولوية الظهور." />
            <Feature icon={<IconBell />}   title="إشعارات فورية"         desc="احصل على إشعارات فورية عند وصول رسالة جديدة أو عروض تهمك." />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="steps" className="py-20 px-4 bg-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">كيف يعمل التطبيق؟</h2>
            <p className="text-slate-400 mt-2">أربع خطوات بسيطة للبدء</p>
          </div>
          <div className="flex flex-col gap-8">
            <Step num="١" title="سجّل حسابك"            desc="أنشئ حسابك كفرد أو تاجر معرض في دقيقة واحدة باستخدام بريدك الإلكتروني." />
            <Step num="٢" title="أضف إعلانك"            desc="صوّر سيارتك وأضف المعلومات التفصيلية وانشر الإعلان مجاناً." />
            <Step num="٣" title="تواصل وتفاوض"          desc="تلقّ مكالمات واستفسارات مباشرة من المشترين المهتمين." />
            <Step num="٤" title="أتمّ الصفقة بسهولة"    desc="وافق على السعر وأتمّ عملية البيع بأمان داخل التطبيق." />
          </div>
        </div>
      </section>

      {/* ── FAQ – AEO Section ── */}
      <section id="faq" className="py-20 px-4" itemScope itemType="https://schema.org/FAQPage">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">الأسئلة الشائعة</h2>
            <p className="text-slate-400 mt-2">كل ما تريد معرفته عن تطبيق King of the Market</p>
          </div>
          <div className="flex flex-col gap-4">
            <FaqItem q="ما هو تطبيق King of the Market؟" a="King of the Market (ملك السوق) هو تطبيق سوق السيارات الأول في البحرين. يتيح للأفراد والمعارض بيع وشراء السيارات بسهولة مع آلاف الإعلانات وإمكانية التواصل المباشر." />
            <FaqItem q="كيف أضيف إعلان سيارة في التطبيق؟" a="حمّل التطبيق وسجّل حساباً، ثم اضغط على 'إضافة إعلان'، صوّر سيارتك وأدخل المعلومات التفصيلية كالسعر والموديل والحالة، وانشر الإعلان مجاناً في أقل من دقيقتين." />
            <FaqItem q="هل التطبيق مجاني؟" a="نعم، تحميل واستخدام تطبيق King of the Market مجاني تماماً. تتوفر باقات اشتراك مدفوعة لمن يريد زيادة عدد إعلاناته أو الحصول على أولوية الظهور في نتائج البحث." />
            <FaqItem q="على أي أجهزة يعمل التطبيق؟" a="يعمل التطبيق على أجهزة iPhone وiPad عبر App Store، وعلى أجهزة Android عبر Google Play Store." />
            <FaqItem q="هل يمكن للمعارض استخدام التطبيق؟" a="نعم، يوفر التطبيق حسابات خاصة للمعارض مع مميزات إضافية كإضافة كتالوج كامل من السيارات وإبراز المعرض في نتائج البحث." />
            <FaqItem q="ما هي طرق الدفع المتاحة؟" a="يدعم التطبيق الدفع عبر بطاقات الائتمان وتحويل Benefit Pay المحلي في البحرين لباقات الاشتراك." />
            <FaqItem q="كيف أتواصل مع دعم التطبيق؟" a="يمكنك التواصل عبر البريد الإلكتروني support@kotm.app أو زيارة صفحة الدعم على kotm.app/support." />
            <FaqItem q="هل بيانات المستخدم آمنة؟" a="نعم، نستخدم تشفيراً كاملاً لحماية بياناتك ولا نشاركها مع أطراف ثالثة. راجع سياسة الخصوصية على kotm.app/privacy للتفاصيل." />
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-gold/5 blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            حمّل التطبيق الآن مجاناً
          </h2>
          <p className="text-slate-400 mb-8 text-base">متوفر على متجر Apple ومتجر Google Play</p>
          <div className="flex flex-wrap justify-center gap-4">
            <AppStoreButton />
            <GooglePlayButton />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="King of the Market" className="h-9 w-9 rounded-full" />
              <span className="text-white font-black">King of the Market</span>
            </Link>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-400">
              <Link href="/privacy" className="hover:text-gold transition-colors">سياسة الخصوصية</Link>
              <Link href="/terms"   className="hover:text-gold transition-colors">الشروط والأحكام</Link>
              <Link href="/support" className="hover:text-gold transition-colors">الدعم والمساعدة</Link>
              <Link href="#faq"     className="hover:text-gold transition-colors">الأسئلة الشائعة</Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} King of the Market – جميع الحقوق محفوظة · المنامة، البحرين
            <span className="mx-2">·</span>
            <a href="mailto:support@kotm.app" className="hover:text-gold transition-colors">support@kotm.app</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
