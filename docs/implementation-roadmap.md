# OpsFlow implementation and learning roadmap

Reference: OpsFlow Technical Product Specification, version 1.0, September 2026.

## Working agreement

Implement in small, explained steps. Before each edit batch, explain the behavior,
files, and reason for the change. Afterward, explain the data flow and report checks.
Keep TypeScript strict. Preserve existing learning examples until their replacement
has been discussed. Additional earlier user principles have been requested.

## Initial findings

- The router imports Users from a nonexistent directory. Corrected in step 1.
- The API client imports an unused Axios type. Removed in step 1.
- Initial build: 10 TypeScript errors, including the two above and unused code.
- Employee reads use sample records, while writes target localhost endpoints.
- Employee deletion calls the user service and does not settle loading or catch errors.
- The employee form in pages/employees fetches a list instead of creating a record.
- The other employee form mixes employee fields with login/password behavior.
- Users has its initial fetch commented out and incomplete create/update operations.
- API helpers repeat parsing, discard useful server errors, and cannot handle 204.
- Authentication context is commented out; protected routing is empty.
- ProjectCard is a learning example; project management is not implemented.
- Dashboard, assignments, permission rules, required routes, filtering, validation,
  feedback patterns, and application styling remain to be implemented.

## Target responsibility boundaries

```text
src/
  components/
    common/                  reusable buttons, fields, badges, request states
    layout/                  application shell and navigation
  features/
    employees/
      components/            presentational TSX and colocated CSS modules
      hooks/                 loading, form, filter, and mutation logic
      pages/                 route-level composition
      employeeService.ts     employee endpoints
      employee.types.ts      employee and write-payload types
      employee.validation.ts pure validation rules
    projects/                same feature boundaries as employees
    dashboard/               metrics derived from successful data requests
  services/
    apiClient.ts             transport, response parsing, common request errors
  types/
    api.ts                   shared response and error contracts
  routes/                    route definitions and access boundaries
  styles/                    global reset and design tokens
  utils/                     genuinely shared pure helpers
  App.tsx
  main.tsx
```

Data flow: page composes a view and hook; hook calls a feature service; service
calls the API client. Views receive typed values and callbacks. CSS modules own
appearance. Avoid extracting hooks for components that have no meaningful logic.
Migrate existing imports incrementally rather than keeping duplicate implementations.

## Delivery slices

1. Foundation: recover build/lint, establish types and configurable API transport,
   then introduce the responsive application shell and route map, including 404.
   Helpers use requestGet/requestPost/requestPut/requestPatch/requestDelete.
   Preserve HTTP status, actionable conflict messages, and validation field errors;
   handle no-content responses and unsuccessful response envelopes explicitly.
2. Employees: directory loading/retry/empty/no-results states; combined search and
   filters; deterministic sorting; detail, create and edit; ID-specific deletion
   with confirmation and immutable updates only after server success.
   Validate trimmed name length/characters, email, configured department, and active
   state. Exclude server-owned IDs from editable payloads; map duplicate email errors.
3. Projects: directories and detail/create/edit/delete routes; status, priority,
   owner filters and sorting. Validate name, normalized unique code, description,
   dates, active owner, and completed-project end date. Cancellation retains history.
4. Assignments: unique existing employee IDs; owner shown separately and excluded
   from members by default. Removing membership never deletes employees. Show
   assigned projects on employee details and surface backend deletion constraints.
5. Dashboard: current employee/project counts, status distributions and project
   links. Failed metric requests must not display fabricated zero values.
6. Hardening: role-ready administrator/manager/viewer actions, focus-managed
   dialogs, associated field errors, keyboard navigation, responsive verification,
   and meaningful validation/asynchronous-state tests.

Every slice includes loading, success, error, disabled and empty states as applicable.
Failed saves preserve values. Backend validation and authorization remain authoritative.

## Visual direction

Use a restrained navy navigation area, pale neutral workspace, white content panels,
and a teal action accent. Prioritize readable tables, clear heading hierarchy,
consistent spacing, visible focus, and status text alongside color. Keep styles
separate from request and state logic. Verify contrast and desktop/tablet/mobile
layouts when the shell and feature screens are implemented.

## Integration decisions to resolve before API wiring

- Backend availability and base URL; the specification expects /api/employees and
  /api/projects, while existing code uses localhost:3000 endpoints without /api.
- Actual JSON envelope, 204 deletion behavior, and field-error response shape.
- Confirm department options (existing form contains IT, HR, Finance).
- Confirm initial role source; any mocked role must be explicit.

If development requires a mock data source, label it explicitly and keep it behind
the service boundary. Do not present mock operations as confirmed backend writes.

## Scope

Version 1 covers employees, projects, assignments, dashboard, and role-ready UI.
Payroll, attendance, leave, timesheets, chat, billing, document management, and
enterprise identity are outside the supplied specification's initial scope.

## Checkpoint 2 — mock directory and application shell

The user confirmed that no backend exists and requested a premium, interactive
product experience. Use mock data now; future API integration stays behind services.

Implemented:
- Ink sidebar, neutral workspace, violet accent, layered illustration, responsive
  layout, focus styles, and motion with reduced-motion support.
- Feature-owned employee types, localStorage seed service with shape checks,
  a state/filter hook, and a page with a separate CSS module.
- Combined search/status/department filters, deterministic sort, record-derived
  summary counts, and an inline employee profile panel.
- Loading, retry, invalid-storage, empty, and no-results handling.
- Existing duplicate directory pages now re-export the feature page.
- Root temporarily redirects to /employees until the dashboard is implemented.
- Overview and Projects are explicitly marked upcoming.

Validation: npm run build and npm run lint both passed. Browser verification was
blocked by the browser tool error: Tab 1 is not part of the browser session.
Responsive styling exists but has not yet been visually verified.

Next learning slice: employee validation and a create form, followed by edit and
confirmed delete, with persistent mock mutations. This checkpoint persists seed
records only; create/edit/delete and project assignments are not implemented.
The initial design direction above is superseded by the user's premium workspace
brief and the implemented ink/neutral/violet palette.

## Checkpoint 3 — employee creation

Added /employees/new and a directory entry point. EmployeeInput excludes the ID;
normalization and validation are pure functions shared by the form hook and mock
service. Names are trimmed and checked for length/characters; emails are normalized
and checked for format/uniqueness; departments use a configured list. The service
assigns IDs and confirms localStorage writes before navigation. Failed saves retain
values. The form separates logic, presentation, and CSS, includes field labels/error
associations, and disables submission during a save. Success appears on the directory.

Validation: production build and lint passed; scripts/check-employee-create.mjs
passed validation, normalization, persistence, duplicate email, storage failure,
same-tab concurrent creation, and corrupt-data preservation checks. Browser visual
and interaction verification remains pending. Local storage is a single-browser demo
store, not a multi-user database; cross-tab writes are not transactional.

Learning focus: editable payload vs stored entity; pure validation vs stateful hook;
service validation vs immediate UI feedback; navigating only after a confirmed save.
Next slice: employee editing, followed by confirmed deletion and project dependencies.

## Checkpoint 4 — shell interactions and notifications

Added a separate useSidebar hook, desktop icon-rail collapse, mobile navigation
collapse, and an always-available labeled toggle with aria-expanded/aria-controls.
Added reusable Notification presentation/CSS and a separate route-notification hook.
Creation feedback is now a floating, closeable message outside page content;
dismissal clears its history state. Form-level save errors reuse the closeable
notification component; field validation remains attached to each field.
Refreshed header/footer gradients and the workspace background. Motion respects
reduced-motion preferences. Build and lint passed. Browser visual/interaction QA
remains pending. Employee editing/deletion remain the next feature slice.

## Checkpoint 5 — employee editing

Added /employees/:id/edit and directory Edit links. A keyed record loader resolves
an existing employee before mounting the shared create/edit form. Invalid IDs,
missing records, loading, and retryable read failures have separate states.
The update service validates input, excludes the current record from email uniqueness
checks, preserves its ID, and replaces only the selected record after a confirmed
storage write. Save failures preserve form values. Successful updates return to the
refetched directory with a dismissible notification.

Create and edit share components/EmployeeForm.tsx, the form hook, validation, and
CSS. The edit page owns route composition; useEmployeeRecord owns retrieval state.
Build and lint pass. Expanded service checks cover editing, unchanged peer records,
ID tampering, duplicate email, missing records, and storage failures. Browser visual
and interaction verification remains pending. Next slice: confirmed employee deletion.

## Checkpoint 6 — explicit type boundaries and Edit styling

User clarification: interfaces and type declarations must live outside components,
pages, and hooks. Feature contracts belong in employee.types.ts; reusable component
props belong in adjacent *.types.ts files. Import contracts with import type.
Extracted NotificationProps, EmployeeFormProps, EmployeeRecordProps, record-loading
state, touched-field state, and the older AppButton/ProjectCard/page example types.
Legacy example interfaces are now in dedicated type files rather than TSX files.

The Edit action has a dedicated violet secondary-button style, pencil icon, hover,
pressed and visible keyboard-focus states, plus reduced-motion handling. It remains
a semantic link because it navigates to the edit route.

Build, lint, and create/edit service regression checks passed. Browser visual QA
remains pending. No new CRUD slice was introduced during this correction.

## Checkpoint 7 — confirmed employee deletion

Added a styled row Delete action, reusable native confirmation dialog, dedicated
ConfirmDialog.types.ts and CSS, a separate modal-focus hook, and an employee deletion
hook. Cancel is focused initially. Escape/close/cancel dismiss before saving; controls
are locked while the request is pending. Focus returns to the trigger or directory
heading after removal. The UI filters the targeted record only after storage confirms
the write; counters derive from updated records and the selected profile is cleared
when appropriate. Success and error messages can be dismissed. A failed delete leaves
the dialog open for retry and preserves the employee. Selected department filter
options remain available after removing their last employee.

Build and lint passed. Service checks cover successful removal, unaffected records,
missing IDs, failed writes, corrupt storage, and persistence of an empty directory,
in addition to previous create/edit checks. Browser visual and keyboard verification
remain pending. Project dependency constraints will be implemented with assignments;
there is currently no project store. Next learning slice: project data model and list.

## Checkpoint 8 — dedicated top-level responsibility folders

The user requested a layer-based structure instead of feature-local services/hooks/
contracts. This supersedes all earlier feature-folder structure recommendations.
Moved active persistence to services/employees, all hooks to hooks grouped by scope,
object interfaces to interfaces, aliases/unions to types, active pages to
pages/employees, employee components to components/employees, and validation to
validation. Kept context in context and routes in routes. Earlier learning components
are in components/examples. Removed the emptied features, models, and component
folders. Updated all affected imports and CRUD verification source paths.

Moved route-ID validation into useEmployeeRoute and name formatting into utils.
README now describes the actual structure and responsibility boundaries. Build,
lint, and employee CRUD checks passed. Context remains inactive scaffolding; this
reorganization does not introduce authentication or change employee functionality.

## Checkpoint 9 — project model and directory

Added Project interface and separate status/priority/sort types. Constants, runtime
validation, date formatting, immutable filtering/sorting, mock storage, and directory
state each have dedicated files in their top-level responsibility folders.
/projects is linked from the sidebar and shows cards with code, description, owner,
status, priority, dates, and member count. Summary counts derive from loaded records.
Search, status, priority, and owner filters combine; all five required sort fields
support visible ascending/descending order. Unscheduled end dates sort last.
Loading, retry, empty-data, and no-results states are distinct.

Six sample projects initialize once, only with active owners from the current
employee store. No active employees means no seed is written; an explicitly saved
empty project array is preserved. Corrupt storage and invalid relationships are not
overwritten. Project-dependent employees cannot be deleted, and owners cannot be
made inactive. These failures identify the project. Reassignment is not available
yet; it will be implemented with project forms/assignments.

Production build, lint, and expanded service checks passed: seed persistence, invalid
dates, completed end-date requirement, combined filters, non-mutating sorting,
priority/date ordering, owner/member constraints, empty storage, and corruption
preservation. Browser visual and interaction verification remains pending.
Next slice: project creation with validated status, priority, dates, and owner.

## Checkpoint 10 — project creation

Added /projects/new and a styled Create project directory action. The page composes
ProjectForm, whose state and submission live in hooks/projects/useProjectForm.ts.
Owner retrieval has a separate hook. Contracts remain in interfaces/ and types/;
validation, services, and CSS remain in their dedicated top-level folders.

The form has project details, delivery settings, ownership, and a live draft summary.
Validation covers trimmed name/description lengths, normalized unique uppercase
codes, status/priority, real calendar dates, end >= start, completed end date, and
active existing owners. Create rechecks the current employee store before saving,
generates the ID, and writes once. A direct first creation starts the stored project
list without adding sample projects. Members start empty; assignment UI is later.

Touched/submitted fields expose associated errors. Loading/retry/no-owner states
are distinct. Submit is disabled while loading/saving or no owner is available.
Failures preserve values; successful storage returns to the refreshed directory
with a dismissible notification. Cancellation status preserves the record.

Build and lint passed. Expanded tests cover code uniqueness/normalization, invalid
status/priority/dates, same-day completion, inactive/missing owners, member constraints,
ID generation, persistence, concurrent unique/duplicate submissions, and storage
failure/corruption preservation, alongside prior employee and project checks.
Browser visual and keyboard verification remains pending. Next slice: project
editing and owner reassignment, followed by team assignments and deletion.

## Checkpoint 11 — project editing and owner reassignment

Added /projects/:id/edit and styled Edit project links on directory cards. Route
validation and record retrieval have separate hooks. A keyed loading component
mounts the shared project form only after an existing record is retrieved. Invalid
IDs, missing projects, loading, and retryable read failures have distinct states.

Update preserves the route ID and checks code uniqueness excluding the current
record. It validates the current employee store and writes only after validation.
The service preserves the latest stored team, removing a member only when that
person becomes owner. The previous owner is not automatically added to the team.
The form explains this policy. Cancelling a project retains its record. Failures
preserve entries; success returns to the refreshed directory with dismissible feedback.

Interfaces/types remain outside pages/components/hooks. ProjectRecordState and
ProjectUpdateInput are in types; prop contracts are in interfaces. Build, lint,
and expanded regression checks passed, including immutable IDs, unchanged peers,
code conflicts, invalid dates/owners, missing records, failed writes, latest-team
preservation, owner/member constraints, and cancellation history. Browser visual
and keyboard verification remains pending. Next slice: team-assignment controls.

## Checkpoint 12 — system-managed project codes

Project codes are now generated at creation (PRJ-0001, PRJ-0002, etc.), choosing an
unused value from saved projects immediately before writing. Existing codes remain
unchanged. Creation/update input types exclude code; updates explicitly retain the
stored code even if an untyped caller supplies another. The form disables code in
both modes, explains automatic assignment for creation, and displays the immutable
code during editing. Other fields retain their existing editing behavior.

Generation is a pure utility; allocation occurs in the service and storage rejects
duplicate codes. Project creation/update/seed writes use Web Locks where supported
to coordinate browser tabs, with the existing synchronous same-tab fallback.
A future backend must enforce uniqueness centrally; local storage is not a shared
multi-user database. Tests cover concurrent creation, existing-code collisions,
caller-supplied-code override attempts, and edit immutability. Build, lint, and
regression checks passed. Browser UI verification remains pending.

## Checkpoint 13 — project details and team assignments

Added /projects/:id and Details & team links. Details show project metadata and the
owner separately. useProjectTeam owns draft membership, search, discard, saving,
and feedback; contracts remain in interfaces, UI in components/pages, styles in
styles/projects, and persistence in services/projects.

Checkboxes prevent duplicate UI selection. The service validates unique existing
employee IDs and excludes the owner. Inactive employees are labelled and allowed as
members per the supplied specification. Save team persists only membership against
the latest stored project; discard restores the saved selection. Removing membership
does not delete employees. Pending saves prevent duplicate submissions. Failures
retain the selection; successful saves show a dismissible notification. Missing
project, employee loading/retry, empty directory, and no-search-results states exist.

Build, lint, and service regression checks passed: membership persistence/removal,
owner and duplicate rejection, unknown employee IDs, empty teams, unchanged employee
records, failed-write preservation, dependency release after removal, and concurrent
project-edit/team saves preserving both changes. Browser visual/keyboard checks
remain pending. Next slice: project deletion with confirmation and dependency cleanup.

## Checkpoint 14 — confirmed project deletion

Added styled project-card Delete actions and a dedicated useProjectDeletion hook.
Confirmation names the project/code, explains assignment removal and preserved
employees, and distinguishes deletion from the Cancelled status used for history.
The shared confirmation dialog now accepts pending text and a fallback focus target;
project deletion returns focus to the project portfolio heading if its trigger is gone.
The targeted action is disabled during saving. Failed saves retain the project/dialog;
success removes only that record and shows a dismissible notification. Summary counts
update from the remaining data; an active owner filter remains selectable after its
last matching project is removed.

Deletion uses the project write lock, preserves all employee records, and naturally
releases dependencies belonging to the removed project. Retired project ID/code pairs
are saved before removal so future projects cannot reuse identifiers. A failed removal
after successful reservation is safe to retry. No retired names or descriptions are
stored. An empty project array remains empty on reload.

Build, lint, and expanded regression checks passed, including unchanged peers and
employees, failed writes, retry after partial failure, dependency cleanup, missing
records, empty-directory persistence, and non-reused identifiers. Browser visual and
keyboard verification remain pending. Next slice: employee profiles and their project
relationships, before the operational dashboard.

## Checkpoint 15 — employee profiles and project relationships

The directory now links to /employees/:id instead of an inline placeholder. A
profile presents contact information, status, department, an edit action, and
separate lists for project ownership and team membership. Project cards link to
project details and retain completed/cancelled history. Responsive CSS provides
an identity header, relationship cards, focus styles, and reduced-motion support.

Employee and project loading are independent: project-read failures preserve the
employee details and offer retry. Counts remain unknown until relationships load.
Missing/invalid employee routes and genuinely empty relationships have explicit
states. The read-only relationship service does not initialize sample projects.
The old selected-profile state and placeholder styles were removed.

Learning flow: EmployeeProfilePage -> EmployeeProfileRecord -> EmployeeProfile;
useEmployeeRecord and useEmployeeProjects manage async state; employeeProjectService
reads persisted relationships. Interfaces, state types, hooks, services, and CSS
remain in their dedicated top-level folders.

Build, lint, and service regression checks passed, including owner/member separation,
unrelated employee exclusion, missing employees, read-only/no-seeding behavior,
deleted assignments disappearing, and corrupt storage rejection. Browser visual
and keyboard checks remain pending. Next slice: the operational dashboard.

## Checkpoint 16 — operational dashboard

Overview is now available at /overview and is the home route. It presents total and
active employees, open projects, overdue projects, portfolio status meters, and up
to five open-project deadlines. Quick actions open the existing creation forms;
deadlines link to project details. The layout uses a dark illustrated introduction,
metric cards, responsive panels, focus styles, and reduced-motion support.

Open means planning or active. Overdue means an open project's end date is before
the local calendar day; today is not overdue. Completed/cancelled projects remain
in the status distribution but not open deadlines. Unscheduled projects are excluded
from deadlines. Counts reflect real persisted records without simulated trends.

The service reuses getProjectDirectory, including first-run demo initialization and
relationship validation; intentionally empty portfolios stay empty. Pure aggregation
lives in summarizeWorkspace. useDashboard owns loading, errors, and refresh. Pages
compose separate presentation components; contracts, types, services, hooks, and CSS
remain in their dedicated top-level folders. The dated snapshot explicitly offers
Refresh; revisiting the route also reloads data. No backend or authentication added.

Build, lint, and service/aggregation regressions passed. Checks cover overdue day
boundaries, status exclusions, unscheduled projects, empty workspaces, deadline
limits/tie ordering, counts, and preservation of source order. Browser visual and
keyboard verification remain pending. Review this dashboard before the next slice.

## Checkpoint 17 — navigation order and mock role permissions

Overview now appears before People and Projects. The root route and brand link both
open Overview; direct detail URLs remain usable. The topbar provides a labelled demo
role selector. Each reload defaults to Administrator; no login or identity is claimed.

The specification's roles are centralized: Administrator has all write permissions;
Manager can create/edit projects and assign teams but cannot delete projects or
manage employees; Viewer can read all screens. PermissionGate controls UI actions,
ProtectedRoute blocks direct create/edit URLs, and mock services check permission
at write time, including after asynchronous waits. AuthProvider and useAuth expose
the current role. Role changes remount route content to discard stale forms/dialogs.
Types, interfaces, services, hooks, context, routes, and styling remain separate.

Build and service regressions passed, including viewer write rejection, unchanged
records after rejected writes, Manager project creation/edit/assignment, forbidden
Manager deletion, and role changes during pending writes. This is a role-ready demo;
backend authorization remains necessary when the API exists. Core accessibility
uses semantic controls, labels, focus styling and existing dialog focus management;
full browser keyboard/contrast/responsive verification is still outstanding.

## Checkpoint 18 — shell accessibility corrections (browser QA blocked)

Added useRouteAccessibility: path changes focus the main landmark without scrolling
it under the sticky header, reset the viewport, and set a section-specific document
title. Initial focus and same-path notification dismissal are left alone. The sidebar
can scroll on short desktop viewports, with decorative content hidden where height
is limited. Sidebar buttons/navigation and the role selector now have 44px minimum
targets. Tablet sidebar padding accommodates the larger toggle. Decorative icons
are hidden from assistive technology; the sidebar slogan is no longer an h2.

Build and lint passed. Browser automation failed with a session-mismatch error when
opening the isolated local preview. No visual, keyboard, responsive, contrast, or
screen-reader pass is claimed. Outstanding manual checks: Tab to Skip to content;
activate it; navigate between sections and verify main focus; collapse/expand at
320px, tablet, and desktop widths; check a short-height viewport and sticky header;
verify role selector reachability and absence of horizontal overflow. Continue with
forms/dialogs and role UI verification after shell browser checks are available.

## Checkpoint 19 — actionable Overview, first slice

Added Where to focus: overdue, due today through seven days ahead, and open projects
with no general team members. Owners do not count as members; completed/cancelled
projects are excluded. Categories may overlap and are not summed. Zero counts are
neutral, with links to an explicit empty result. Existing permission gates remain.

Shared rules live in utils/projectAttention.ts, labels in constants, and category
unions/contracts in types/interfaces. summarizeWorkspace computes counts using the
same matcher used by the project directory. AttentionSummary owns presentation in
a separate CSS module; DashboardPage only composes it. dashboardService shares the
local-day helper. The portfolio reads ?attention= from the URL, combines it with
existing filters, displays an explanatory banner, and supports clearing it. Unknown
attention values are ignored. Full URL filters and table/card views are next slice.

Build, lint, and regressions passed. Tests cover today/seven-day boundaries, month
and year rollover, missing dates, no-members semantics, closed-project exclusions,
invalid query values, and summary/result agreement. Existing browser session mismatch
still prevents visual/keyboard verification; this slice is not claimed browser-tested.

## Checkpoint 20 — portfolio views and persistent filters

Added Cards/Table display buttons with aria-pressed state. Both consume the same
filtered/sorted project list. ProjectTable uses semantic headings and a keyboard
focusable horizontal scroll region, with names/codes, owners, statuses, priorities,
dates, member counts, and shared ProjectActions. Card actions retain Details at the
start and Edit/Delete grouped at the end. Permission gates and deletion confirmation
are shared across views; no additional service operations were introduced.

useProjects now derives filters and view mode from URL search parameters, using
projectQuery pure parsing/update/reset helpers. Unknown values fall back safely;
owner IDs must be positive safe integers. Search replaces history entries; select
and view changes push entries. Reset clears filters/attention/sort while retaining
view and unrelated parameters. Individual search/status/priority/owner chips can be
removed. Unavailable owner IDs retain an explicit option instead of a blank select.

Build, lint, and regressions passed, including query parsing, invalid values, special
characters, input immutability, and reset/view preservation. Browser visual and
keyboard checks remain pending due to the earlier session mismatch. Next slice:
shared interaction consistency, form safeguards, loading feedback, and motion.

## Checkpoint 21 — employee/project form safeguards

Introduced useUnsavedChanges and a separate UnsavedChangesDialog. Employee and
project create/edit forms compare current values with their initial snapshot and
show a visible draft status. Dirty forms block in-app navigation, including Cancel,
sidebar links and browser Back, with Stay/Discard choices; pending saves prevent
discard. Refresh/close use the browser's native beforeunload warning (browser policy
controls its display). Successful saves bypass the blocker, while failures retain
values and dirty state. The demo role selector is disabled during dirty/pending
forms because switching roles would remount and discard the current form.

Routing moved from BrowserRouter/Routes to createBrowserRouter/RouterProvider to
support React Router's navigation blocker, with existing routes preserved. Existing
field validation, focus handling, and live saving announcements remain. Interfaces,
hooks, presentation, and CSS stay separate. This increment covers employee/project
forms; project-team draft safeguards and broader loading/motion consistency remain.

Build, lint and existing service regressions passed. Browser testing is still pending:
verify clean Cancel, dirty Stay/Discard, Back, reload warnings, reverting to initial
values, failed-save retention, successful-save navigation, and role-switch disabling.
The earlier browser session error prevents claiming these interactions verified.

## Checkpoint 22 — team draft safeguards and interaction feedback

useProjectTeam now connects its saved-versus-selected comparison to the shared
unsaved-change guard. Navigation prompts Stay/Discard, reload requests the native
browser warning, and role switching is disabled while dirty or saving. Successful
team saves update the baseline without navigation; the guard closes an outstanding
leave prompt once the draft is clean. Subsequent edits remain protected. The hook
also checks assignment permission before local selection changes and saves.

ProjectTeam renders the shared leave dialog and a reusable LoadingSkeleton with
separate props and CSS. Selected rows and the dirty action area have restrained
visual feedback. Reduced-motion preferences disable skeleton and new transitions.
Viewer assignment inputs stay disabled, while search/clear-search remain usable.
Long member names wrap inside chips. Service regression checks passed; browser
interaction checks remain pending. Specifically verify save-then-edit protection,
failed save retention, Discard, Back navigation, and Viewer search clearing.

## Checkpoint 23 — assigned tasks and employee progress

Added /projects/:id/tasks, linked from project details. Administrator/Manager can
create tasks, edit titles/assignees, and update progress. Employee is a new demo role:
select an active employee in the topbar to update only tasks assigned to that person.
Viewer stays read-only. These are local role previews, not verified identities.

Tasks have a title, assignee, 0–100 integer progress, updated timestamp and revision.
They are stored inside their project so project deletion removes tasks in the same
write. Legacy projects without tasks remain valid and start empty. Project general
edits preserve the latest tasks. Assignments require an active owner/team member;
removing an assignee or replacing an owner with assigned tasks requires reassignment
first. Completed/cancelled projects expose read-only tasks. Reassignment preserves
progress. No task deletion, due dates, comments, or activity log added in this slice.

Task services/hooks/interfaces/types/validation/components/styles are separate. The
workspace uses an explicit single editor, unsaved-change protection and pending-save
guards. Role/identity changes are disabled while dirty. The equal-weight task average
is null without tasks, and never changes project status. Revision checks reject stale
saves. Last-updated timestamps change only after a successful write.

Build, lint and expanded service regressions passed: own-task access, missing identity,
Viewer/Employee creation restrictions, invalid progress, stale revisions, failed-write
preservation, project-edit preservation, task reassignment dependencies, closed-project
restrictions, malformed task storage rejection and project-delete task cleanup.
Browser visual/keyboard verification is still pending due to the session blocker.

Manual walkthrough: create a task as Administrator, assigning an active project
owner/member; choose Employee and that person in the topbar; open Tasks & progress;
update and save a percentage; refresh; confirm the saved progress and average. Select
a different employee to verify the first task has no Update progress action.

## Checkpoint 24 — employee My tasks queue

Added /my-tasks and an Employee-only sidebar link. The page prompts for an explicit
active demo employee before loading. The service derives identity from the current
mock session, rejects other roles/missing identities, reads existing project tasks
without seeding projects, and returns only assignments for the selected employee.

The queue displays open-project assignment/completion/project counts, search across
task/project/code, progress filters, and an Include closed projects control for
history. Results sort by lowest progress then deterministic project/task names.
Closed projects are labelled read-only. Cards link to the existing project task
workspace to update progress, so there is one save/permission implementation. Refresh
and route re-entry load current storage. Empty assignments, filtered empty results,
loading and storage failures are distinct states. No fake deadlines were introduced.

Changes are separated across myTasksService, useMyTasks, assignedTasks utilities,
interfaces/types, MyTasksWorkspace presentation, MyTasksPage, and a CSS module.
Build, lint and regressions passed, including session-derived task isolation, missing
identity, foreign/missing employee selection, closed-project inclusion, combined
search/progress filters, and legacy projects without tasks. Browser UI verification
remains pending due to the existing session blocker.

## Checkpoint 25 — corrected project-based completion reporting

User clarified that OpsFlow is not a personal task tracking application. My tasks
navigation is removed and the former route redirects to Projects. Employees now
see only their assigned task cards inside a project, with the completion editor
embedded in the selected card. They cannot create, assign, reassign, or schedule
work. Administrator/Manager retains assignment controls.

Project cards and table rows now show a shared ProjectProgress component: the saved
equal-weight completion average, progress bar, and a link to assigned task cards.
No assigned tasks displays a dash, not a fabricated 0%. Returning to the portfolio
reloads saved project data. The large tracker summary was removed from the task
screen. Task cards explicitly label task status and the scheduled flag.

Confirmed rules: Administrator/Manager sets Scheduled/Not scheduled; Employee updates
only percentage. Status is derived: 0 Not started, 1–99 In progress, 100 Complete.
Optional scheduled boolean preserves legacy tasks (missing means not scheduled).
Progress saves preserve the scheduled flag. Validation rejects non-boolean flags.
Build, lint and regressions passed, including aggregate percentages, scheduled flag
preservation, and employee assignment/schedule-write rejection. Browser visual checks
remain pending. This checkpoint supersedes the personal-queue scope in checkpoint 24.

## Checkpoint 26 — explicit refresh and draft reset

Investigating reported assignment names remaining after navigation: code inspection
confirmed task Refresh was disabled while dirty and project team lacked an explicit
refresh action. Added shared useRefreshConfirmation and refresh wording to the
unsaved-changes dialog. Task refresh now confirms discarding a dirty draft, clears
editor values/messages, and reloads project/tasks/employees. Team Refresh saved team
uses the record reload flow to remount the team and reload employees. Saved records
remain untouched; refreshing is not deletion. Pending saves block refresh.

Build, lint and existing service regressions passed. Browser reproduction of the
reported navigation behaviour remains pending. Asked whether the observed names were
saved assignments or unsaved selections; do not infer a persistence bug from saved
names returning. Same-route navigation refresh behaviour has not been changed.

## Checkpoint 27 — distinct selected and available member lists

Project details now excludes selected member IDs from the available employee picker.
Checking a name moves it into Selected members; removing its chip returns it to the
available list and clears search so it is visible. The owner remains separate.
An all-selected empty state differs from no eligible employees and no search matches.
Selection changes are announced and focus returns to the search control because the
activated row/chip is removed. Save/Discard and task dependency checks are preserved.
Lint passed; browser interaction verification remains pending.

## Checkpoint 28 — login design and product showcase

Read the authentication specification and implemented the approved first design
slice at /login, outside AppShell. Wide layout uses a 44/56 split, a restrained
email/password panel, navy/teal product previews, and three captions/scenes. Local
HTML/CSS mockups avoid external imagery/video/fonts. Sample figures are labelled
illustrative, not live data. Mobile hides the showcase and prioritizes the form.

useAuthShowcase owns autoplay, visibility, scene selection and motion preference.
The sequence advances every six seconds, pauses offscreen/backgrounded and on focus,
and provides previous/next, scene selectors, and pause/play controls. Reduced motion
uses static previews without autoplay or entry transforms. Password visibility is
available; sign-in/recovery are disabled and the page explicitly states that no
credentials are sent or stored. No authenticated-session claim or route protection
was added; existing demo routes are unchanged pending the core-auth slice.

Responsibilities remain separated across pages/auth, components/auth, hooks/auth,
interfaces, constants and styles/auth. Browser visual/keyboard QA remains pending
because the browser session mismatch has not been resolved. Before core auth, agree
the mock versus backend session contract, retain Employee role, and reconcile the
specified /dashboard route with existing /overview links.

## Checkpoint 29 - Login-first workspace boundary

- `routes/RequireSession.tsx` gates the entire application shell, including direct links. The login page stays public; successful sign-in restores an allowlisted internal destination.
- `services/auth/sessionService.ts` provides disposable demo authentication. Credentials shown on login: admin@opsflow.demo / OpsFlowDemo!23. Session state is memory-only: reloading requires sign-in. This is a frontend demonstration, not production security or real employee identity verification.
- `context/AuthProvider.tsx` exposes session/sign-in/sign-out alongside existing demo role permissions. Service mutation permission checks also require a session.
- `hooks/auth/useLoginForm.ts` owns validation and submission state. Components render the form and sign-out action; session interfaces and styling remain separate.
- Sign-out unmounts protected content and resets demo identity. Saved mock business records remain available after the next sign-in. Save/discard dirty forms before signing out.
- No backend authentication, password recovery, persistent session, or secure cookie flow is implemented in this checkpoint. Demo role switching remains a testing tool.
- Regression coverage includes wrong credentials, exact password handling, sign-out permissions, and unsafe return destinations. Browser interaction verification remains pending.

## Shared color system - Foundations-inspired palette

Login and workspace styling now share tokens in src/index.css. Indigo (#3D52A0) anchors actions and branded panels; periwinkle (#7091E6) supplies decorative highlights; blue-grey (#8697C4) and mist (#ADBBDA) support secondary decoration; lavender (#EDE8F5) softens feature surfaces. Darker ink and muted tokens provide readable text. Periwinkle is not used for small text on white.

Component styles use these tokens across the shell, login/showcase, overview, employees, projects, task progress, forms and dialogs. Red/amber/green semantic states remain distinct. The existing 60/40 login layout and showcase-only inset are unchanged. Build/lint and core palette contrast checks accompany this change; browser visual verification remains pending.

## Palette refinement - approved indigo / navy direction

The active palette now uses indigo #6366F1, navy #0F172A, supporting blue #3B82F6 and violet #8B5CF6. White cards sit on #F8FAFF with #EEF2FF selected surfaces. Shared semantic tokens cover emerald success, amber warning, and red errors, with darker readable text variants. Button fills and small links use #4F46E5 for stronger contrast than the decorative indigo.

Changes cover shared tokens, shell selection and focus states, login/showcase, dashboard/chart, employee and project pages, forms and dialogs. Existing layout and application logic are preserved. Build and lint passed; checked core text pairs exceed 4.5:1. Browser visual verification is still pending.
