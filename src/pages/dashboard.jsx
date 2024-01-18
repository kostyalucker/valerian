import { getSession, signOut, useSession } from "next-auth/react";
import { baseApiUrl, baseUrl } from "@/config";
import Link from "next/link";
import { ROLES } from "@/constants/users";
import { utils, writeFile } from "xlsx";

export default function Dashboard(props) {
  const handleClick = async () => {
    const response = await fetch("/api/download-excel");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "example.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const links = {
    [ROLES.engineer]: "/customers",
    [ROLES.customer]: "/departments",
    [ROLES.superAdmin]: "/customers",
    default: "/customers",
  };

  const { data: session } = useSession();
  const user = session?.user;
  function getUrlCustomers() {
    const role = session?.user?.role;

    const keyRole = role || "default";
    return links[keyRole];
  }
  function generateExcelData(data) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelData = writeFile(workbook, "products.xlsx", {
      compression: true,
    });
    return excelData;
  }

  function downloadExcelFile(data) {
    const excelData = generateExcelData(data);
    const blob = new Blob([excelData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.txt");
    document.body.appendChild(link);
    link.click();
  }

  const dataDownload = [
    {
      _id: "65a90a9d184e34493c49d4dd",
      машина: "656f4f71801d9b8cd4fca7b7",
      ph: "2522",
      concentration: "232",
      conductivity: "4242",
      bacteriaAmount: "44",
      fungi: "присутствуют",
      foaming: "22",
      fungicide: "2424",
      smell: "Умеренный",
      presenceImpurities: "Нет",
      antiFoamAdditive: "242",
      batchNumberDate: "4",
      notesRecommendations: "242",
      creatorName: "Admin",
      addedOilAmount: "25",
      biocide: "1212",
      __v: 0,
      createdAt: "2024-01-18T11:25:17.389Z",
      updatedAt: "2024-01-18T11:25:17.389Z",
    },
  ];
  return (
    <section className=" place-items-center">
      <button onClick={() => downloadExcelFile(dataDownload)}>
        Download Excel
      </button>
      <Link className="text-blue-400 mb-2" href={getUrlCustomers()}>
        <div className="text-white w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center cursor-pointer">
          Мониторинг показателей
        </div>
      </Link>
    </section>
  );
}

Dashboard.auth = {
  role: "ADMIN",
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  if (session?.user?.role === "SUPERADMIN") {
    const response = await fetch(`${baseApiUrl}/users`);

    if (!response.ok) {
      return {
        props: {
          users: [],
        },
      };
    }

    const users = await response.json();

    return {
      props: {
        users,
      },
    };
  }

  return {
    props: {
      users: [],
    },
  };
}
