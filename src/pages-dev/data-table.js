import React from 'react'

const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
const listObj = [
  { firstname: 'Jill', lastname: 'Smith', age: 50 },
  { firstname: 'Eve', lastname: 'Jackson', age: 94 },
  { firstname: 'Jill', lastname: 'Smith', age: 50 },
  { firstname: 'Eve', lastname: 'Jackson', age: 94 },
  { firstname: 'Jill', lastname: 'Smith', age: 50 },
  { firstname: 'Eve', lastname: 'Jackson', age: 94 },
  { firstname: 'Jill', lastname: 'Smith', age: 50 },
  { firstname: 'Eve', lastname: 'Jackson', age: 94 }
]

export default function DataTablePage () {
  return (
    <>
      <div>
        <ul className='List'>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '5rem' }}>
        <table className='Table'>
          <thead>
            <tr>
              <th>firstname</th>
              <th>lastname</th>
              <th>age</th>
            </tr>
          </thead>
          <tbody>
            {listObj.map(({ firstname, lastname, age }, i) => (
              <tr key={i}>
                <td>{firstname}</td>
                <td>{lastname}</td>
                <td>{age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
