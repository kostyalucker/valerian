
import { Title  } from '@/components/Title';
import { Table } from '@/components/Table';
import { useRouter } from 'next/router';
import { baseApiUrl } from '@/config'

export default function IndicatorsPage({ indicators }) {
  const router = useRouter()

  console.log(indicators);
  const tableData = indicators.indicators?.map((indicator, idx) => {
    const { ph, capacity, concentration, createdAt, _id, creatorName } = indicator;

    return {
      id: idx + 1,
      creator: creatorName,
      ph,
      concentration,
      capacity,
      date: createdAt,
      link: `/indicators/${_id}`
    }
  })

  const tableHead = ['Дата', 'Имя', 'pH', 'Долив', 'Концентрация'];

  function pushToIndicator(link) {
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