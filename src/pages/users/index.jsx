export default function UsersPage({ users }) {
  console.log(users);

  return (
    <>
      <h1>
        Hello
      </h1>
      <ul className="text-black">
        {users?.length > 0 && users.map(user => {
          return (
            <li key={user.id}>
              {user.name}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export async function getServerSideProps(ctx){
  let users = [];

  try {
    const response = await fetch('http://localhost:3000/api/users');
    const json = await response.json();

    if (!response.ok) {
      throw new Error('server error');
    }

    users = json;
  } catch (error) {
    console.log(error);
  } finally {
    return {
      props: { 
        users: users
      }
    }
  }
}