import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterStep1Page from '../pages/auth/RegisterStep1Page';
import RegisterStep2Page from '../pages/auth/RegisterStep2Page';
import RegisterStep3Page from '../pages/auth/RegisterStep3Page';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { RegisterProvider } from '../context/RegisterContext';

import HomePage from '../pages/public/HomePage';
import { NotFoundPage, AccessDeniedPage } from '../pages/common/StatusPages';
import ChangePasswordRequiredPage from '../pages/auth/ChangePasswordRequiredPage';

import AdminLayout from '../layouts/AdminLayout';
import EnseignantLayout from '../layouts/EnseignantLayout';
import EleveLayout from '../layouts/EleveLayout';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminInscriptionsListPage from '../pages/admin/AdminInscriptionsListPage';
import AdminInscriptionDetailPage from '../pages/admin/AdminInscriptionDetailPage';
import AdminEnseignantsListPage from '../pages/admin/AdminEnseignantsListPage';
import AdminEnseignantNewPage from '../pages/admin/AdminEnseignantNewPage';
import AdminEnseignantDetailPage from '../pages/admin/AdminEnseignantDetailPage';
import AdminEnseignantEditPage from '../pages/admin/AdminEnseignantEditPage';
import AdminElevesListPage from '../pages/admin/AdminElevesListPage';
import AdminEleveDetailPage from '../pages/admin/AdminEleveDetailPage';
import AdminCoursListPage from '../pages/admin/AdminCoursListPage';
import AdminLivesListPage from '../pages/admin/AdminLivesListPage';
import AdminMatieresPage from '../pages/admin/AdminMatieresPage';
import AdminStatistiquesPage from '../pages/admin/AdminStatistiquesPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

import EnseignantDashboardPage from '../pages/enseignant/EnseignantDashboardPage';
import EnseignantElevesListPage from '../pages/enseignant/EnseignantElevesListPage';
import EnseignantEleveDetailPage from '../pages/enseignant/EnseignantEleveDetailPage';
import EnseignantCoursListPage from '../pages/enseignant/EnseignantCoursListPage';
import EnseignantCoursNewPage from '../pages/enseignant/EnseignantCoursNewPage';
import EnseignantCoursDetailPage from '../pages/enseignant/EnseignantCoursDetailPage';
import EnseignantCoursEditPage from '../pages/enseignant/EnseignantCoursEditPage';
import EnseignantLivesListPage from '../pages/enseignant/EnseignantLivesListPage';
import EnseignantLiveNewPage from '../pages/enseignant/EnseignantLiveNewPage';
import EnseignantProfilePage from '../pages/enseignant/EnseignantProfilePage';

import EleveDashboardPage from '../pages/eleve/EleveDashboardPage';
import EleveCoursListPage from '../pages/eleve/EleveCoursListPage';
import EleveCoursDetailPage from '../pages/eleve/EleveCoursDetailPage';
import EleveMatieresPage from '../pages/eleve/EleveMatieresPage';
import EleveProfilePage from '../pages/eleve/EleveProfilePage';


function RegisterLayout() {
  return (
    <RegisterProvider>
      <Outlet />
    </RegisterProvider>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/acces-refuse" element={<AccessDeniedPage />} />

      <Route element={<ProtectedRoute allowedRoles={['ENSEIGNANT']} />}>
        <Route path="/changer-mot-de-passe" element={<ChangePasswordRequiredPage />} />
      </Route>

      <Route element={<RegisterLayout />}>
        <Route path="/register" element={<RegisterStep1Page />} />
        <Route path="/register/parcours" element={<RegisterStep2Page />} />
        <Route path="/register/recapitulatif" element={<RegisterStep3Page />} />
      </Route>

      {}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/inscriptions" element={<AdminInscriptionsListPage />} />
          <Route path="/admin/inscriptions/:id" element={<AdminInscriptionDetailPage />} />
          <Route path="/admin/enseignants" element={<AdminEnseignantsListPage />} />
          <Route path="/admin/enseignants/nouveau" element={<AdminEnseignantNewPage />} />
          <Route path="/admin/enseignants/:id" element={<AdminEnseignantDetailPage />} />
          <Route path="/admin/enseignants/:id/modifier" element={<AdminEnseignantEditPage />} />
          <Route path="/admin/eleves" element={<AdminElevesListPage />} />
          <Route path="/admin/eleves/:id" element={<AdminEleveDetailPage />} />
          <Route path="/admin/cours" element={<AdminCoursListPage />} />
          <Route path="/admin/lives" element={<AdminLivesListPage />} />
          <Route path="/admin/matieres" element={<AdminMatieresPage />} />
          <Route path="/admin/statistiques" element={<AdminStatistiquesPage />} />
          <Route path="/admin/profil" element={<AdminProfilePage />} />
        </Route>
      </Route>

      {}
      <Route element={<ProtectedRoute allowedRoles={['ENSEIGNANT']} />}>
        <Route element={<EnseignantLayout />}>
          <Route path="/enseignant/dashboard" element={<EnseignantDashboardPage />} />
          <Route path="/enseignant/eleves" element={<EnseignantElevesListPage />} />
          <Route path="/enseignant/eleves/:id" element={<EnseignantEleveDetailPage />} />
          <Route path="/enseignant/cours" element={<EnseignantCoursListPage />} />
          <Route path="/enseignant/cours/nouveau" element={<EnseignantCoursNewPage />} />
          <Route path="/enseignant/cours/:id" element={<EnseignantCoursDetailPage />} />
          <Route path="/enseignant/cours/:id/modifier" element={<EnseignantCoursEditPage />} />
          <Route path="/enseignant/lives" element={<EnseignantLivesListPage />} />
          <Route path="/enseignant/lives/nouveau" element={<EnseignantLiveNewPage />} />
          <Route path="/enseignant/profil" element={<EnseignantProfilePage />} />
        </Route>
      </Route>

      {}
      <Route element={<ProtectedRoute allowedRoles={['ELEVE']} />}>
        <Route element={<EleveLayout />}>
          <Route path="/eleve/dashboard" element={<EleveDashboardPage />} />
          <Route path="/eleve/cours" element={<EleveCoursListPage />} />
          <Route path="/eleve/cours/:id" element={<EleveCoursDetailPage />} />
          <Route path="/eleve/matieres" element={<EleveMatieresPage />} />
          <Route path="/eleve/profil" element={<EleveProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
