import { useGetIncidentByIdQuery } from '@/api';
import { reportApi } from '@/api/services/reportApi';
import { useDispatch } from 'react-redux';

/**
 * Hook for smart report data fetching
 * @param {string} incidentId - Incident ID to fetch
 * @param {boolean} shouldFetch - Whether to fetch the data
 * @param {Object} options - Additional options
 */
export const useSmartReportFetch = (incidentId, shouldFetch, options = {}) => {
  const {
    refetchOnMount = false,
    refetchOnFocus = false,
    refetchOnReconnect = false,
  } = options;

  return useGetIncidentByIdQuery(incidentId, {
    skip: !incidentId || !shouldFetch,
    refetchOnMountOrArgChange: refetchOnMount,
    refetchOnFocus: refetchOnFocus,
    refetchOnReconnect: refetchOnReconnect,
  });
};

/**
 * Hook for prefetching on hover
 * @param {string} incidentId - Incident ID to prefetch
 */
export const usePrefetchOnHover = (incidentId) => {
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    if (incidentId) {
      // Use RTK Query's prefetch
      dispatch(reportApi.util.prefetch('getIncidentById', incidentId, { force: false }));
    }
  };

  return handleMouseEnter;
};
