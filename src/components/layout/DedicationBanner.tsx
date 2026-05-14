const dedications = [
  'לעילוי נשמת אברהם צבי בן מרים ז"ל',
  'לעילוי נשמת שמחה בת מרים ז"ל'
];

export function DedicationBanner() {
  const text = dedications.join('  •  ');

  return (
    <section
      aria-label={text}
      className="dedication-banner border-b border-[#d8ad55]/45 bg-[#f8e7b0] text-[#071735]"
      dir="rtl"
    >
      <span className="sr-only">{text}</span>
      <div aria-hidden="true" className="dedication-track">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </section>
  );
}
