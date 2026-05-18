import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { api } from '@/services/api'
import { LearningResource } from '@/types'
import { Code, Brain, Shield, GraduationCap, Languages, Dumbbell, Plus, Trash2 } from 'lucide-react'

const domains = [
  { id: 'coding', name: 'Coding', icon: Code, color: 'var(--info)' },
  { id: 'aiml', name: 'AI/ML', icon: Brain, color: 'var(--accent-primary)' },
  { id: 'cybersec', name: 'Cyber Security', icon: Shield, color: 'var(--error)' },
  { id: 'cds', name: 'CDS Exam', icon: GraduationCap, color: 'var(--success)' },
  { id: 'ssc', name: 'SSC CPO', icon: GraduationCap, color: 'var(--warning)' },
  { id: 'english', name: 'English', icon: Languages, color: 'var(--info)' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'var(--warning)' },
]

export default function Learning() {
  const queryClient = useQueryClient()
  const [selectedDomain, setSelectedDomain] = useState('coding')
  const [newResource, setNewResource] = useState<{
    resource_name: string
    resource_type: LearningResource['resource_type']
  }>({ resource_name: '', resource_type: 'course' })

  const { data: learningData } = useQuery<LearningResource[]>({
    queryKey: ['learning', selectedDomain],
    queryFn: () => api.get<LearningResource[]>(`/learning/${selectedDomain}`),
  })

  const addResourceMutation = useMutation<LearningResource, Error, {
    resource_name: string
    resource_type: LearningResource['resource_type']
    domain: string
  }>({
    mutationFn: (data) => api.post<LearningResource>('/learning', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learning', selectedDomain] }),
  })

  const updateProgressMutation = useMutation<LearningResource, Error, { id: number; progress: number }>({
    mutationFn: ({ id, progress }) => api.put<LearningResource>(`/learning/${id}`, { progress }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learning', selectedDomain] }),
  })

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => api.delete<void>(`/learning/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learning', selectedDomain] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addResourceMutation.mutate({ ...newResource, domain: selectedDomain })
    setNewResource({ resource_name: '', resource_type: 'course' })
  }

  const currentDomain = domains.find(d => d.id === selectedDomain)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Learning Tracker</h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1">Track your progress across all domains</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => setSelectedDomain(domain.id)}
            className="p-4 rounded-lg transition-all"
            style={{
              backgroundColor: selectedDomain === domain.id ? 'var(--accent-primary)' : 'var(--bg-hover)',
              border: selectedDomain === domain.id
                ? '2px solid var(--accent-primary)'
                : '1px solid var(--border-color)',
            }}
          >
            <domain.icon className="w-6 h-6 mx-auto mb-2" style={{ color: domain.color }} />
            <span
              className="text-sm font-medium block"
              style={{ color: selectedDomain === domain.id ? 'white' : 'var(--text-secondary)' }}
            >
              {domain.name}
            </span>
          </button>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {currentDomain && <currentDomain.icon className="w-8 h-8" style={{ color: currentDomain.color }} />}
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{currentDomain?.name} Progress</h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">Track your courses, projects, and resources</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            value={newResource.resource_name}
            onChange={(e) => setNewResource({ ...newResource, resource_name: e.target.value })}
            placeholder="Resource name (e.g., Python Course)"
            className="flex-1 min-w-[200px]"
          />
          <select
            className="input-field min-w-[130px]"
            value={newResource.resource_type}
            onChange={(e) => setNewResource({
              ...newResource,
              resource_type: e.target.value as LearningResource['resource_type'],
            })}
          >
            <option value="course">Course</option>
            <option value="project">Project</option>
            <option value="book">Book</option>
            <option value="lab">Lab</option>
          </select>
          <Button type="submit" disabled={addResourceMutation.isPending}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </form>

        <div className="space-y-4">
          {learningData?.length === 0 && (
            <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No resources added yet</p>
          )}
          {learningData?.map((item: LearningResource) => (
            <div
              key={item.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: 'var(--bg-hover)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.resource_name}</h3>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.resource_type}</span>
                </div>
                <button onClick={() => deleteMutation.mutate(item.id)}>
                  <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                </div>
                <span className="text-sm w-12 text-right" style={{ color: 'var(--accent-primary)' }}>{item.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(e) => updateProgressMutation.mutate({ id: item.id, progress: parseInt(e.target.value) })}
                className="w-full mt-2"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.slice(0, 6).map((domain) => {
          const domainData = learningData || []
          const completed = domainData.filter((i: LearningResource) => i.completed).length
          return (
            <Card key={domain.id} className="p-4">
              <div className="flex items-center gap-3">
                <domain.icon className="w-8 h-8" style={{ color: domain.color }} />
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{domain.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{domainData.length} resources &bull; {completed} completed</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
