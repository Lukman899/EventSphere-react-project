import { useMemo } from "react";
import { useSearchParams } from "react-router";

export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isPaidParam = searchParams.get("isPaid");
  const filters = useMemo(() => {
    return {
      format: searchParams.get("format") || "",
      isPaid:
        isPaidParam === "true" ? true : isPaidParam === "false" ? false : "",
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "All",
      sort: searchParams.get("sort") || "startDate",
      order: searchParams.get("order") || "asc",
    };
  }, [searchParams]);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== null) {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  }

  function apiQueryString() {
    const params = new URLSearchParams();
    if (filters.format) {
      params.set("format", filters.format);
    }

    if (filters.isPaid !== "") {
      params.set("isPaid", String(filters.isPaid));
    }
    if (filters.category) {
      params.set("category", String(filters.category));
    }
    if (filters.search) {
      params.set("search", String(filters.search));
    }
    if (filters.city !== "All") {
      params.set("city", String(filters.city));
    }
    if (filters.sort) {
      params.set("sort", String(filters.sort));
    }
    if (filters.order) {
      params.set("order", String(filters.order));
    }

    return params.toString();
  }

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.search ||
      filters.category ||
      filters.city !== "All" ||
      filters.isPaid !== "" ||
      filters.order !== "asc" ||
      filters.sort !== "startDate" ||
      filters.format,
    );
  }, [filters]);

  function resetFilters (){
    setSearchParams(new URLSearchParams())
  }
  return {
    apiQueryString,
    updateParams,
    searchParams,
    filters,
    hasActiveFilters,
    resetFilters
  };
}
