import { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

// Hook for infinite scroll loading
export function useInfiniteLoad() {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  return { ref, inView };
}

// Hook for form handling
export function useForm<T>(initialState: T, onSubmit: (data: T) => Promise<void>) {
  const [data, setData] = useState<T>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        await onSubmit(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [data, onSubmit]
  );

  return { data, setData, handleChange, handleSubmit, loading, error, setError };
}

// Hook for debounced search
export function useDebouncedSearch(callback: (value: string) => void, delay: number = 300) {
  const [search, setSearch] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      callback(search);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [search, callback, delay]);

  return { search, setSearch };
}

// Hook for API data fetching with caching
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  cacheKey?: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ [key: string]: T }>({});

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (cacheKey && cacheRef.current[cacheKey]) {
        setData(cacheRef.current[cacheKey]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          if (cacheKey) {
            cacheRef.current[cacheKey] = result;
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Hook for pagination
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  const goToPage = (page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return { currentPage, totalPages, skip, goToPage, nextPage, prevPage };
}

// Hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
