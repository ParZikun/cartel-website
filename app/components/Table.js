export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.Header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.Header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, i) => {
                  return (
                    <tr key={i} onClick={() => onRowClick(row)} className="hover:bg-gray-100 cursor-pointer">
                      {columns.map((column) => {
                        const value = row[column.accessor]
                        if (column.accessor === 'imageUrl') {
                          return (
                            <td key={column.Header} className="px-6 py-4 whitespace-nowrap">
                              <img src={value} alt="" className="h-10 w-10 rounded-full" />
                            </td>
                          )
                        }
                        return (
                          <td key={column.Header} className="px-6 py-4 whitespace-nowrap">
                            {value}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
