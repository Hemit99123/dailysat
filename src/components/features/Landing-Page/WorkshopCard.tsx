import { cn } from "@/lib/utils"
import { Card } from "../../common/Card"
import { Badge } from "../../common/Badge"
import Image from "next/image"

interface WorkshopCardProps {
  image: string
  title: string
  partner: string
  attendees: string
  description: string
  className?: string
}

export function WorkshopCard({ image, title, partner, attendees, description, className }: WorkshopCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-white to-gray-50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <Badge className="bg-blue-500/10 text-blue-700 hover:text-white">{partner}</Badge>
          <span className="text-sm text-gray-500">{attendees} attendees</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Card>
  )
} 