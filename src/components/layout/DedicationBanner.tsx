const dedications = [
  'לעילוי נשמת אברהם צבי בן מרים ז"ל',
  'לעילוי נשמת שמחה בת מרים ז"ל'
];

export function DedicationBanner() {
  const text = dedications.join('  •  ');

  return (
    <section
      aria-label={text}
      className="dedication-banner border-b border-[#d8ad55]/40 bg-[#09183a] text-[#f8e7b0]"
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
