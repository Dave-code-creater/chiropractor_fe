export const extractList = (response, key) => {
  if (!response) return [];

  const layers = [response, response.data, response.data?.data, response.meta, response.data?.meta];

  for (const layer of layers) {
    if (!layer) continue;

    if (Array.isArray(layer)) {
      return layer;
    }

    if (key && Array.isArray(layer[key])) {
      return layer[key];
    }
  }

  if (key && Array.isArray(response?.[key])) {
    return response[key];
  }

  return [];
};

export const extractPagination = (response) => {
  return response?.data?.pagination || response?.meta?.pagination || response?.data?.meta?.pagination || null;
};
