import { useMemo } from 'react';

/**
 * useGlobalSearch — filters inventory data by search term and returns
 * matching items plus highlighted match indices.
 *
 * @param {string} searchTerm - search query
 * @param {Array} inventoryData - array of inventory items
 * @returns {{ results: Array, matchCount: number }}
 */
export function useGlobalSearch(searchTerm, inventoryData = []) {
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') return inventoryData;

    const lower = searchTerm.toLowerCase().trim();

    return inventoryData.filter((item) => {
      const searchableFields = [
        item.name,
        item.type,
        item.foundationModel,
        item.businessOwner,
        item.department,
        item.mrm_tier,
        item.validationStatus,
        item.dataClassification,
        item.governanceStatus,
        item.vendor,
        item.description,
        ...(item.regulations || []),
      ].filter(Boolean);

      return searchableFields.some((field) =>
        String(field).toLowerCase().includes(lower)
      );
    });
  }, [searchTerm, inventoryData]);

  return {
    results,
    matchCount: results.length,
    totalCount: inventoryData.length,
    isFiltered: searchTerm && searchTerm.trim() !== '',
  };
}
