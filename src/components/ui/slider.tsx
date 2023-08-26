"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Label } from "~/components/ui/label";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="flex flex-row items-center space-x-2">
      {props.min && <Label>{props.min}</Label>}
      <SliderPrimitive.Root
        {...props}
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <TooltipProvider>
          <Tooltip open={visible}>
            <TooltipTrigger
              asChild
              onPointerEnter={() => {
                setVisible(true);
              }}
              onPointerLeave={() => {
                setVisible(false);
              }}
            >
              <SliderPrimitive.Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{props.value ?? [0]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SliderPrimitive.Root>
      {props.max && <Label>{props.max}</Label>}
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
