
import { Title  } from '@/components/Title';
import { Table } from '@/components/Table';
import { useRouter } from 'next/router';
import { baseApiUrl } from '@/config'
import { getSession, useSession } from "next-auth/react";

export default function IndicatorsPage({ indicators }) {
  const router = useRouter()
  const session = useSession()

  const tableData = indicators.indicators?.map((indicator, idx) => {
    const { ph, capacity, concentration, createdAt, bacteriaAmount, conductivity, fungi, _id, creatorName,
      addedOilAmount,
      foreignOil,
      biocide,
      serviceAdditives } = indicator;

    return {
      id: idx + 1,
      creator: creatorName,
      ph,
      concentration,
      capacity,
      date: createdAt,
      link: `/indicators/${_id}`,
      bacteriaAmount,
      conductivity,
      fungi,
      addedOilAmount,
      foreignOil,
      biocide,
      serviceAdditives
    }
  })

  const tableHead = ['Дата', 'Имя', 'pH', 'Долив', 'Концентрация', 'Количество бактерий', 'Электропроводность', 'Грибки',  'Долив', 'Постороннее масло', 'Добавлено биоцида', 'Добавлено сервисных присадок' ];

  function pushToIndicator(link) {
    if (session?.data?.user?.role === 'CUSTOMER') {
      return
    }

    router.push(link)
  }

  return (
    <>
      <Title className="mb-4">
        Indicators
      </Title>
      <Table onRowClick={pushToIndicator} rows={tableData} head={tableHead} />
    </>
  )
}

IndicatorsPage.auth = {
  loading: 'loading'
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await fetch(`${baseApiUrl}/indicators?id=${id}`);
    if (!response.ok) {
      throw new Error(`Server error`);
    }
    
    const indicators = await response.json();
    console.log(indicators)
    
    return {
      props: {
        indicators
      }
    }
  } catch (error) {
    return {
      props: {
        indicators: [],
      }
    }
  }
}