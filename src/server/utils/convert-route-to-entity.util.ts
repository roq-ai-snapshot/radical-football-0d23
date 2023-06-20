const mapping: Record<string, string> = {
  academies: 'academy',
  'performance-evaluations': 'performance_evaluation',
  players: 'player',
  'training-sessions': 'training_session',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
