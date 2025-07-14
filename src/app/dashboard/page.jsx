'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination";

export default function DashboardPage() {
  const [summary, setSummary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/summary');
        setSummary(res.data.summary);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      }
    };
    fetchSummary();
  }, []);

  const paginated = summary.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(summary.length / itemsPerPage);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resume Analysis Summary by Job Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Resumes Scanned</TableHead>
                  <TableHead>Shortlisted</TableHead>
                  <TableHead>Avg Match %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length > 0 ? (
                  paginated.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.jobRoleResumeValue}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>{item.shortlisted}</TableCell>
                      <TableCell>{item.averageScore}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">
                      No summary data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {summary.length > itemsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </main>
  );
}