import { useRouter } from "next/router"
import { CreateIndicatorsForm } from "@/components/CreateIndicatorsForm";

export default function MachinePage({ machine }) {
  const router = useRouter();
  const { id } = router.query;
  const { info, indicators } = machine;

  return (
    <>
      <p><span className="font-bold">Номер станка:</span> {info?.machineNumber}</p>
      <p><span className="font-bold">Цех:</span> {info?.department.departmentNumber}</p>
      <p><span className="font-bold">Модель станка:</span> {info?.model}</p>
      <p className="mb-4"><span className="font-bold">Дата последних изменений станка:</span> {info?.createdAt}</p>
      <br />
      <br />
      <ul>
        <li>
          <p><span className="font-bold">id:</span>{indicators._id}</p>
          <p><span className="font-bold">pH:</span>{indicators.ph}</p>
          <p><span className="font-bold">Дата добавления:</span>{indicators.createdAt}</p>
        </li>
      </ul>
      <CreateIndicatorsForm />
    </>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const response = await fetch(`http://localhost:3000/api/machines/${id}`);

    if (!response.ok) {
      throw new Error('server error')
    }

    const json = await response.json();

    return {
      props: {
        machine: {
          info: json.info,
          indicators: json.indicators
        },
      }
    }
  } catch (error) {
    console.log(error);

    return {
      props: {
        machine: {}
      }
    }
  }
}

