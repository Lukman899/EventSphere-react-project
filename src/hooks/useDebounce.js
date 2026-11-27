// function searchEvent(query) {
//   //api calls
//   console.log("searching...", query);
// }

import { useEffect, useState } from "react";

// function debounce(fn, delay) {
//   let timer;
//   return function abc(...args) {
//     // rest operator

//     clearTimeout(timer); // clear previous timer

//     timer = setTimeout(() => {
//       fn(...args); // spread operator
//     }, delay);
//   };
// }

// const debouncedSearch = debounce(searchEvent, 350);

// debouncedSearch("r", 54, 34, 253, 235, 352, 532);
// debouncedSearch("re");
// debouncedSearch("rea");
// debouncedSearch("reac");
// debouncedSearch("react");
// searchEvent("r")
// searchEvent("re")
// searchEvent("rea")
// searchEvent("reac")
// searchEvent("react")

export function useDebounce(value, delay = 350) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}