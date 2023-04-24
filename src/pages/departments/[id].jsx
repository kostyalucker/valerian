import Link from "next/link";
import { Title } from "@/components/Title"
import { baseApiUrl } from '@/config'

export default function DepartmentPage(props) {
  const { machines } = props;

  return (
    <>
      <Title>
        Выберите станок
      </Title>
      <ul className="overflow-y-auto">
        <div className="flex text-center mb-2">
          <div className="p-2 border-2 w-12 shrink-0">№</div>
          <div className="p-2 border-2 w-32 shrink-0">Цех</div>
          <div className="p-2 border-2 w-32 shrink-0">Номер станка</div>
          <div className="p-2 border-2 w-32 shrink-0">Модель</div>
          <div className="p-2 border-2 w-32 shrink-0">Объем, л</div>
        </div>
        {machines?.map(({ _id, model, machineNumber, department, machineCapacity }, idx) => (
            <Link
              className="
                block
              "
              href={`/machines/${_id}`} key={_id}>
              <div className="inline-flex text-center mb-2 hover:bg-slate-50 hover:border-cyan-900 hover:border-2 border-2 border-transparent">
                <div className="p-2 border-2 w-12 shrink-0">{idx + 1}</div>
                <div className="p-2 border-2 w-32 shrink-0">{department.departmentNumber}</div>
                <div className="p-2 border-2 w-32 shrink-0">{machineNumber}</div>
                <div className="p-2 border-2 w-32 shrink-0">{model}</div>
                <div className="p-2 border-2 w-32 shrink-0">{machineCapacity}</div>
              </div>
            </Link>
          )
        )}
      </ul>
    </>
  )
}

DepartmentPage.auth = {
  loading: 'loading'
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await fetch(`${baseApiUrl}/machines?department=${id}`)

    if (!response.ok) {
      throw new Error('Error')
    }

    const machines = await response.json();

    return {
      props: {
        machines
      }
    }
  } catch (error) {
    return {
      props: {
        machines: []
      }
    }
  }
}