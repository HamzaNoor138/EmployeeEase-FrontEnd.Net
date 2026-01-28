import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAfflication() {
  const URL = endpoints.setup.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(

    () => ({
      products: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}



// Create a custom hook for submitting the form data
export function useSubmitFormData() {
  const URL = endpoints.setup.edit;

  const submitForm = async (data) => {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Send the form data as JSON
    });
    if (!response.ok) {
      throw new Error('Failed to submit the form.');
    }
    // Optionally, you can return the response data or handle it as needed
    const responseData = await response.json();
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitForm, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitForm,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
export function useSubmitFormDataadd() {
  const URL = endpoints.setup.add;

  const submitFormadd = async (data) => {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Send the form data as JSON
    });
    if (!response.ok) {
      throw new Error('Failed to submit the form.');
    }
    // Optionally, you can return the response data or handle it as needed
    const responseData = await response.json();
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormadd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormadd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
