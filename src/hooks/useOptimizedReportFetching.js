import { useGetIncidentByIdQuery } from '@/api';
import { reportApi } from '@/api/services/reportApi';
import { useDispatch } from 'react-redux';

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

export const usePrefetchOnHover = (incidentId) => {
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    if (incidentId) {
      dispatch(reportApi.util.prefetch('getIncidentById', incidentId, { force: false }));
    }
  };

  return handleMouseEnter;
};
