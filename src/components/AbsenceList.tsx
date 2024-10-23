import React, { useState, useEffect } from 'react';
import useFetch from '../customHooks/useFetch';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination } from '@mui/material';
import ConflictStatus from './ConflictStatus';
import axios from 'axios';


// Define types for absence data
interface Employee {
  firstName: string;
  lastName: string;
}

interface Absence {
  id: number;
  employee: Employee;
  absenceType: string;
  days: number;
  startDate: string;
  endDate: string;
  approved: boolean;
  hasConflict: boolean;
}

const AbsenceList: React.FC = () => {
  const { data, loading, error } = useFetch<Absence[]>('https://front-end-kata.brighthr.workers.dev/api/absences');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedData, setSortedData] = useState<Absence[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Absence>('startDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [conflictsData, setConflictsData] = useState<{ id: number; hasConflict: boolean }[]>([]);

  useEffect(() => {
    if (data) {
      // Fetch conflict data for each absence 

      const fetchConflicts = async () => {
        const conflictsResponses = await Promise.all(
          data.map(async (absence: Absence) => {
            const response = await axios.get(`https://front-end-kata.brighthr.workers.dev/api/conflict/${absence.id}`);
            return { id: absence.id, hasConflict: response.data.conflicts };
          })
        );
        setConflictsData(conflictsResponses);
      };

      fetchConflicts();
    }
  }, [data]);
  useEffect(() => {
    setSearchTerm(selectedEmployee || "")
  }, [selectedEmployee])

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (value: string) => {
    setSelectedEmployee(null);
    setSearchTerm(value);
  };

  const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), []);

  // Effect for sorting data
  useEffect(() => {
    if (data) {
      const filteredData = data.filter((absence: { employee: Employee }) =>
        `${absence.employee.firstName} ${absence.employee.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      const sorted = filteredData.sort((a: Absence, b: Absence) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
      });

      setSortedData(sorted);
    }
  }, [data, searchTerm, order, orderBy]);

  // Helper function to add days to a date
  const addDays = (date: string, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Effect for sorting data
  useEffect(() => {
    if (data) {
      const filteredData = data.filter((absence: { employee: { firstName: string; lastName: string; }; }) =>
        `${absence.employee.firstName} ${absence.employee.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      const sorted = filteredData.sort((a: Absence, b: Absence) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
      });

      setSortedData(sorted);
    }
  }, [data, searchTerm, order, orderBy]);

  // Handle sorting
  const handleRequestSort = (property: keyof Absence) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message || 'Something went wrong'}</div>;
  }

  return (
    <Box sx={{ width: '100%' }} className="p-4">
      <h1 className="text-2xl font-bold mb-4">Absence List</h1>
      <TextField
        label="Search by Employee Name"
        variant="outlined"
        className='w-[300px]'
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <TableContainer>
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'employee'}
                  direction={orderBy === 'employee' ? order : 'asc'}
                  onClick={() => handleRequestSort('employee')}
                >
                  Employee Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startDate'}
                  direction={orderBy === 'startDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('startDate')}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endDate'}
                  direction={orderBy === 'endDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('endDate')}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'absenceType'}
                  direction={orderBy === 'absenceType' ? order : 'asc'}
                  onClick={() => handleRequestSort('absenceType')}
                >
                  Absence Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'approved'}
                  direction={orderBy === 'approved' ? order : 'asc'}
                  onClick={() => handleRequestSort('approved')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell
              >
                Conflict
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(absence => {
              const conflict = conflictsData.find(conf => conf.id === absence.id);
              return (
                <TableRow key={absence.id} className={`border-b ${!absence.approved ? 'bg-red-100' : ''}`}>
                  <TableCell>
                    <span
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => setSelectedEmployee(absence.employee.firstName)}
                    >
                      {`${absence.employee.firstName} ${absence.employee.lastName}`}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(absence.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{addDays(absence.startDate, absence.days).toLocaleDateString()}</TableCell>
                  <TableCell>{absence.absenceType}</TableCell>
                  <TableCell>{absence.approved ? 'Approved' : 'Pending'}</TableCell>
                  <TableCell>
                    <span style={{ color: conflict?.hasConflict ? 'red' : 'green' }}>
                      {conflict?.hasConflict ? '⚠️ Conflict' : 'No Conflict'}
                    </span>
                    {/* <ConflictStatus absenceId={absence.id} /> Used the ConflictStatus component but causing refetching conflict api */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
};

export default AbsenceList;