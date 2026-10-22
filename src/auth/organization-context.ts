/** Organization scope is explicit in the route; resource IDs and headers cannot override it. */
export function organizationIdFromRequest(request: {
  params?: Record<string, unknown>;
}): string | undefined {
  const id = request.params?.organizationId;
  return typeof id === 'string' && id.trim().length > 0 ? id : undefined;
}
