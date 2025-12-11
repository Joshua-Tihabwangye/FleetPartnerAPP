# PowerShell script to update pages to full-width layout
$files = @(
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\FleetPartnerShuttleBulkRemindersPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\tours\TourBookingCreatePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\onboarding\SetupRolesAndPeoplePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleRouteEditPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\rentals\RentalPricingSettingsPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\tours\TourDetailPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\onboarding\SetupFleetPartnerProfilePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\rentals\RentalBookingDetailPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleRouteDetailPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\onboarding\SetupEVsQuickAddPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\tours\TourCreatePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\onboarding\SetupDriversQuickAddPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleRouteCreatePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\rentals\FleetPartnerRentalCatalogPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\onboarding\SetupBranchesPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\tours\TourBookingsPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleRunsBoardPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleStudentAttendancePage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleStudentDetailPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\dashboard\FleetMapPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleStudentsListPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\compliance\AmbulanceCaseDetailPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\compliance\AmbulanceCasesListPage.tsx",
    "e:\Projects\FleetPartnerApp\src\pages\services\schoolShuttles\ShuttleTrackLivePage.tsx"
)

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw
    $content = $content -replace 'min-h-\[calc\(100vh-56px\)\] px-4 sm:px-6 lg:px-10', 'min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12'
    $content = $content -replace 'max-w-\d+xl mx-auto', 'w-full'
    $content = $content -replace 'max-w-4xl mx-auto', 'w-full'
    $content = $content -replace 'max-w-3xl mx-auto', 'w-full'
    $content = $content -replace 'max-w-5xl mx-auto', 'w-full'
    $content = $content -replace 'max-w-6xl mx-auto', 'w-full'
    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "Updated: $file"
}
Write-Host "Done! Updated $($files.Count) files."
