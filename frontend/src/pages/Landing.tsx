import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Target, Shield, GraduationCap, Dumbbell, Languages, Brain } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: Target, title: 'Mission System', desc: 'Daily tasks & goals' },
    { icon: Brain, title: 'AI Mentor', desc: '24/7 guidance' },
    { icon: Shield, title: 'Cyber Security', desc: 'Career prep' },
    { icon: GraduationCap, title: 'Exam Prep', desc: 'CDS & SSC' },
    { icon: Languages, title: 'English', desc: 'Communication' },
    { icon: Dumbbell, title: 'Fitness', desc: 'Discipline' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom right, var(--accent-primary), var(--bg-primary))', opacity: 0.15 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <nav className="flex justify-between items-center mb-16">
            <h1
              className="font-display text-3xl font-bold tracking-wider"
              style={{ color: 'var(--accent-primary)' }}
            >
              OP ASCEND
            </h1>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Enlist Now
              </Button>
            </div>
          </nav>

          <div className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              TRANSFORM YOUR
              <br />
              <span style={{ color: 'var(--accent-primary)' }}>FUTURE</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
              AI-powered military-themed self-improvement operating system.
              Master AI/ML, Cyber Security, exams, fitness & English in 18 months.
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="border rounded-xl p-6 text-center transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <feature.icon className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Join thousands transforming their lives</p>
            <div className="flex justify-center gap-8 text-3xl font-display font-bold" style={{ color: 'var(--accent-primary)' }}>
              <div>
                <div className="text-5xl">18</div>
                <div className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>Month Program</div>
              </div>
              <div>
                <div className="text-5xl">7</div>
                <div className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>Domains</div>
              </div>
              <div>
                <div className="text-5xl">100+</div>
                <div className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
