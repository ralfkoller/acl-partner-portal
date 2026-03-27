interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-[3px] h-6 rounded-full bg-acl-orange mr-3" />
        <h2 className="text-xl font-bold text-acl-dark">{title}</h2>
      </div>
      {action}
    </div>
  )
}
