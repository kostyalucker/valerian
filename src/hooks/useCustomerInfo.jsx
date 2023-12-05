import { useEffect, useState } from "react";

export function useCustomerInfo(customerId) {
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomerInfo(customerId);
    }
  }, [customerId]);

  async function fetchCustomerInfo(id) {
    try {
      const response = await fetch(`/api/users/${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data);
      } else {
        // Обработка ошибки, если не удалось получить данные
      }
    } catch (error) {
      // Обработка ошибки fetch
    }
  }

  return { customerInfo };
}
