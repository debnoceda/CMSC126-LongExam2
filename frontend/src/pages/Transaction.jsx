import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import Header from '../components/Header';
import api from '../api';
import '../styles/Transaction.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/transactions/');
        console.log('Transactions:', response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    if (!transactions.length) return alert("No transactions to export.");

    const headers = ["Title", "Date", "Category", "Wallet", "Amount", "Type"];
    const rows = transactions.map(({ title, date, category_name, wallet_name, amount, transaction_type }) => (
      [title, date, category_name || "", wallet_name || "", amount, transaction_type]
    ));

    const csv = [headers, ...rows].map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: "transactions.csv"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
        <span className={row.original.transaction_type === 'income' ? 'amount-positive' : 'amount-negative'}>
          {row.original.transaction_type === 'income' ? '+' : '-'}₱ {parseFloat(row.original.amount).toFixed(2)}
        </span>
      )
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: () => (
        <a href="#" onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}>
          View Details
        </a>
      )
    }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable({ columns, data: useMemo(() => transactions, [transactions]), initialState: { pageSize: 5 } }, useSortBy, usePagination);

  return (
    <>
      <Header onAddTransaction={() => setIsModalOpen(true)} />
      <div className="transaction-wrapper">
        <div className="container">
          <h2 className="transaction-header">Transactions</h2>

          <table {...getTableProps()} className="transactions-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination-controls">
            <div>
              <button className="form-button" onClick={previousPage} disabled={!canPreviousPage}>Previous</button>
              <button className="form-button" onClick={nextPage} disabled={!canNextPage}>Next</button>
              <span>Page {pageIndex + 1} of {pageOptions.length}</span>
            </div>
            <button className="export-button" onClick={exportToCSV}>Export CSV</button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <TransactionForm
              wallets={transactions.map(t => t.wallet).filter((w, i, self) =>
                w && self.findIndex(t => t.id === w.id) === i
              )}
              categories={transactions.map(t => t.category).filter((c, i, self) =>
                c && self.findIndex(t => t.id === c.id) === i
              )}
              onTransactionAdded={handleTransactionAdded}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Transaction;
