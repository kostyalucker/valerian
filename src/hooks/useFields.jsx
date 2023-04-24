import { useEffect, useState } from "react";

export function useFields(fieldsCreatorCallback) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const createdFields = fieldsCreatorCallback();

    setFields(createdFields);
  }, []);

  return createdFields;
}