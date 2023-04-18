/**
 * reusable method tha returns base data paginated
 * @param currentPage current page
 * @param paginationSize limit of elements to be shown
 * @param arrayBase information base
 * @returns new array of current page
 */
export const getDataPaginated = (currentPage: number, paginationSize: number, arrayBase: any[]) => {
  const page = currentPage - 1;
  return arrayBase.slice(page * paginationSize, page * paginationSize + paginationSize);
};
