export function extractUniqueValues<T, K extends keyof T, R>(
    items: T[],
    property: K,
    mapFn: (item: any) => R
  ): R[] {
    if (!Array.isArray(items)) {
      throw new Error("The first argument 'items' must be an array.");
    }
  
    if (typeof property !== "string") {
      throw new Error("The second argument 'property' must be a string.");
    }
  
    if (typeof mapFn !== "function") {
      throw new Error("The third argument 'mapFn' must be a function.");
    }
  
    try {
      return Array.from(
        new Set(
          items.flatMap((item) => {
            if (!item || typeof item[property] === "undefined") {
              throw new Error(`Property '${String(property)}' is undefined in one or more items.`);
            }
  
            const jsonString = item[property].toString();
  
            if (jsonString.trim() === "") {
              throw new Error(`Property '${String(property)}' contains an empty string in one or more items.`);
            }
  
            let parsedData;
            try {
              parsedData = JSON.parse(jsonString);
            } catch (error) {
              throw new Error(`Failed to parse JSON from property '${String(property)}': ${error.message}`);
            }
  
            if (!Array.isArray(parsedData)) {
              throw new Error(`Parsed data from property '${String(property)}' is not an array.`);
            }
  
            return parsedData.map(mapFn);
          })
        )
      );
    } catch (error) {
      console.error("An error occurred during processing:", error.message);
      return [];
    }
  }
  
  export function extractUniqueValuesArray<T, R>(
    items: T[],
    subArraySelector: (item: T) => R[],
    keySelector: (data: R) => string // Hàm chọn key linh động
  ): R[] {
    try {
      const uniqueMap = items.reduce((map, item) => {
        const parsedData = subArraySelector(item);
        parsedData.forEach((data) => {
          const key = keySelector(data); // Sử dụng keySelector để lấy key
          if (!map.has(key)) {
            map.set(key, data);
          }
        });
        return map;
      }, new Map<string, R>());
  
      return Array.from(uniqueMap.values());
    } catch (error) {
      console.error("An error occurred during processing:", error.message);
      return [];
    }
  }
  