import { useQuery } from '@tanstack/vue-query'
import { ActivityAPI } from '../services/activity.service'

export function useActivityLogs(entityType?: string, entityId?: string) {
  return useQuery({
    queryKey: entityType && entityId
      ? ['activity-logs', entityType, entityId]
      : ['activity-logs'],
    queryFn: async () => {
      if (entityType && entityId) {
        const { data } = await ActivityAPI.getByEntity(entityType, entityId)
        return data
      } else {
        const { data } = await ActivityAPI.getRecent()
        return data
      }
    },
  })
}

export function useActorActivity(actorId: string) {
  return useQuery({
    queryKey: ['activity-logs', 'actor', actorId],
    queryFn: async () => {
      const { data } = await ActivityAPI.getByActor(actorId)
      return data
    },
    enabled: !!actorId,
  })
}
