import mysql from 'mysql2/promise'

export async function query(query: string, values: Array<string>) {
  const connection = await mysql.createConnection({
    connectionLimit: 5,
    host: 'sql7.freesqldatabase.com',
    user: 'sql7598542',
    database: 'sql7598542',
    password: '9H71KGcGMH'
  });

  try {
    const [results] = await connection.execute(query, values);

    connection.end();

    return results;
  } catch (error) {
    console.log('query error: ' + typeof error + error);

    // @ts-ignore
    throw Error(error);
  }
}