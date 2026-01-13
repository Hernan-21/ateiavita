"use client";

import { MatchingPayload } from "@/types/content";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Check, X, GripVertical } from "lucide-react";

interface Props {
    payload: MatchingPayload;
    onComplete?: (score: number) => void;
}

interface DraggableItem {
    id: string;
    text: string;
    pairId: string;
}

export function MatchingTaskPlayer({ payload, onComplete }: Props) {
    // Left side: Fixed Slots (Terms)
    // Right side: Draggable Items (Translations)
    // Placements: Map<SlotId, DraggableItemId>

    const [items, setItems] = useState<DraggableItem[]>([]);
    const [placements, setPlacements] = useState<Record<string, string>>({}); // pairId -> itemId
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!payload.pairs) return;

        // Create draggable items from the 'right' side (Translations)
        // We shuffle them initially
        const newItems: DraggableItem[] = payload.pairs.map(p => ({
            id: `item-${p.id}`,
            text: p.right,
            pairId: p.id
        })).sort(() => Math.random() - 0.5);

        setItems(newItems);
        setPlacements({});
        setIsChecked(false);
    }, [payload]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // Logic:
        // Source 'pool': The initial list of draggable items
        // Destination 'slot-PAIRID': A specific target slot

        // If dropping back to pool
        if (destination.droppableId === 'pool') {
            const newPlacements = { ...placements };
            // Find where it was and remove
            Object.keys(newPlacements).forEach(key => {
                if (newPlacements[key] === draggableId) delete newPlacements[key];
            });
            setPlacements(newPlacements);
            return;
        }

        // If dropping into a slot
        if (destination.droppableId.startsWith('slot-')) {
            const slotId = destination.droppableId.replace('slot-', '');

            // Remove from old slot if any
            const newPlacements = { ...placements };
            Object.keys(newPlacements).forEach(key => {
                if (newPlacements[key] === draggableId) delete newPlacements[key];
            });

            // Add to new slot (replace existing if any? for now simple replace)
            newPlacements[slotId] = draggableId;
            setPlacements(newPlacements);
        }
    };

    const checkAnswers = () => {
        setIsChecked(true);
        // Calculate score
        let correct = 0;
        payload.pairs.forEach(pair => {
            const itemId = placements[pair.id];
            if (itemId && itemId === `item-${pair.id}`) {
                correct++;
            }
        });
        const score = Math.round((correct / payload.pairs.length) * 100);
        if (onComplete) onComplete(score);
    };

    const reset = () => {
        setPlacements({});
        setIsChecked(false);
    };

    // Helper to find which item is in a slot
    const getItemInSlot = (pairId: string) => {
        const itemId = placements[pairId];
        return items.find(i => i.id === itemId);
    };

    // Pending items are those NOT in placements
    const pendingItems = items.filter(i => !Object.values(placements).includes(i.id));

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="max-w-4xl mx-auto p-4 space-y-8 select-none">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">Match the Pairs</h3>
                    <p className="text-gray-500 text-sm">Drag the translations on the right to the correct terms on the left.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: TARGET SLOTS */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Terms</h4>
                        {(payload.pairs || []).map(pair => {
                            const placedItem = getItemInSlot(pair.id);
                            const isCorrect = isChecked && placedItem?.pairId === pair.id;
                            const isWrong = isChecked && placedItem && placedItem.pairId !== pair.id;

                            return (
                                <div key={pair.id} className="flex items-center justify-between bg-white border-2 border-gray-100 rounded-xl p-1 shadow-sm h-16">
                                    {/* Term Label */}
                                    <div className="px-4 font-bold text-gray-700 flex-1 truncate">
                                        {pair.left}
                                    </div>

                                    {/* Drop Zone */}
                                    <Droppable droppableId={`slot-${pair.id}`}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`
                                                    w-48 h-full rounded-lg transition-colors flex items-center justify-center border-l-2 border-dashed
                                                    ${snapshot.isDraggingOver ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-200'}
                                                    ${isCorrect ? 'bg-green-100 border-green-300' : ''}
                                                    ${isWrong ? 'bg-red-50 border-red-300' : ''}
                                                `}
                                            >
                                                {placedItem ? (
                                                    <Draggable draggableId={placedItem.id} index={0} isDragDisabled={isChecked}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`
                                                                    w-full h-full m-1 rounded bg-white shadow-sm flex items-center px-3 gap-2
                                                                    ${isChecked ? 'cursor-default' : 'cursor-grab'}
                                                                `}
                                                            >
                                                                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                                                                <span className="text-sm font-medium text-gray-800 truncate">{placedItem.text}</span>
                                                                {isCorrect && <Check className="w-4 h-4 text-green-600 ml-auto" />}
                                                                {isWrong && <X className="w-4 h-4 text-red-600 ml-auto" />}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ) : (
                                                    <span className="text-xs text-gray-300 font-medium">Drop here</span>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>

                    {/* RIGHT COLUMN: SOURCE POOL */}
                    <div>
                        <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Translations</h4>
                        <Droppable droppableId="pool" direction="vertical">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`
                                        bg-gray-100 rounded-xl p-4 min-h-[300px] space-y-3
                                        ${snapshot.isDraggingOver ? 'bg-gray-200' : ''}
                                    `}
                                >
                                    {pendingItems.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isChecked}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`
                                                        bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3
                                                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 rotate-2' : 'hover:border-indigo-300'}
                                                    `}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                                    <span className="font-bold text-gray-700">{item.text}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {pendingItems.length === 0 && !isChecked && (
                                        <div className="text-center text-gray-400 text-sm py-4 italic">
                                            All items placed
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    {!isChecked ? (
                        <button
                            onClick={checkAnswers}
                            disabled={pendingItems.length > 0}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Answers
                        </button>
                    ) : (
                        <button
                            onClick={reset}
                            className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div >
        </DragDropContext >
    )
}
