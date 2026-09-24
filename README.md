# OpsFlow

Employee and project management learning project built with React, TypeScript, and
Vite. The current implementation supports a locally persisted employee directory
with search/filter/sort, creation, editing, confirmed deletion, and notifications.
The project directory supports card/table views, removable filter chips, URL-persisted search/filter/sort/view state, and persisted sample projects. Project creation includes validated dates, automatically generated unique codes, and active owner selection. Project codes cannot be changed after creation. Project editing and owner reassignment are available. Project details include searchable team assignment with Save/Discard controls. Confirmed project deletion preserves employee records and retires project identifiers. Employee profiles show ownership and team memberships. The operational dashboard at /overview is the home page, with people/project metrics, status distribution, and open-project deadlines. Refresh reloads its local-data snapshot.

## Source structure

```text
src/
  components/
    dashboard/    Metrics, portfolio status, and deadline presentation
    common/       Reusable notification and confirmation UI
    employees/    Employee form and record-loading presentation
    layout/       Application shell
    examples/     Earlier learning components; not active application routes
  constants/      Shared project status/priority values and labels
  context/        Shared demo role and permission context/provider
  hooks/
    dashboard/    Overview loading, refresh, and error state
    common/       Dialog behavior and focus management
    employees/    Directory, forms, retrieval, deletion, and route-ID logic
    layout/       Sidebar and route-notification behavior
    projects/     Project directory state and filtering
  interfaces/     Object contracts and component props
  types/          Unions, aliases, and derived types
  pages/
    dashboard/    Overview route composition
    projects/     Project route composition
    employees/    Route-level employee UI composition
  routes/         Application route definitions
  services/
    dashboard/    Workspace snapshot service
    employees/    Active employee mock persistence service
    projects/     Project storage, mock seeds, and dependency checks
                   Older API service examples remain at services/ root
  styles/
    dashboard/    Responsive overview CSS module
    projects/     Project CSS modules
    employees/    Employee directory, form, and profile CSS modules
  utils/          Pure formatting helpers
  validation/     Pure validation and normalization rules
```

Keep services, hooks, interfaces, types, and context in their dedicated top-level
folders. Pages compose UI using components and hooks; they do not access storage,
perform service calls directly, define contracts, or implement validation rules.
Components render UI; hooks own behavior; services access data; validation contains
pure rules. Use `import type` for interfaces and types. CSS stays separate from TSX.

## Run and verify

- `npm run dev`: start the local preview.
- `npm run build`: compile TypeScript and create the production bundle.
- `npm run lint`: check source conventions.
- `node scripts/check-employee-create.mjs`: run employee/project CRUD and relationship service checks.

Mock records are saved in this browser's localStorage. They are not shared between
users or devices. The topbar Demo role selector previews Administrator, Manager, Viewer, and Employee permissions. Employee demo identity is explicitly selected; only own-task progress is editable. Reload resets to Administrator. These are frontend mock permissions, not authentication or server authorization; no backend is connected.

See [the implementation roadmap](docs/implementation-roadmap.md) for learning
checkpoints and outstanding work. The structure above supersedes the original
feature-oriented layout recorded in early checkpoints.











## Task progress

Open a project, then Tasks & progress. Administrators/Managers create assigned tasks
and can edit assignments or progress. The Employee demo role can update only the
selected active employee's assigned tasks. Progress is an integer from 0 to 100,
saved explicitly; project task progress is the equal-weight average. No tasks shows
an unknown average. Reaching 100% does not automatically complete the project.
Task records persist with their project. Reassign tasks before removing their assignee
from the team. Closed projects expose tasks read-only. Real identity and authorization
must be enforced by a backend when connected.
