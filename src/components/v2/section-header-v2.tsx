interface SectionHeaderV2Props {
  title: string
  action?: React.ReactNode
}

export function SectionHeaderV2({ title, action }: SectionHeaderV2Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-[3px] h-6 rounded-full bg-gradient-to-b from-acl-orange to-acl-orange-light mr-3" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}
