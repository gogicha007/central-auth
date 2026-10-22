# Organization authorization

Organization-scoped routes declare `:organizationId` explicitly. Guards no longer interpret generic `:id`, `:orgId`, or organization headers as tenant scope. Membership must be active. Platform administrators retain their existing guard bypass, but role operations still enforce the resource's organization in the service.

Role endpoints now use:

- `PATCH /organizations/:organizationId/roles/:roleId`
- `POST /organizations/:organizationId/roles/:roleId/permissions`
- `DELETE /organizations/:organizationId/roles/:roleId/permissions/:permissionId`

The previous `/roles/:id` endpoints are removed. Update clients and Postman requests accordingly. Existing organization URLs keep the same shape; only their internal parameter name changes from `id` to `organizationId`.

The permission catalog has no organization ownership in the schema. `/permissions` endpoints therefore require platform administration; organization owners cannot modify global permission definitions. Owners and administrators can assign existing definitions to roles in their own organization.

Regression tests use mocks and an isolated Nest HTTP application; they do not write database records. Authentication is stubbed in HTTP tests, while the real role and platform authorization guards execute.

Run: `npm test -- --runInBand --no-cache --runTestsByPath src/auth/guards/organization-context.spec.ts src/auth/guards/permissions.guard.spec.ts src/roles/roles.service.spec.ts src/roles/roles.controller.spec.ts`.
