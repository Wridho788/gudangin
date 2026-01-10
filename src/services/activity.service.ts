import { api } from '../lib/axios'
import type { ActivityLog } from '../types'

export const ActivityAPI = {
  /**
   * Get activity logs by entity
   */
  getByEntity: (entityType: string, entityId: string) =>
    api.get<ActivityLog[]>('/order_logs', {
      params: {
        entity_type: `eq.${entityType}`,
        entity_id: `eq.${entityId}`,
        order: 'created_at.desc',
      },
    }),

  /**
   * Get recent activity logs
   */
  getRecent: (limit: number = 20) =>
    api.get<ActivityLog[]>('/order_logs', {
      params: {
        order: 'created_at.desc',
        limit,
      },
    }),

  /**
   * Get activity logs by actor
   */
  getByActor: (actorId: string, limit: number = 50) =>
    api.get<ActivityLog[]>('/order_logs', {
      params: {
        actor_id: `eq.${actorId}`,
        order: 'created_at.desc',
        limit,
      },
    }),
}
