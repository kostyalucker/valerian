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

      const response = await fetch(`/api/machines/${id}`);
      const data = await response.json();

      const TEMP_STANDARDS = {
        ph: {
          min: "8.7",
          max: "11",
        },
        concentration: {
          min: "0",
          max: "4",
        },
        conductivity: {
          min: "0",
          max: "6000",
        },
        bacteriaAmout: {
          min: "0",
          max: "100000",
        },
        fungi: {
          min: "0",
          max: "0",
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
        ph,
        conductivity,
        concentration,
        fungi,
        bacteriaAmount,
        addedOilAmount,
        foreignOil,
        biocide,
        serviceAdditives,
        foaming,
      } = curr;

      if (!acc.ph) {
        acc.ph = [ph];
        acc.conductivity = [conductivity];
        acc.fungi = [fungi];
        acc.foaming = [foaming];
        acc.bacteriaAmount = [bacteriaAmount];
        acc.concentration = [concentration];
        acc.addedOilAmount = [addedOilAmount];
        acc.foreignOil = [foreignOil];
        acc.biocide = [biocide];
        acc.serviceAdditives = [serviceAdditives];
      } else {
        acc.ph.push(ph);
        acc.bacteriaAmount.push(bacteriaAmount);
        acc.fungi.push(fungi);
        acc.foaming.push(foaming);
        acc.conductivity.push(conductivity);
        acc.concentration.push(concentration);
        acc.addedOilAmount.push(addedOilAmount);
        acc.foreignOil.push(foreignOil);
        acc.biocide.push(biocide);
        acc.serviceAdditives.push(serviceAdditives);
      }

      return acc;
    }, {});

    const labels = indicatorsClone.map((indicator) => {
      return indicator.createdAt;
    });

    const indicatorsNames = {
      ph: "pH",
      conductivity: "Электропроводность",
      concentration: "Концентрация",
      fungi: "Грибки",
      foaming: "Пенообразование",
      bacteriaAmount: "Бактерии",
      addedOilAmount: "Долив",
      foreignOil: "Постороннее масло",
      biocide: "Добавлено биоцида",
      serviceAdditives: "Добавлено сервисных присадок",
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

    router.back();
  }

  function getFormattedDate(date) {
    if (!date) {
      return "";
    }

    return format(new Date(date), "yyyy-MM-dd HH:mm");
  }

  return (
    <>
      {/* {(session.data?.user.role === "ENGINEER" ||
        session.data?.user.role === "SUPERADMIN") && ( */}
      <>
        <CreateIndicatorsForm
          onIndicatorsCreateSuccess={onIndicatorsCreateSuccess}
        />
        <div className="buttons mt-4">
          <Button className="mr-4" onClick={() => router.back()}>
            Назад
          </Button>
          <Link href={"/dashboard"}>
            <Button>Домой</Button>
          </Link>
        </div>
      </>
      {/* )} */}
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
