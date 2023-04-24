import { useRouter } from "next/router"
import { CreateIndicatorsForm } from "@/components/CreateIndicatorsForm";
import { useSession } from "next-auth/react";
import { IndicatorChart } from '@/components/Chart'
import Button from '@/components/Button'
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from 'date-fns'


export default function MachinePage({ baseUrl }) {
  const session = useSession();
  const router = useRouter();

  const { id } = router.query;

  const [lastCreatedIndicator, setLastCreatedIndicator] = useState({});
  const [indicatorsWithGraphics, setIndicatorsWithGraphics] = useState([]);
  const [toggledIndicators, setToggledIndicators] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [standards, setStandards] = useState({});
  const [info, setInfo] = useState([]);

  const getMachineData = useCallback(async function () {
    if (!id) {
      router.push('/machines')
    }

    const response = await fetch(`${baseUrl}/api/machines/${id}`);
    const data = await response.json();
    
    const responseMachineStandards = await fetch(`${baseUrl}/api/machineOperations?machineType=${data.info.machineType}`);
    const machineStandards = await responseMachineStandards.json();

    setStandards(machineStandards[0].standards)

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
      const { 
        ph, conductivity, concentration, fungi, bacteriaAmount,
        addedOilAmount,
        foreignOil,
        biocide,
        serviceAdditives,
      } = curr;
      
      if (!acc.ph) {
        acc.ph = [ph];
        acc.conductivity = [conductivity];
        acc.fungi = [fungi];
        acc.bacteriaAmount = [bacteriaAmount];
        acc.concentration = [concentration];
        acc.addedOilAmount = [addedOilAmount]
        acc.foreignOil = [foreignOil]
        acc.biocide = [biocide]
        acc.serviceAdditives = [serviceAdditives]
      } else {
        acc.ph.push(ph);
        acc.bacteriaAmount.push(bacteriaAmount);
        acc.fungi.push(fungi);
        acc.conductivity.push(conductivity);
        acc.concentration.push(concentration);
        acc.addedOilAmount.push(addedOilAmount);
        acc.foreignOil.push(foreignOil);
        acc.biocide.push(biocide);
        acc.serviceAdditives.push(serviceAdditives);
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
      addedOilAmount: 'Долив',
      foreignOil: 'Постороннее масло',
      biocide: 'Добавлено биоцида',
      serviceAdditives: 'Добавлено сервисных присадок',
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

  function getIndicatorStatus(indicatorName) {
    if (indicatorName === 'fungi') {
      if (lastCreatedIndicator[indicatorName] === 'отсутствуют') {
        return true
      } else {
        return false
      }
    } 

    if (Number(lastCreatedIndicator[indicatorName]) > Number(standards[indicatorName].max) || Number(lastCreatedIndicator[indicatorName]) < Number(standards[indicatorName].min)) {
      return false;
    }

    return true;
  }

  function onIndicatorsCreateSuccess() {
    console.log('created')
    getMachineData();
  }

  function getFormattedDate(date) {
    if (!date) {
      return '';
    }

    return format(new Date(date), 'yyyy-MM-dd HH:MM:SS')
  }

  return (
    <>
      <p><span className="font-bold">Номер станка:</span> {info?.machineNumber}</p>
      <p><span className="font-bold">Цех:</span> {info?.department?.departmentNumber}</p>
      <p><span className="font-bold">Модель станка:</span> {info?.model}</p>
      <p><span className="font-bold">Емкость системы:</span> {info?.machineCapacity}</p>
      {getFormattedDate(info?.emulsionFillingDate) && <div><span className="font-bold">Дата заливки эмульсии:</span> {getFormattedDate(info?.emulsionFillingDate)}</div>}
      <p className="mb-4"><span className="font-bold">Дата внесения последних показателей:</span> {getFormattedDate(lastCreatedIndicator?.createdAt)}</p>
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
              <p className="cursor-pointer hover:text-blue-400 flex items-center">
                <span span className="font-bold mr-1">{datasets[0].label}:</span>{lastCreatedIndicator[key]} {standards[key] && (<div className={`ml-4 w-4 h-4 rounded-full ${getIndicatorStatus(key) ? 'bg-green-400' : 'bg-red-400'}`}></div>)}
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
      {lastCreatedIndicator && <Link href={`/machines/indicators/${info?._id}`}>
          <Button className="mb-4">
            Список показателей
          </Button>
      </Link>}
      {(session.data?.user.role === 'ENGINEER' || session.data?.user.role === 'SUPERADMIN') &&  (
        <>
          <CreateIndicatorsForm onIndicatorsCreateSuccess={onIndicatorsCreateSuccess} />
        </>
        )}
    </>
  )
}

MachinePage.auth = {
  loading: "loading",
};

export function getServerSideProps() {
  return {
    props: {
      baseUrl: process.env.NEXTAUTH_URL
    }
  }
}