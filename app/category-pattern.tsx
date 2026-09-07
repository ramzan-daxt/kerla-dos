// Decorative only: existing category art, kept outside the learning cards.
export default function CategoryPattern({ icon }: { icon: string }) {
  return <div className="category-pattern" aria-hidden="true">
    {Array.from({ length: 48 }, (_, index) => <span key={index}><img src={icon} alt="" draggable={false} /></span>)}
  </div>;
}
