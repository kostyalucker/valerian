import { sortedDateDesc, sortedDateAsc } from "../utils/sorted";
import { useState } from "react";

type TableRow = {
  id: string;
  capacity: number;
  concentration: number;
  ph: number;
  date: string;
  creator: string;
  bacteriaAmount: string;
  fungi: string;
  conductivity: string;
  link: string;
};

type TableProps = {
  rows: any[];
  head: string[];
  onRowClick: (link: string) => void;
};

export function Table({ rows, head, onRowClick }: TableProps) {
  const [localRows, setLocalRows] = useState(rows);

  const [filters, setFilters] = useState({
    sorted: "ASC",
  });

  function sorted() {
    if (filters.sorted === "ASC") {
      setLocalRows(sortedDateDesc(rows));
      setFilters({
        sorted: "DESC",
      });
    } else if (filters.sorted === "DESC") {
      setLocalRows(sortedDateAsc(rows));
      setFilters({
        sorted: "ASC",
      });
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {head?.length > 0 &&
              head.map((th) => (
                <th key={th} scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                    <span>{th}</span>
                    {th === "Дата" && (
                      <div className="sort cursor-pointer" onClick={sorted}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrows-sort"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M3 9l4-4l4 4m-4 -4v14" />
                          <path d="M21 15l-4 4l-4-4m4 4v-14" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {localRows?.length > 0 &&
            localRows.map((row) => {
              return (
                <tr
                  onClick={() => onRowClick(row.link)}
                  key={row.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4"> {row.date}</td>
                  <td className="px-6 py-4">{row.creator}</td>
                  <td className="px-6 py-4">{row.ph}</td>
                  <td className="px-6 py-4">{row.concentration}</td>
                  <td className="px-6 py-4">{row.bacteriaAmount}</td>
                  <td className="px-6 py-4">{row.conductivity}</td>
                  <td className="px-6 py-4">{row.fungi}</td>
                  <td className="px-6 py-4">{row.addedOilAmount}</td>
                  <td className="px-6 py-4">{row.biocide}</td>
                  {row.capacity && (
                    <td className="px-6 py-4">{row.capacity}</td>
                  )}
                  {row.foreignOil && (
                    <td className="px-6 py-4">{row.foreignOil}</td>
                  )}
                  {row.serveserviceAdditives && (
                    <td className="px-6 py-4">{row.serviceAdditives}</td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
