import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layout/PublicLayout";
import FleetPartnerAppShell from "../layout/FleetPartnerAppShell";
import ProtectedRoute from "./ProtectedRoute";
import OnboardingGuard from "./OnboardingGuard";
import RoleGuard from "./RoleGuard";

// Marketing
import FleetPartnerWebsiteHomePage from "../pages/marketing/FleetPartnerWebsiteHomePage";
import FleetPartnerRegistrationPage from "../pages/marketing/FleetPartnerRegistrationPage";

// Auth
import FleetPartnerLoginPage from "../pages/auth/FleetPartnerLoginPage";
import FleetPartnerForgotPasswordPage from "../pages/auth/FleetPartnerForgotPasswordPage";
import FleetPartnerResetPasswordPage from "../pages/auth/FleetPartnerResetPasswordPage";
import FleetPartnerEmailVerificationPage from "../pages/auth/FleetPartnerEmailVerificationPage";
import FleetPartnerTwoFactorVerifyPage from "../pages/auth/FleetPartnerTwoFactorVerifyPage";
import FleetPartnerInviteAcceptPage from "../pages/auth/FleetPartnerInviteAcceptPage";
import FleetPartnerChooseOrganisationPage from "../pages/auth/FleetPartnerChooseOrganisationPage";

// Onboarding
import SetupFleetPartnerProfilePage from "../pages/onboarding/SetupFleetPartnerProfilePage";
import SetupBranchesPage from "../pages/onboarding/SetupBranchesPage";
import SetupRolesAndPeoplePage from "../pages/onboarding/SetupRolesAndPeoplePage";
import SetupDriversQuickAddPage from "../pages/onboarding/SetupDriversQuickAddPage";
import SetupEVsQuickAddPage from "../pages/onboarding/SetupEVsQuickAddPage";

// Dashboard & live map
import DashboardOverviewPage from "../pages/dashboard/DashboardOverviewPage";
import FleetMapPage from "../pages/dashboard/FleetMapPage";

// Drivers
import DriversListPage from "../pages/drivers/DriversListPage";
import DriverCreatePage from "../pages/drivers/DriverCreatePage";
import DriverProfilePage from "../pages/drivers/DriverProfilePage";
import DriverRatingsPage from "../pages/drivers/DriverRatingsPage";

// Vehicles
import VehiclesListPage from "../pages/vehicles/VehiclesListPage";
import VehicleCreatePage from "../pages/vehicles/VehicleCreatePage";
import VehicleDetailPage from "../pages/vehicles/VehicleDetailPage";
import VehicleEditPage from "../pages/vehicles/VehicleEditPage";
import VehicleMaintenanceHistoryPage from "../pages/vehicles/VehicleMaintenanceHistoryPage";
import VehicleDocumentsPage from "../pages/vehicles/VehicleDocumentsPage";

// Trips
import TripsListPage from "../pages/trips/TripsListPage";
import TripDetailPage from "../pages/trips/TripDetailPage";

// Dispatch & EMS
import ManualDispatchNewBookingPage from "../pages/dispatch/ManualDispatchNewBookingPage";
import DispatchListPage from "../pages/dispatch/DispatchListPage";
import AmbulanceDashboardPage from "../pages/dispatch/AmbulanceDashboardPage";
import AmbulanceDispatchBoardPage from "../pages/dispatch/AmbulanceDispatchBoardPage";
import AmbulanceCasesListPage from "../pages/compliance/AmbulanceCasesListPage";
import AmbulanceCaseDetailPage from "../pages/compliance/AmbulanceCaseDetailPage";

// Earnings
import EarningsOverviewPage from "../pages/earnings/EarningsOverviewPage";
import EarningsStatementsPage from "../pages/earnings/EarningsStatementsPage";
import DriverPayoutsPage from "../pages/earnings/DriverPayoutsPage";

// Compliance
import ComplianceDashboardPage from "../pages/compliance/ComplianceDashboardPage";
import IncidentsListPage from "../pages/compliance/IncidentsListPage";

// Rentals
import RentalsDashboardPage from "../pages/services/rentals/RentalsDashboardPage";
import RentalsListPage from "../pages/services/rentals/RentalsListPage";
import RentalBookingDetailPage from "../pages/services/rentals/RentalBookingDetailPage";
import RentalBookingCreatePage from "../pages/services/rentals/RentalBookingCreatePage";
import RentalPricingSettingsPage from "../pages/services/rentals/RentalPricingSettingsPage";
import FleetPartnerRentalCatalogPage from "../pages/services/rentals/FleetPartnerRentalCatalogPage";

// Tours
import ToursDashboardPage from "../pages/services/tours/ToursDashboardPage";
import ToursListPage from "../pages/services/tours/ToursListPage";
import TourDetailPage from "../pages/services/tours/TourDetailPage";
import TourEditPage from "../pages/services/tours/TourEditPage";
import TourBookingsPage from "../pages/services/tours/TourBookingsPage";
import TourBookingDetailPage from "../pages/services/tours/TourBookingDetailPage";
import TourBookingCreatePage from "../pages/services/tours/TourBookingCreatePage";
import TourCreatePage from "../pages/services/tours/TourCreatePage";

// School shuttles
import ShuttleDashboardPage from "../pages/services/schoolShuttles/ShuttleDashboardPage";
import ShuttleRoutesListPage from "../pages/services/schoolShuttles/ShuttleRoutesListPage";
import ShuttleRouteDetailPage from "../pages/services/schoolShuttles/ShuttleRouteDetailPage";
import ShuttleRouteEditPage from "../pages/services/schoolShuttles/ShuttleRouteEditPage";
import ShuttleRouteCreatePage from "../pages/services/schoolShuttles/ShuttleRouteCreatePage";
import ShuttleTrackLivePage from "../pages/services/schoolShuttles/ShuttleTrackLivePage";
import ShuttleRunsBoardPage from "../pages/services/schoolShuttles/ShuttleRunsBoardPage";
import ShuttleStudentsListPage from "../pages/services/schoolShuttles/ShuttleStudentsListPage";
import ShuttleStudentDetailPage from "../pages/services/schoolShuttles/ShuttleStudentDetailPage";
import ShuttleStudentEditPage from "../pages/services/schoolShuttles/ShuttleStudentEditPage";
import ShuttleStudentAttendancePage from "../pages/services/schoolShuttles/ShuttleStudentAttendancePage";
import FleetPartnerShuttleBulkRemindersPage from "../pages/services/schoolShuttles/FleetPartnerShuttleBulkRemindersPage";
import ShuttleParentFeedbackPage from "../pages/services/schoolShuttles/ShuttleParentFeedbackPage";
import ShuttleAttendantsPage from "../pages/services/schoolShuttles/ShuttleAttendantsPage";
import ShuttleStudentRostersPage from "../pages/services/schoolShuttles/ShuttleStudentRostersPage";
import ShuttleSafetyCompliancePage from "../pages/services/schoolShuttles/ShuttleSafetyCompliancePage";
import ShuttlePerformanceReportPage from "../pages/services/schoolShuttles/ShuttlePerformanceReportPage";
import ShuttleTripCalendarPage from "../pages/services/schoolShuttles/ShuttleTripCalendarPage";
import ShuttleTripCreatePage from "../pages/services/schoolShuttles/ShuttleTripCreatePage";
import ShuttleTripDetailPage from "../pages/services/schoolShuttles/ShuttleTripDetailPage";
import ShuttleAttendantCreatePage from "../pages/services/schoolShuttles/ShuttleAttendantCreatePage";

// Settings
import FleetPartnerSettingsPage from "../pages/settings/FleetPartnerSettingsPage";
import BranchesSettingsPage from "../pages/settings/BranchesSettingsPage";
import AccountSecurityPage from "../pages/settings/AccountSecurityPage";
import RolesAndPermissionsPage from "../pages/settings/RolesAndPermissionsPage";
import IntegrationsSettingsPage from "../pages/settings/IntegrationsSettingsPage";
import FleetPartnerAccountSecurityPage from "../pages/settings/accountSecurity/FleetPartnerAccountSecurityPage";
import FleetPartnerTwoFactorSetupPage from "../pages/settings/accountSecurity/FleetPartnerTwoFactorSetupPage";
import FleetPartnerSessionsPage from "../pages/settings/accountSecurity/FleetPartnerSessionsPage";
import FleetPartnerProfilePage from "../pages/settings/FleetPartnerProfilePage";
import ActivityLogPage from "../pages/settings/ActivityLogPage";

// Training & Support
import TrainingCentrePage from "../pages/training/TrainingCentrePage";
import TrainingCourseViewerPage from "../pages/training/TrainingCourseViewerPage";
import HelpAndSupportPage from "../pages/support/HelpAndSupportPage";
import SupportMessagesPage from "../pages/support/SupportMessagesPage";

// System pages
import FleetPartnerNotFoundPage from "../pages/system/FleetPartnerNotFoundPage";
import FleetPartnerAccessDeniedPage from "../pages/system/FleetPartnerAccessDeniedPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<FleetPartnerWebsiteHomePage />} />
        <Route path="/fleet-partner" element={<FleetPartnerWebsiteHomePage />} />
        <Route path="/fleet-partner/register" element={<FleetPartnerRegistrationPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<FleetPartnerLoginPage />} />
      <Route path="/forgot-password" element={<FleetPartnerForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<FleetPartnerResetPasswordPage />} />
      <Route path="/login/2fa" element={<FleetPartnerTwoFactorVerifyPage />} />
      <Route path="/verify-email" element={<FleetPartnerEmailVerificationPage />} />
      <Route path="/verify-email/:token" element={<FleetPartnerEmailVerificationPage />} />
      <Route path="/invite/:inviteId" element={<FleetPartnerInviteAcceptPage />} />
      <Route path="/switch-organisation" element={<FleetPartnerChooseOrganisationPage />} />

      {/* Access denied */}
      <Route path="/access-denied" element={<FleetPartnerAccessDeniedPage />} />

      {/* Onboarding */}
      <Route
        element={
          <OnboardingGuard>
            <FleetPartnerAppShell />
          </OnboardingGuard>
        }
      >
        <Route path="/setup/fleet-partner-profile" element={<SetupFleetPartnerProfilePage />} />
        <Route path="/setup/branches" element={<SetupBranchesPage />} />
        <Route path="/setup/roles" element={<SetupRolesAndPeoplePage />} />
        <Route path="/setup/drivers" element={<SetupDriversQuickAddPage />} />
        <Route path="/setup/vehicles" element={<SetupEVsQuickAddPage />} />
      </Route>

      {/* Main app */}
      <Route
        element={
          <ProtectedRoute>
            <FleetPartnerAppShell />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/live-map" element={<FleetMapPage />} />

        {/* Drivers */}
        <Route path="/drivers" element={<DriversListPage />} />
        <Route path="/drivers/new" element={<DriverCreatePage />} />
        <Route path="/drivers/:driverId" element={<DriverProfilePage />} />
        <Route path="/drivers/:driverId/ratings" element={<DriverRatingsPage />} />

        {/* Vehicles */}
        <Route path="/vehicles" element={<VehiclesListPage />} />
        <Route path="/vehicles/create" element={<VehicleCreatePage />} />
        <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
        <Route path="/vehicles/:vehicleId/edit" element={<VehicleEditPage />} />
        <Route path="/vehicles/:vehicleId/maintenance" element={<VehicleMaintenanceHistoryPage />} />
        <Route path="/vehicles/:vehicleId/documents" element={<VehicleDocumentsPage />} />

        {/* Trips */}
        <Route path="/trips" element={<TripsListPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />

        {/* Dispatch & EMS */}
        <Route path="/dispatch" element={<DispatchListPage />} />
        <Route path="/dispatch/new" element={<ManualDispatchNewBookingPage />} />
        <Route
          path="/ambulance/dispatch"
          element={
            <RoleGuard allowedRoles={["FleetOwner", "EMSDispatcher"]}>
              <AmbulanceDispatchBoardPage />
            </RoleGuard>
          }
        />
        <Route path="/ambulance" element={<AmbulanceDashboardPage />} />
        <Route path="/ambulance/dispatch" element={<AmbulanceDispatchBoardPage />} />
        <Route path="/ambulance/cases" element={<AmbulanceCasesListPage />} />
        <Route path="/ambulance/cases/:caseId" element={<AmbulanceCaseDetailPage />} />

        {/* Earnings */}
        <Route path="/earnings" element={<EarningsOverviewPage />} />
        <Route path="/earnings/statements" element={<EarningsStatementsPage />} />
        <Route path="/earnings/payouts" element={<DriverPayoutsPage />} />

        {/* Compliance */}
        <Route path="/compliance" element={<ComplianceDashboardPage />} />
        <Route path="/compliance/incidents" element={<IncidentsListPage />} />

        {/* Rentals */}
        <Route path="/rentals" element={<RentalsDashboardPage />} />
        <Route path="/rentals/bookings" element={<RentalsListPage />} />
        <Route path="/rentals/bookings/create" element={<RentalBookingCreatePage />} />
        <Route path="/rentals/:rentalId" element={<RentalBookingDetailPage />} />
        <Route path="/settings/rentals" element={<RentalPricingSettingsPage />} />
        <Route path="/rentals/catalog" element={<FleetPartnerRentalCatalogPage />} />

        {/* Tours */}
        <Route path="/tours" element={<ToursDashboardPage />} />
        <Route path="/tours/list" element={<ToursListPage />} />
        <Route path="/tours/all" element={<ToursListPage />} />
        <Route path="/tours/create" element={<TourCreatePage />} />
        <Route path="/tours/:tourId" element={<TourDetailPage />} />
        <Route path="/tours/:tourId/edit" element={<TourEditPage />} />
        <Route path="/tours/bookings" element={<TourBookingsPage />} />
        <Route path="/tours/bookings/:bookingId" element={<TourBookingDetailPage />} />
        <Route path="/tours/bookings/create" element={<TourBookingCreatePage />} />

        {/* School shuttles */}
        <Route path="/school-shuttles" element={<ShuttleDashboardPage />} />
        <Route path="/school-shuttles/routes" element={<ShuttleRoutesListPage />} />
        <Route path="/school-shuttles/routes/create" element={<ShuttleRouteCreatePage />} />
        <Route path="/school-shuttles/routes/:routeId" element={<ShuttleRouteDetailPage />} />
        <Route path="/school-shuttles/routes/:routeId/edit" element={<ShuttleRouteEditPage />} />
        <Route path="/school-shuttles/routes/:routeId/track" element={<ShuttleTrackLivePage />} />
        <Route path="/school-shuttles/operations" element={<ShuttleRunsBoardPage />} />
        <Route path="/school-shuttles/students" element={<ShuttleStudentsListPage />} />
        <Route path="/school-shuttles/students/:studentId" element={<ShuttleStudentDetailPage />} />
        <Route path="/school-shuttles/students/:studentId/edit" element={<ShuttleStudentEditPage />} />
        <Route
          path="/school-shuttles/students/:studentId/attendance"
          element={<ShuttleStudentAttendancePage />}
        />
        <Route path="/school-shuttles/attendants" element={<ShuttleAttendantsPage />} />
        <Route path="/school-shuttles/attendants/new" element={<ShuttleAttendantCreatePage />} />
        <Route path="/school-shuttles/rosters" element={<ShuttleStudentRostersPage />} />
        <Route path="/school-shuttles/safety" element={<ShuttleSafetyCompliancePage />} />
        <Route path="/school-shuttles/performance" element={<ShuttlePerformanceReportPage />} />
        <Route path="/school-shuttles/calendar" element={<ShuttleTripCalendarPage />} />
        <Route path="/school-shuttles/trips/new" element={<ShuttleTripCreatePage />} />
        <Route path="/school-shuttles/trips/:tripId" element={<ShuttleTripDetailPage />} />
        <Route
          path="/school-shuttles/bulk-reminders"
          element={<FleetPartnerShuttleBulkRemindersPage />}
        />
        <Route
          path="/school-shuttles/parent-feedback"
          element={<ShuttleParentFeedbackPage />}
        />

        {/* Settings */}
        <Route path="/settings/fleet-partner" element={<FleetPartnerSettingsPage />} />
        <Route path="/settings/branches" element={<BranchesSettingsPage />} />
        <Route path="/settings/account-security" element={<AccountSecurityPage />} />
        <Route
          path="/settings/roles"
          element={
            <RoleGuard allowedRoles={["FleetOwner", "Manager"]}>
              <RolesAndPermissionsPage />
            </RoleGuard>
          }
        />
        <Route path="/settings/integrations" element={<IntegrationsSettingsPage />} />
        <Route
          path="/settings/account-security/2fa-setup"
          element={<FleetPartnerTwoFactorSetupPage />}
        />
        <Route
          path="/settings/account-security/sessions"
          element={<FleetPartnerSessionsPage />}
        />
        <Route path="/settings/profile" element={<FleetPartnerProfilePage />} />
        <Route path="/settings/activity-log" element={<ActivityLogPage />} />

        {/* Training & support */}
        <Route path="/training" element={<TrainingCentrePage />} />
        <Route path="/training/course/:courseId" element={<TrainingCourseViewerPage />} />
        <Route path="/support/messages" element={<SupportMessagesPage />} />
        <Route path="/help" element={<HelpAndSupportPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<FleetPartnerNotFoundPage />} />
    </Routes>
  );
}
