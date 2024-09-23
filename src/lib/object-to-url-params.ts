/**
 * Converts an object to URL search parameters.
 *
 * @param obj - The object to convert.
 * @param prefix - The prefix to add to each parameter key.
 * @returns The URLSearchParams object representing the converted object.
 */
export default function objectToUrlParams(
  obj: Record<string, string | number | object | (string | number)[]>,
  prefix = ''
): URLSearchParams {
  const params = new URLSearchParams();

  // Helper function to add a parameter to the URLSearchParams object
  function addParam(key: string, value: string | number | object | (string | number)[]): void {
    if (Array.isArray(value)) {
      // If the value is an array, join its elements with a comma and append to the params
      params.append(key, value.join(','));
    } else if (typeof value === 'object' && value !== null) {
      // If the value is an object, recursively iterate over its properties and add them as parameters
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        // Type assertion to handle the value type correctly
        addParam(`${key}[${nestedKey}]`, nestedValue as string | number | (string | number)[]);
      }
    } else {
      // For all other types of values, simply append them to the params
      params.append(key, String(value));
    }
  }

  // Iterate over the properties of the input object
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}${key}` : key;
    // Add each property to the params using the addParam helper function
    addParam(fullKey, value);
  }

  // Return the URLSearchParams object representing the converted object
  return params;
}
