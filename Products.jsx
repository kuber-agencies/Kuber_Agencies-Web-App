import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsAPI } from '../services/api';

const CATEGORIES = ['All', 'Pipes', 'Fittings', 'Electrical', 'Tools', 'Other'];

const PLACEHOLDER_IMG = 'https://placehold.co/400x300/0f2044/f5c842?text=Product+Image';

const fallbackProducts = [
  { _id:'1', name:'GI Pipe (Medium Duty)', category:'Pipes', description:'Galvanized Iron medium duty pipe, ISI marked. Available in 15mm to 150mm NB. Ideal for water supply, fire fighting and plumbing.', bulkPricingNote:'Bulk pricing from 100 units onwards' },
  { _id:'2', name:'HDPE Pipe (PN 10)', category:'Pipes', description:'High Density Polyethylene pressure pipe for underground water supply. Available in 20mm to 315mm OD.', bulkPricingNote:'Special rate for 1000m+ orders' },
  { _id:'3', name:'GI Malleable Elbow 90°', category:'Fittings', description:'Galvanized malleable iron elbow, BSP thread, available from ½" to 4". Corrosion resistant, pressure tested.', bulkPricingNote:'Contact for bulk carton pricing' },
  { _id:'4', name:'PVC Compression Tee', category:'Fittings', description:'UPVC compression tee for potable water systems. Available in 20mm to 110mm, ISI marked.', bulkPricingNote:'Tiered pricing: 100/500/1000 units' },
  { _id:'5', name:'4mm FR Wire (Red)', category:'Electrical', description:'Flame retardant PVC insulated copper conductor wire, ISI marked. Available in 90m coils.', bulkPricingNote:'Drum pricing available for 5km+' },
  { _id:'6', name:'20mm Rigid PVC Conduit', category:'Electrical', description:'ISI marked rigid PVC conduit, 3m lengths, for electrical wiring in buildings and industrial plants.', bulkPricingNote:'Bundle pricing: 100 sticks+' },
  { _id:'7', name:'Combination Spanner Set', category:'Tools', description:'Chrome vanadium steel combination spanner set, 8–32mm, 12 pieces with canvas roll.', bulkPricingNote:'Contractor pricing for 10+ sets' },
  { _id:'8', name:'Pipe Wrench 14" (Stillson)', category:'Tools', description:'Heavy-duty drop forged steel pipe wrench, adjustable jaw, for pipes up to 2½" diameter.', bulkPricingNote:'Bulk rate for 20+ units' },
  { _id:'9', name:'CPVC Pipe (SDR 11)', category:'Pipes', description:'Chlorinated PVC pipe for hot and cold water plumbing. Rated up to 93°C, available 15–100mm.', bulkPricingNote:'Contact for project pricing' },
  { _id:'10', name:'MCB 32A Single Pole', category:'Electrical', description:'Miniature circuit breaker, 32A, 10kA breaking capacity, ISI marked, for residential and commercial use.', bulkPricingNote:'Panel pricing for 50+ units' },
  { _id:'11', name:'Union Coupling (GI)', category:'Fittings', description:'Galvanized iron union with brass seat, BSP thread. Easy disassembly for maintenance. ½" to 2".', bulkPricingNote:'Box pricing available' },
  { _id:'12', name:'Safety Helmet (ISI)', category:'Tools', description:'HDPE safety helmet with ratchet adjustment, ISI IS 2925 marked. Available in white, yellow, orange.', bulkPricingNote:'Bulk site order pricing for 50+' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;

    productsAPI.getAll(params)
      .then(({ data }) => {
        if (data.products?.length) {
          setProducts(data.products);
          setTotalPages(data.pages || 1);
        } else {
          const filtered = fallbackProducts.filter(p =>
            (category === 'All' || p.category === category) &&
            (!search || p.name.toLowerCase().includes(search.toLowerCase()))
          );
          setProducts(filtered);
          setTotalPages(1);
        }
      })
      .catch(() => {
        const filtered = fallbackProducts.filter(p =>
          (category === 'All' || p.category === category) &&
          (!search || p.name.toLowerCase().includes(search.toLowerCase()))
        );
        setProducts(filtered);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [category, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="pt-[88px]">
      {/* Header */}
      <section className="bg-navy-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Our Range</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Product Catalog</h1>
          <p className="text-gray-300 text-lg font-body max-w-xl">
            Browse our comprehensive range of hardware products. All items available for bulk ordering with competitive pricing.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-[88px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all font-body
                  ${category === cat ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="btn-secondary text-sm py-2.5 px-4">Search</button>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-0 overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-44" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map(product => (
                <div key={product._id} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative overflow-hidden h-44 bg-navy-50">
                    <img
                      src={product.image?.url || PLACEHOLDER_IMG}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={e => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                    <span className="absolute top-2 left-2 bg-navy-800 text-white text-xs font-bold px-2 py-0.5 rounded-full font-body">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-800 text-sm mb-2 leading-snug line-clamp-2 font-body">{product.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 font-body">{product.description}</p>
                    <p className="text-gold-600 text-xs font-semibold mb-4 font-body">💰 {product.bulkPricingNote}</p>
                    <Link
                      to={`/request-quote?product=${encodeURIComponent(product.name)}`}
                      className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-gold-500 hover:text-navy-900 text-white text-xs font-bold py-2.5 rounded-sm transition-all duration-200 font-body">
                      Request Quote <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-sm border border-gray-300 hover:border-navy-800 disabled:opacity-40 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold font-body text-navy-800">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-sm border border-gray-300 hover:border-navy-800 disabled:opacity-40 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
