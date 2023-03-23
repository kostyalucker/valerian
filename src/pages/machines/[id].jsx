import { useRouter } from "next/router"
import { CreateIndicatorsForm } from "@/components/CreateIndicatorsForm";
import { useSession } from "next-auth/react";
import { IndicatorChart } from '@/components/Chart'
import { useMemo, useState } from "react";
import Link from "next/link";

export default function MachinePage({ machine }) {
  const session = useSession();
  const [lastCreatedIndicator, setLastCreatedIndicator] = useState({});
  const { info, indicators } = machine;
  const [indicatorsWithGraphics, setIndicatorsWithGraphics] = useState([]);
  const [toggledIndicators, setToggledIndicators] = useState({});
 
  useState(() => {
    const indicatorsClone = [...indicators];
    indicatorsClone.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    setLastCreatedIndicator(indicatorsClone[indicatorsClone.length - 1]);

    const indicatorsObj = indicatorsClone?.reduce((acc, curr) => {
      const { ph, capacity, concentration } = curr;
      
      if (!acc.ph) {
        acc.ph = [ph];
        acc.capacity = [capacity];
        acc.concentration = [concentration];
      } else {
        acc.ph.push(ph);
        acc.capacity.push(capacity);
        acc.concentration.push(concentration);
      }

      return acc;
    }, {});

    const labels = indicatorsClone.map(indicator => { 
      return indicator.createdAt;
    })

    const indicatorsNames = {
      ph: 'pH',
      capacity: 'Долив',
      concentration: 'Концентрация',
    }

    const formattedIndicators = Object.keys(indicatorsObj).map(key => {
      return {
        key,
        labels,
        datasets: [{
          label: indicatorsNames[key],
          data: indicatorsObj[key],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      }
    })

    const toggled = Object.keys(indicatorsObj).reduce((acc, curr) => {
      acc[curr] = false;

      return acc
    }, {});

    setToggledIndicators(toggled)
    setIndicatorsWithGraphics(formattedIndicators)
  }, [indicators])

  function onIndicatorsToggle(indicatorKey) {
    const toggledIndicatorState = toggledIndicators[indicatorKey];

    setToggledIndicators({
      ...toggledIndicators,
      [indicatorKey]: !toggledIndicatorState
    })
  }

  const creatorFullName = useMemo(() => {
    if (lastCreatedIndicator?.creatorInfo) {
      const { firstName, lastName, patronymic } = lastCreatedIndicator.creatorInfo;
      
      return ` ${firstName} ${patronymic} ${lastName}`
    }

    return '';
  }, [lastCreatedIndicator])

  function onIndicatorsCreateSuccess() {
    console.log('created')
  }

  return (
    <>
      <p><span className="font-bold">Номер станка:</span> {info?.machineNumber}</p>
      <p><span className="font-bold">Цех:</span> {info?.department.departmentNumber}</p>
      <p><span className="font-bold">Модель станка:</span> {info?.model}</p>
      <p className="mb-4"><span className="font-bold">Дата последних изменений станка:</span> {info?.createdAt}</p>
      <hr className="bg-gray-500 h-0.5 mb-4" />
      <p className="text-xl font-bold mb-4">Последние показания</p>
      <ul>
        <li className="mb-4">
          <p>
            <span span className="font-bold">Инженер:</span>{creatorFullName}
          </p>
        </li>
        {indicatorsWithGraphics.map(({ datasets, key, labels }) => {
          return (
            <li key={key} className="mb-4" onClick={() => onIndicatorsToggle(key)}>
              <p className="cursor-pointer hover:text-blue-400">
                <span span className="font-bold">{datasets[0].label}:</span>{lastCreatedIndicator[key]}
              </p>
              <div style={{
                height: '300px',
                display: toggledIndicators[key] ? 'block' : 'none'
              }}>
                <IndicatorChart data={{
                  datasets,
                  labels
                }} />
              </div>
            </li>
          )
        })}
          {/* <p><span className="font-bold">Концентрация, %:</span>{lastCreatedIndicator.concentration}</p>
          <p><span className="font-bold">Долив эмульсии, л:</span>{lastCreatedIndicator.capacity}</p>
          <p><span className="font-bold">Дата добавления:</span>{lastCreatedIndicator.createdAt}</p> */}
      </ul>
      <Link href={`/machines/indicators/${info._id}`}>Список показателей</Link>
      {session.data?.user.role === 'ENGINEER' &&  (
        <>
          <hr className="bg-gray-500 h-0.5 mb-4" />
          <CreateIndicatorsForm onIndicatorsCreateSuccess={onIndicatorsCreateSuccess} />
        </>
        )}
    </>
  )
}

MachinePage.auth = {
  loading: "loading",
};

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

