export const createAsyncActionTypes = actionType => ({
  success: `${actionType}-SUCCESS`,
  error: `${actionType}-ERROR`,
  processing: `${actionType}-PROCESSING`,
});

export const checkStatus = response => {
  if (response.status < 200 || response.status >= 400) {
    throw response.status;
  }

  return response;
};
