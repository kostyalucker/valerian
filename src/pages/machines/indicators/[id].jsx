
import { Title  } from '@/components/Title';
import { Table } from '@/components/Table';
import { useRouter } from 'next/router';

export default function IndicatorsPage({ indicators }) {
  const router = useRouter()

  console.log(indicators);
  const tableData = indicators.indicators?.map((indicator, idx) => {
    const { ph, capacity, concentration, createdAt, _id } = indicator;
    const { firstName, lastName, patronymic } = indicator.creatorInfo;

    return {
      id: idx + 1,
      creator: `${firstName} ${lastName} ${patronymic}`,
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
    const response = await fetch(`http://localhost:3000/api/indicators?id=${id}`);

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