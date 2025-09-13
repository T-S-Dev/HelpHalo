import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TooltipButton({
  children,
  tooltipContent,
  onClick = undefined,
}: {
  children: React.ReactNode;
  tooltipContent: string;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {onClick ? (
            <Button variant="ghost" size="sm" className="h-8" onClick={onClick}>
              {children}
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="h-8">
              {children}
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
