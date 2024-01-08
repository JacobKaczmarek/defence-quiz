import { Input } from "@/components/ui/input"
 
type Props = React.InputHTMLAttributes<HTMLInputElement>

export function FileInput({ ...props }: Props) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5" >
      <Input {...props} type="file"/>
    </div>
  )
}