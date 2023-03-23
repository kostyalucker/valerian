import Link from "next/link";

type TableRow = {
  id: string;
  capacity: number;
  concentration: number;
  ph: number;
  date: string;
  creator: string;
  link: string;
};

type TableProps = {
  rows: TableRow[];
  head: string[];
  onRowClick: (link: string) => void;
};

export function Table({ rows, head, onRowClick }: TableProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {head?.length > 0 &&
              head.map((th) => (
                <th key={th} scope="col" className="px-6 py-3">
                  {th}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 &&
            rows.map((row) => {
              return (
                <tr onClick={() => onRowClick(row.link)} key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4">{row.creator}</td>
                  <td className="px-6 py-4">{row.ph}</td>
                  <td className="px-6 py-4">{row.capacity}</td>
                  <td className="px-6 py-4">{row.concentration}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
