import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { userApi, gamificationApi } from '@/services/api'
import { Achievement, Profile as ProfileType, XPInfo, XPLog } from '@/types'
import { Trophy, Medal, Zap, User, Settings } from 'lucide-react'

export default function Profile() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({ username: '', bio: '' })

  const { data: profile } = useQuery<ProfileType>({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
  })

  const { data: xpInfo } = useQuery<XPInfo>({
    queryKey: ['xp'],
    queryFn: () => gamificationApi.getXP(),
  })

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: () => gamificationApi.getAchievements(),
  })

  const { data: xpLogs } = useQuery<XPLog[]>({
    queryKey: ['xp-logs'],
    queryFn: () => gamificationApi.getXPLogs(),
  })

  const updateMutation = useMutation<ProfileType, Error, { username: string; bio: string }>({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setEditing(false)
    },
  })

  const earnedAchievements = achievements?.filter((a) => a.earned) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1">Your operative information and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Username</label>
                    <Input
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Bio</label>
                    <Input
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => updateMutation.mutate(profileData)}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {profile?.username || 'Operative'}
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: 'var(--accent-primary)', color: 'white', opacity: 0.9 }}
                    >
                      {xpInfo?.rank || 'Private'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }} className="mt-2">
                    {profile?.bio || 'No bio yet. Click edit to add one.'}
                  </p>
                  <Button variant="ghost" className="mt-4" onClick={() => {
                    setProfileData({ username: profile?.username || '', bio: profile?.bio || '' })
                    setEditing(true)
                  }}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Combat Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Total XP</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{xpInfo?.total_xp || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Level</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{xpInfo?.level || 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal className="w-5 h-5" style={{ color: 'var(--info)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Achievements</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{earnedAchievements.length}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements?.slice(0, 8).map((a: any) => (
              <div
                key={a.id}
                className="p-3 rounded-lg"
                style={{
                  border: a.earned
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-color)',
                  backgroundColor: a.earned
                    ? 'var(--accent-primary)'
                    : 'var(--bg-hover)',
                  opacity: a.earned ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4" style={{ color: a.earned ? 'white' : 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: a.earned ? 'white' : 'var(--text-secondary)' }}>
                    {a.name}
                  </span>
                </div>
                {a.earned && (
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    +{a.xp_reward} XP
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent XP</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {xpLogs?.map((log: XPLog) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{log.description}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{log.source}</p>
                </div>
                <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>+{log.amount} XP</span>
              </div>
            ))}
            {(!xpLogs || xpLogs.length === 0) && (
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">No XP history yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
