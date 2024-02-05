import { useRouter } from "next/router";
import { CreateIndicatorsForm } from "@/components/CreateIndicatorsForm";
import { useSession } from "next-auth/react";
import { IndicatorChart } from "@/components/Chart";
import Button from "@/components/Button";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

export default function MachinePage({ baseUrl }) {
  const session = useSession();
  const router = useRouter();

  const { id } = router.query;

  const [lastCreatedIndicator, setLastCreatedIndicator] = useState({});
  const [indicatorsWithGraphics, setIndicatorsWithGraphics] = useState([]);
  const [toggledIndicators, setToggledIndicators] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [standards, setStandards] = useState({});
  const [info, setInfo] = useState({});

  const getMachineData = useCallback(
    async function () {
      if (!id) {
        router.push("/machines");
      }

      const response = await fetch(`${baseUrl}/api/machines/${id}`);
      const data = await response.json();

      const TEMP_STANDARDS = {
        ph: {
          min: data.info.phMin,
          max: data.info.phMax,
        },
        concentration: {
          min: data.info.recommendedConcentration - 0.5,
          max: data.info.recommendedConcentration + 1,
        },
      };
      setStandards(TEMP_STANDARDS);

      setIndicators(data.indicators);
      setInfo(data.info);
    },
    [id, router]
  );

  useEffect(() => {
    getMachineData();
  }, [id, getMachineData]);

  useEffect(() => {
    const indicatorsClone = [...indicators];
    indicatorsClone.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setLastCreatedIndicator(indicatorsClone[indicatorsClone.length - 1]);

    const indicatorsObj = indicatorsClone?.reduce((acc, curr) => {
      const {
        concentration,
        ph,
        conductivity,
        bacteriaAmount,
        fungi,
        foaming,
        addedOilAmount,
        biocide,
        smell,
        presenceImpurities,
        antiFoamAdditive,
        fungicide,
      } = curr;

      if (!acc.ph) {
        acc.ph = [ph];
        acc.conductivity = [conductivity];
        acc.fungi = [fungi];
        acc.foaming = [foaming];
        acc.bacteriaAmount = [bacteriaAmount];
        acc.concentration = [concentration];
        acc.addedOilAmount = [addedOilAmount];
        (acc.smell = [smell]),
          (acc.presenceImpurities = [presenceImpurities]),
          (acc.biocide = [biocide]);
        // acc.serviceAdditives = [serviceAdditives];
        (acc.antiFoamAdditive = [antiFoamAdditive]),
          (acc.fungicide = [fungicide]);
      } else {
        acc.ph.push(ph);
        acc.bacteriaAmount.push(bacteriaAmount);
        acc.fungi.push(fungi);
        acc.conductivity.push(conductivity);
        acc.concentration.push(concentration);
        acc.addedOilAmount.push(addedOilAmount);
        acc.smell.push(smell),
          acc.presenceImpurities.push(presenceImpurities),
          acc.biocide.push(biocide);
        // acc.serviceAdditives.push(serviceAdditives);
        acc.antiFoamAdditive.push(antiFoamAdditive),
          acc.fungicide.push(fungicide);
      }

      return acc;
    }, {});

    const labels = indicatorsClone.map((indicator) => {
      return indicator.createdAt;
    });

    const indicatorsNames = {
      concentration: "Концентрация",
      ph: "pH",
      conductivity: "Электропроводность",
      bacteriaAmount: "Бактерии",
      fungi: "Грибки",
      foaming: "Пенообразование",
      smell: "Запах",
      addedOilAmount: "Долив",
      presenceImpurities: "Наличие посторонних примесей",
      biocide: "Добавлено биоцида",
      antiFoamAdditive: "Антипенная",
      fungicide: "Фунгицид",
      // serviceAdditives: "Добавлено сервисных присадок",
    };

    const formattedIndicators = Object.keys(indicatorsObj).map((key) => {
      return {
        key,
        labels,
        datasets: [
          {
            label: indicatorsNames[key],
            data: indicatorsObj[key],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
    });

    const toggled = Object.keys(indicatorsObj).reduce((acc, curr) => {
      acc[curr] = false;

      return acc;
    }, {});

    setToggledIndicators(toggled);
    setIndicatorsWithGraphics(formattedIndicators);
  }, [indicators]);

  function onIndicatorsToggle(indicatorKey) {
    const toggledIndicatorState = toggledIndicators[indicatorKey];

    setToggledIndicators({
      ...toggledIndicators,
      [indicatorKey]: !toggledIndicatorState,
    });
  }

  function getIndicatorStatus(indicatorName) {
    if (indicatorName === "fungi") {
      if (lastCreatedIndicator[indicatorName] === "отсутствуют") {
        return true;
      } else {
        return false;
      }
    }
    if (
      Number(lastCreatedIndicator[indicatorName]) >
        Number(standards[indicatorName].max) ||
      Number(lastCreatedIndicator[indicatorName]) <
        Number(standards[indicatorName].min)
    ) {
      return false;
    }

    return true;
  }

  function onIndicatorsCreateSuccess() {
    getMachineData();
  }

  function getFormattedDate(date) {
    if (!date) {
      return "";
    }

    return format(new Date(date), "yyyy-MM-dd HH:mm");
  }
  const downloadReport = async () => {
    const data = {
      companyName: info?.department?.user?.name,
      adress: info?.department?.user?.address,
      departmentName: info?.department?.name,
      name: info?.department?.contactName,
      position: info?.department?.position,
      machineType: info?.type,
      machineModel: info?.model,
      machineNumber: info?.machineNumber,
      machineCapacity: info?.machineCapacity,
    };

    try {
      const response = await fetch("/api/template-excel-js", {
        method: "POST",
        body: JSON.stringify({
          data: data,
          indicators: indicators,
          generalInformation: {
            fillingDate: info?.fillingDate,
            recommendeConcentration: info?.recommendeConcentration,
          },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "filledData.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("An error occurred while filling the Excel template");
      }
    } catch (error) {
      console.error("An error occurred while communicating with the server");
    }
  };
  return (
    <>
      <p>
        <p className="mb-4">
          <span className="font-bold">Предприятие:</span>{" "}
          {info?.department?.user?.name}
          <p>
            <span className="font-bold">Цех:</span> {info?.department?.name}
          </p>
        </p>
      </p>

      <p>
        <span className="font-bold">Номер станка:</span> {info?.machineNumber}
      </p>
      <p>
        <span className="font-bold">Тип станка:</span> {info?.type}
      </p>
      <p>
        <span className="font-bold">Модель станка:</span> {info?.model}
      </p>
      <p>
        <span className="font-bold">Емкость системы:</span>{" "}
        {info?.machineCapacity}(Л)
      </p>
      <p>
        <span className="font-bold">Название СОЖ </span>
        <span>{info.oilName}</span>
      </p>
      <p>
        <span className="font-bold">Коэф. рефракции:</span>
        <span>{info.refractionCoefficient}</span>(%)
      </p>
      <p>
        <span className="font-bold">Рекомендуемая концентрация: </span>
        <span>{info.recommendeConcentration}%</span>
      </p>
      {getFormattedDate(info?.emulsionFillingDate) && (
        <div>
          <span className="font-bold">Дата заливки эмульсии:</span>{" "}
          {getFormattedDate(info?.emulsionFillingDate)}
        </div>
      )}
      <p className="mb-4">
        <span className="font-bold">Дата внесения последних показателей:</span>{" "}
        {getFormattedDate(lastCreatedIndicator?.createdAt)}
      </p>
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
              <span span className="font-bold">
                Инженер:
              </span>{" "}
              {lastCreatedIndicator?.creatorName}
            </p>
          </li>
        )}
        {indicatorsWithGraphics.map(({ datasets, key, labels }) => {
          return (
            <li
              key={key}
              className="mb-4"
              onClick={() => onIndicatorsToggle(key)}
            >
              <p className="cursor-pointer hover:text-blue-400 flex items-center">
                <span span className="font-bold mr-1">
                  {datasets[0].label}:
                </span>
                {lastCreatedIndicator[key]}
                {key === "addedOilAmount" && " (Л)"}
                {key === "concentration" && " (%)"}
                {(key === "ph" || key === "concentration") &&
                  standards[key] && (
                    <div
                      className={`ml-4 w-4 h-4 rounded-full ${
                        getIndicatorStatus(key) ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                  )}
              </p>
              <div
                style={{
                  height: "300px",
                  display: toggledIndicators[key] ? "block" : "none",
                }}
              >
                <IndicatorChart
                  data={{
                    datasets,
                    labels,
                  }}
                />
              </div>
            </li>
          );
        })}
        {/* <p><span className="font-bold">Концентрация, %:</span>{lastCreatedIndicator.concentration}</p>
          <p><span className="font-bold">Долив эмульсии, л:</span>{lastCreatedIndicator.capacity}</p>
          <p><span className="font-bold">Дата добавления:</span>{lastCreatedIndicator.createdAt}</p> */}
      </ul>
      <div className="flex">
        <h2 className="font-bold mr-2">Примечания и рекомендации:</h2>{" "}
        <span>{lastCreatedIndicator?.notesRecommendations}</span>
      </div>
      {lastCreatedIndicator && (
        <Link href={`/machines/indicators/${info?._id}`}>
          <Button className="mb-4 mr-4">Список показателей</Button>
        </Link>
      )}
      {/* {(session.data?.user.role === "ENGINEER" ||
        session.data?.user.role === "SUPERADMIN") && ( */}
      <>
        <Link
          href={`/machines/indicators/add/?id=${info?._id}`}
          className="mr-4"
        >
          <Button className="mt-4">Внести показания</Button>
        </Link>
        <Button onClick={downloadReport} className="mt-4">
          Cкачать отчеты
        </Button>
        {/* <CreateIndicatorsForm
            onIndicatorsCreateSuccess={onIndicatorsCreateSuccess}
          /> */}
      </>
      {/* )} */}
      <div className="buttons mt-4">
        <Button className="mr-4" onClick={() => router.back()}>
          Назад
        </Button>
        <Link href={"/dashboard"}>
          <Button>Домой</Button>
        </Link>
      </div>
    </>
  );
}

MachinePage.auth = {
  loading: "loading",
};

export function getServerSideProps() {
  return {
    props: {
      baseUrl: process.env.NEXTAUTH_URL,
    },
  };
}
