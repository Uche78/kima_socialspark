"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlideCanvas, type SlideCanvasProps } from "@/components/SlideCanvas";
import type { Slide } from "@/lib/types";

const THUMB = 72;

type Props = {
  slides: (Slide & { id: string })[];
  active: number;
  disabled: boolean;
  canvasProps: Omit<SlideCanvasProps, "slide" | "index">;
  onSelect: (index: number) => void;
  onReorder: (from: number, to: number) => void;
};

/** Thumbnail strip of carousel slides. Drag (mouse or touch) or use the keyboard to reorder. */
export function SortableSlideStrip({ slides, active, disabled, canvasProps, onSelect, onReorder }: Props) {
  const sensors = useSensors(
    // Mouse: a small movement threshold so a plain click still selects the slide.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Touch: press and hold to pick a slide up, so a normal swipe scrolls the strip.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active: dragged, over }: DragEndEvent) {
    if (!over || dragged.id === over.id) return;
    const from = slides.findIndex((s) => s.id === dragged.id);
    const to = slides.findIndex((s) => s.id === over.id);
    if (from >= 0 && to >= 0) onReorder(from, to);
  }

  return (
    <DndContext id="slide-strip" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={slides.map((s) => s.id)} strategy={horizontalListSortingStrategy} disabled={disabled}>
        <div className="flex max-w-[480px] gap-2 overflow-x-auto pb-2">
          {slides.map((s, i) => (
            <Thumb key={s.id} slide={s} index={i} selected={i === active} disabled={disabled} canvasProps={canvasProps} onSelect={onSelect} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function Thumb({
  slide,
  index,
  selected,
  disabled,
  canvasProps,
  onSelect,
}: {
  slide: Slide & { id: string };
  index: number;
  selected: boolean;
  disabled: boolean;
  canvasProps: Props["canvasProps"];
  onSelect: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id, disabled });
  const height = (THUMB * canvasProps.height) / canvasProps.width;
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      aria-label={`Slide ${index + 1}${disabled ? "" : ", drag to reorder"}`}
      onClick={() => onSelect(index)}
      className={`relative shrink-0 overflow-hidden rounded-md border-2 ${selected ? "border-brand" : "border-transparent"} ${
        disabled ? "" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "z-10 opacity-80 shadow-lg ring-2 ring-accent" : ""}`}
      style={{ width: THUMB, height, transform: CSS.Transform.toString(transform), transition, touchAction: "manipulation" }}
    >
      <div style={{ transform: `scale(${THUMB / canvasProps.width})`, transformOrigin: "top left", width: canvasProps.width, height: canvasProps.height, pointerEvents: "none" }}>
        <SlideCanvas {...canvasProps} slide={slide} index={index} />
      </div>
      <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 text-[10px] font-semibold text-white">{index + 1}</span>
    </button>
  );
}
