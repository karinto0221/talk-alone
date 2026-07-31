import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { PracticePage } from '../pages/PracticePage';
import { ResultPage } from '../pages/ResultPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<PracticePage />} />
        <Route path="result/:speechId" element={<ResultPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
