import type { Roadmap, RoadmapTask } from '../types/models';

const NODE_LABEL_PRESETS = ['Week', 'Session', 'Month', 'Module', 'Day'] as const;

export { NODE_LABEL_PRESETS };

export function getNodeUnitLabel(roadmap?: Pick<Roadmap, 'node_unit_label'> | null): string {
  const label = roadmap?.node_unit_label?.trim();
  return label && label.length > 0 ? label : 'Week';
}

export function defaultNodeTitle(unitLabel: string, nodeNumber: number): string {
  return `${unitLabel} ${nodeNumber}`;
}

/** estimated_hours column stores minutes in this codebase */
export function sumTaskMinutes(tasks: Pick<RoadmapTask, 'estimated_hours'>[]): number {
  return tasks.reduce((sum, task) => sum + (task.estimated_hours ?? 0), 0);
}

export function formatNodeDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—';

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  const roundedUpHours = Math.ceil(totalMinutes / 60);
  if (roundedUpHours > hours && mins >= 15) {
    return hours === roundedUpHours - 1
      ? `${hours}–${roundedUpHours} hours`
      : `${hours}h ${mins}m`;
  }

  return `${hours}h ${mins}m`;
}

export function nodeFilterLabel(unitLabel: string, nodeNumber: number): string {
  return `${unitLabel} ${nodeNumber}`;
}
