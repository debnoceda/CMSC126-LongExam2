import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import '../styles/Transaction.css';

const Table = ({ transactions, onViewDetails }) => {
  const columns = useMemo(() => [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Date', accessor: 'date' },
    {
      Header: 'Category',
      accessor: row => row.category?.name || 'N/A'
    },
    {
      Header: 'Wallet',
      accessor: row => row.wallet?.name || 'N/A'
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ row }) => (
        <p className={row.original.transaction_type === 'income' ? 'amount-positive' : 'amount-negative'}>
          {row.original.transaction_type === 'income' ? '+' : '-'}₱ {parseFloat(row.original.amount).toFixed(2)}
        </p>
      )
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: () => (
        <p>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onViewDetails();
          }}>
            View Details
          </a>
        </p>
      )
    }
  ], [onViewDetails]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    { columns, data: useMemo(() => transactions, [transactions]) },
    useSortBy
  );

  return (
    <div className="scrollable-table-wrapper">
        <table {...getTableProps()} className="transactions-table">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        <h3>{column.render('Header')}</h3>
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>
                        <p>{cell.render('Cell')}</p>
                    </td>
                    ))}
                </tr>
                );
            })}
            </tbody>
        </table>
    </div>
  );
};

export default Table;
