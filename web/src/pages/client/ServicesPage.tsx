import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../../context/useApp';
import ServiceCard from '../../components/ServiceCard';

const CATEGORIES = ['All', 'Hair', 'Nails', 'Skin', 'Packages'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
];

export default function ServicesPage() {
  const { services, loadServices, selectService } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('cat') ?? 'All');
  const [sort, setSort] = useState('default');
  const [showSort, setShowSort] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadServices(); }, [loadServices]);

  // Animate grid whenever filter changes
  useEffect(() => {
    if (!gridRef.current || services.length === 0) return;
    const cards = gridRef.current.querySelectorAll('.svc-item');
    gsap.fromTo(cards,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
    );
  }, [services.length, category, search, sort]);

  let filtered = services.filter(s => {
    const matchCat = category === 'All' || s.category === category;
    const matchQ = s.name.toLowerCase().includes(search.toLowerCase()) ||
                   s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  if (sort === 'price-asc')    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc')   filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'duration-asc') filtered = [...filtered].sort((a, b) => a.durationMinutes - b.durationMinutes);

  const handleBook = (svc: (typeof services)[0]) => {
    selectService(svc);
    navigate('/client/book');
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hint pointer-events-none" />
              <input
                className="input pl-10 pr-10"
                placeholder="Search services…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-tx2">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSort(v => !v)}
                className={`btn-icon border border-border ${showSort ? 'bg-rose text-primary border-primary' : ''}`}
              >
                <SlidersHorizontal size={16} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-12 w-52 bg-surface border border-border rounded-2xl shadow-card-hover z-20 overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-rose ${sort === opt.value ? 'text-primary font-semibold bg-rose' : 'text-tx2'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`tab-btn flex-shrink-0${category === cat ? ' active' : ''}`}>
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1.5 text-[10px] ${category === cat ? 'text-white/70' : 'text-hint'}`}>
                    ({services.filter(s => s.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 pt-5 pb-10 max-w-3xl mx-auto">
        {/* Result count */}
        <p className="text-xs text-hint mb-4 font-medium">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
          {search && <> for "<span className="text-tx1">{search}</span>"</>}
        </p>

        {services.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-3xl h-56 skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-rose flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-primary/50" />
            </div>
            <p className="font-bold text-tx1 text-base mb-1">No services found</p>
            <p className="text-tx2 text-sm">Try a different keyword or category</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline mt-4 text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map((svc, i) => (
              <div key={svc.id} className="svc-item">
                <ServiceCard service={svc} onBook={() => handleBook(svc)} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
