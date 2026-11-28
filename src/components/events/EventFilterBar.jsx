import { useDebounce } from "@/hooks/useDebounce";
import { useEventFilters } from "@/hooks/useEventFilters";
import api from "@/lib/axios";
import {
  Calendar,
  ChevronDown,
  MapPin,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";

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
  const { updateParams, filters, hasActiveFilters, resetFilters } =
    useEventFilters();
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(filters.search);
  const debouncedValue = useDebounce(searchVal, 350);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarTab, setCalendarTab] = useState("dates");
  const [range, setRange] = useState({ from: undefined, to: undefined });
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

  function handleSorting(e) {
    const [sort, order] = e.target.value.split("_");
    updateParams({ sort, order });
  }

  function handleRangeSelect(range, triggerDate) {
    console.log({ range, triggerDate });
    setRange(range)
  }

  async function fetchCategories() {
    setIsCategoriesLoading(true);
    try {
      let { data } = await api.get("/api/categories");
      setCategories(data);
    } catch (error) {}
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
            onClick={() => setIsDatePickerOpen((prev) => !prev)}
            className=" w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer select-none bg-[#FAF9F5] border-[#DDD9CE] text-stone-700 hover:bg-stone-100"
          >
            <Calendar className="text-stone-400 w-4 h-4 absolute  left-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
            <span className="pl-8 pr-7">Filter by Date</span>
            <ChevronDown className="text-stone-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
          </button>

          {isDatePickerOpen && (
            <div className="fixed inset-x-3 top-20 sm:top-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-[#EBE8DF] p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[88vh] overflow-y-auto sm:max-h-none sm:overflow-visible w-auto sm:w-167.5 max-w-[calc(100vw-1.5rem)] sm:max-w-167.5">
              {/* Top Segmented Control (Dates vs Flexible) */}
              <div className="flex justify-center mb-4 sm:mb-5">
                <div className="inline-flex p-1 bg-[#EBEAE5] rounded-full">
                  <button
                    type="button"
                    onClick={() => setCalendarTab("dates")}
                    className={`px-5 sm:px-7 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      calendarTab === "dates"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarTab("flexible")}
                    className={`px-5 sm:px-7 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      calendarTab === "flexible"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Flexible
                  </button>
                </div>
              </div>

              {calendarTab === "dates" ? (
                <>
                  {/* Dual-Month Airbnb-style DayPicker */}
                  <div className="flex justify-center overflow-x-auto py-1">
                    <DayPicker
                      mode="range"
                      pagedNavigation
                      numberOfMonths={2}
                      navLayout="around"
                      disabled={{ before: new Date() }}
                      className="airbnb-day-picker"
                      selected={range}
                      onSelect={handleRangeSelect}
                      formatters={{
                        formatWeekdayName: (date) =>
                          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()],
                      }}
                    />
                  </div>
                </>
              ) : (
                /* Flexible Preset Selector Tab */
                <div className="py-6 px-3 space-y-4 max-w-lg mx-auto">
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-stone-900">
                      When do you want to explore?
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Pick a quick timeframe for upcoming gatherings
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "today", label: "Today", desc: "Happening today" },
                      {
                        id: "weekend",
                        label: "This Weekend",
                        desc: "Upcoming Sat & Sun",
                      },
                      {
                        id: "week",
                        label: "Next 7 Days",
                        desc: "Next seven days",
                      },
                      {
                        id: "month",
                        label: "This Month",
                        desc: "Through month-end",
                      },
                      {
                        id: "nextMonth",
                        label: "Next Month",
                        desc: "All of next month",
                      },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="p-3.5 rounded-2xl border border-[#E0DCCF] hover:border-stone-900 bg-[#FAF9F5] hover:bg-white text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                      >
                        <div className="text-xs font-bold text-stone-800 group-hover:text-black">
                          {p.label}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          {p.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popover Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 sm:pt-4 mt-3 border-t border-[#F2EFE8]">
                <div className="text-xs text-stone-600 font-medium">
                  1. Click on a start date
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                  <button
                    type="button"
                    className="text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer underline underline-offset-4"
                  >
                    Clear dates
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-[#222222] hover:bg-black text-white text-xs font-semibold rounded-full cursor-pointer transition-all shadow-sm active:scale-95 ml-auto sm:ml-0"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative min-w-35">
          <select
            name="sort"
            onChange={handleSorting}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:border-[#E65100] outline-none text-stone-800 appearance-none cursor-pointer"
          >
            <option value="startDate_asc">Soonest first</option>
            <option value="startDate_desc">Furthest out</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A – Z</option>
            <option value="title_desc">Title: Z – A</option>
          </select>
          <ChevronDown className="text-stone-400 w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" />
        </div>

        {/* Reset Filters CTA */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories horizontal pill bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Disciplines Pill */}
        <button
          type="button"
          onClick={() => updateParams({ category: "" })}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
            activeCategory === ""
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
          }`}
        >
          <span>All Category</span>
          {!isCategoriesLoading && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 ${
                activeCategory === ""
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.name
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 ${
                    activeCategory === cat.name
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
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${
                activeFormat === f
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
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              filters.isPaid === "" || null
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white border-[#DDD9CE] text-stone-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleIsPaid(false)} // isPaid = false
            type="button"
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              filters.isPaid === false
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => handleIsPaid(true)} // isPaid = true
            type="button"
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              filters.isPaid === true
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