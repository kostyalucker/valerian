import { useRouter } from "next/router"
import { CreateIndicatorsForm } from "@/components/CreateIndicatorsForm";
import { useSession } from "next-auth/react";
import { IndicatorChart } from '@/components/Chart'
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { baseApiUrl } from '@/config'

export default function MachinePage({ machine }) {
  const session = useSession();
  const router = useRouter();

  const { id } = router.query;

  const [lastCreatedIndicator, setLastCreatedIndicator] = useState({});
  const [indicatorsWithGraphics, setIndicatorsWithGraphics] = useState([]);
  const [toggledIndicators, setToggledIndicators] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [info, setInfo] = useState([]);

  const getMachineData = useCallback(async function () {
    if (!id) {
      router.push('/machines')
    }

    const response = await fetch(`${baseApiUrl}/machines/${id}`, {
      mode: 'cors'
    });
    const data = await response.json();

    setIndicators(data.indicators);
    setInfo(data.info);
  }, [id, router])

  useEffect(() => {
    getMachineData();
  }, [id, getMachineData])

  useEffect(() => {
    const indicatorsClone = [...indicators];
    indicatorsClone.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    setLastCreatedIndicator(indicatorsClone[indicatorsClone.length - 1]);

    const indicatorsObj = indicatorsClone?.reduce((acc, curr) => {
      const { ph, conductivity, concentration, fungi, bacteriaAmount } = curr;
      
      if (!acc.ph) {
        acc.ph = [ph];
        acc.conductivity = [conductivity];
        acc.fungi = [fungi];
        acc.bacteriaAmount = [bacteriaAmount];
        acc.concentration = [concentration];
      } else {
        acc.ph.push(ph);
        acc.bacteriaAmount.push(bacteriaAmount);
        acc.fungi.push(fungi);
        acc.conductivity.push(conductivity);
        acc.concentration.push(concentration);
      }

      return acc;
    }, {});

    const labels = indicatorsClone.map(indicator => { 
      return indicator.createdAt;
    })

    const indicatorsNames = {
      ph: 'pH',
      conductivity: 'Электропроводность',
      concentration: 'Концентрация',
      fungi: 'Грибки',
      bacteriaAmount: 'Бактерии',
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

  function onIndicatorsCreateSuccess() {
    console.log('created')
    getMachineData();
  }

  return (
    <>
      <p><span className="font-bold">Номер станка:</span> {info?.machineNumber}</p>
      <p><span className="font-bold">Цех:</span> {info?.department?.departmentNumber}</p>
      <p><span className="font-bold">Модель станка:</span> {info?.model}</p>
      <p className="mb-4"><span className="font-bold">Дата последних изменений станка:</span> {info?.createdAt}</p>
      {lastCreatedIndicator && (
        <>
          <hr className="bg-gray-500 h-0.5 mb-4" />
          <p className="text-xl font-bold mb-4">Последние показания</p>
        </>
      )}
      <ul>
        {lastCreatedIndicator && (
          <li className="mb-4">
            <p>
              <span span className="font-bold">Инженер:</span> {lastCreatedIndicator?.creatorName}
            </p>
          </li>
        )}
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
      {lastCreatedIndicator && <Link href={`/machines/indicators/${info?._id}`}>Список показателей</Link>}
      {(session.data?.user.role === 'ENGINEER' || session.data?.user.role === 'SUPERADMIN') &&  (
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

