import { useDebounce } from "@/hooks/useDebounce";
import { useEventFilters } from "@/hooks/useEventFilters";
import api from "@/lib/axios";
import { Calendar, ChevronDown, MapPin, Search, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

const CITIES = [
  "All",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Jaipur",
  "Goa",
  "Kolkata",
  "Ahmedabad",
  "Chennai",
  "Chandigarh",
];

export const EventFilterBar = memo(() => {
  const { updateParams, filters } = useEventFilters();
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(filters.search);
  const debouncedValue = useDebounce(searchVal, 350);
  console.log({ searchVal, debouncedValue });

  const isDebouncing = searchVal.trim() !== filters.search.trim();
  function handleFormatChange(format) {
    updateParams({ format });
  }

  function handleIsPaid(entry) {
    updateParams({ isPaid: entry });
  }

  function handleSearch(e) {
    e.preventDefault();
    updateParams({ search: searchVal.trim() });
  }

  function handleChangeCity(city) {
    updateParams({ city: city === "All" ? "" : city });
  }
  function clearSearch() {
    setSearchVal("");
    updateParams({ search: "" });
  }

  async function fetchCategories() {
    setIsCategoriesLoading(true);
    try {
      let { data } = await api.get("/api/categories");
      setCategories(data);
    } catch (error) { }
    setIsCategoriesLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const trimmedValue = debouncedValue.trim();
    if (trimmedValue !== filters.search) {
      updateParams({ search: trimmedValue });
    }
  }, [debouncedValue, filters.search]);

  const activeFormat = filters.format;
  const activeCategory = filters.category;

  const totalCategoryEvent = useMemo(() => {
    return categories.reduce((acc, currVal) => {
      acc += currVal.eventCount;
      return acc;
    }, 0);
  }, [categories]);

  return (
    <div className="space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="bg-white rounded-2xl border border-[#EBE8DF] p-3 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="text-stone-400 w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" />
          <form onSubmit={handleSearch}>
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              type="text"
              name="search"
              placeholder="Search by topic, category, artist, city, or venue..."
              className={`w-full pl-9 py-2 text-sm rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:bg-white focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 text-[#111] placeholder-stone-400 outline-none transition-all ${isDebouncing ? "pr-15" : "pr-9"}`}
            />
          </form>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isDebouncing && (
              <span className="w-3.5 h-3.5 border-2 border-stone-300 border-t-[#E65100] rounded-full animate-spin" />
            )}

            {searchVal && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* City Filter */}
        <div className="relative min-w-37.5">
          <MapPin className="text-stone-400 absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
          <select
            value={filters.city}
            name="city"
            onChange={(e) => handleChangeCity(e.target.value)}
            className="w-full pl-8 pr-7 py-2 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:border-[#E65100] outline-none text-stone-800 appearance-none cursor-pointer"
          >
            {CITIES.map((city, i) => (
              <option value={city} key={i}>
                {city === "All" ? "All locations" : city}
              </option>
            ))}

            {!CITIES.includes(filters.city) && (
              <option value={filters.city}>{filters.city}</option>
            )}
          </select>
          <ChevronDown className="text-stone-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
        </div>

        {/* Date Filter */}
        <div className="relative min-w-35">
          <button
            type="button"
            className=" w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer select-none bg-[#FAF9F5] border-[#DDD9CE] text-stone-700 hover:bg-stone-100"
          >
            <Calendar className="text-stone-400 w-4 h-4 absolute  left-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
            <span className="pl-8 pr-7">Filter by Date</span>
            <ChevronDown className="text-stone-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative min-w-35">
          <select
            name="sort"
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:border-[#E65100] outline-none text-stone-800 appearance-none cursor-pointer"
          >
            <option value="startDate_asc">Earliest First</option>
            <option value="startDate_desc">Latest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A – Z</option>
          </select>
          <ChevronDown className="text-stone-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
        </div>

        {/* Reset Filters CTA */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          <span>🔄</span>
          <span>Reset</span>
        </button>
      </div>

      {/* Categories horizontal pill bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Disciplines Pill */}
        <button
          type="button"
          onClick={() => updateParams({ category: "" })}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${activeCategory === ""
            ? "bg-stone-800 text-white border-stone-800"
            : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
            }`}
        >
          <span>All Category</span>
          {!isCategoriesLoading && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 ${activeCategory === ""
                ? "bg-white/20 text-white"
                : "bg-stone-100 text-stone-600"
                }`}
            >
              {totalCategoryEvent}
            </span>
          )}
        </button>

        {isCategoriesLoading
          ? [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-full bg-stone-200 animate-pulse shrink-0"
            />
          ))
          : categories.map((cat) => (
            <button
              key={cat._id || cat.id}
              type="button"
              onClick={() => updateParams({ category: cat.name })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${activeCategory === cat.name
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
                }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 ${activeCategory === cat.name
                  ? "bg-white/20 text-white"
                  : "bg-stone-100 text-stone-600"
                  }`}
              >
                {cat.eventCount || 0}
              </span>
            </button>
          ))}
      </div>

      {/* Format & Pricing Pills */}
      <div className="flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-stone-700">Format:</span>
          {["", "in-person", "online", "hybrid"].map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleFormatChange(f)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${activeFormat === f
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
                }`}
            >
              {f !== "" ? f : "All Formats"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">Entry:</span>
          <button
            type="button"
            onClick={() => handleIsPaid("")}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === "" || null
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white border-[#DDD9CE] text-stone-600"
              }`}
          >
            All
          </button>
          <button
            onClick={() => handleIsPaid(false)} // isPaid = false
            type="button"
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === false
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
              }`}
          >
            Free
          </button>
          <button
            onClick={() => handleIsPaid(true)} // isPaid = true
            type="button"
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === true
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
              }`}
          >
            Paid
          </button>
        </div>
      </div>
    </div>
  );
});