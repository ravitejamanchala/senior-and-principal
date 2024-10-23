import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AbsenceList from './AbsenceList';
import useFetch from '../customHooks/useFetch'; 

jest.mock('../customHooks/useFetch', () => ({
  __esModule: true,
  default: jest.fn(), // Mock default export
}));

describe('AbsenceList', () => {
  const mockData = [
    {
      id: 1,
      employee: { firstName: 'John', lastName: 'Doe' },
      absenceType: 'Sick Leave',
      startDate: '2023-10-01',
      days:3,
      approved: true,

    },
    {
      id: 2,
      employee: { firstName: 'Jane', lastName: 'Smith' },
      absenceType: 'Vacation',
      startDate: '2023-10-10',
      days:3,
      approved: false,

    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<AbsenceList />);
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: { message: 'Error fetching data' },
    });

    render(<AbsenceList />);
    expect(screen.getByText(/Error: Error fetching data/)).toBeInTheDocument();
  });

  test('renders absence data', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<AbsenceList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Sick Leave')).toBeInTheDocument();
      expect(screen.getByText('Vacation')).toBeInTheDocument();
    });
  });
  test('renders NO data', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    render(<AbsenceList />);
    
    await waitFor(() => {
      expect(screen.getByText('No Records')).toBeInTheDocument();
    });
  });

});